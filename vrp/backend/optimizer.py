from ortools.sat.python import cp_model
from typing import List, Tuple
from models import Patient, Phlebotomist, Assignment
from distance_calculator import haversine_distance
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def time_to_minutes(time_str: str) -> int:
    """Convert time string HH:MM to minutes from midnight."""
    hours, minutes = map(int, time_str.split(":"))
    return hours * 60 + minutes


def minutes_to_time(minutes: int) -> str:
    """Convert minutes from midnight to HH:MM format."""
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"


def optimize_assignments(
    patients: List[Patient],
    phlebotomists: List[Phlebotomist]
) -> Tuple[List[Assignment], List[str]]:
    """
    Optimize patient-phlebotomist assignments using OR-Tools CP-SAT solver.

    Returns:
        - List of assignments
        - List of unassigned patient IDs
    """
    model = cp_model.CpModel()

    num_patients = len(patients)
    num_phlebotomists = len(phlebotomists)

    # Decision variables: assignment[p][ph] = 1 if patient p is assigned to phlebotomist ph
    assignment = {}
    for p in range(num_patients):
        for ph in range(num_phlebotomists):
            assignment[(p, ph)] = model.NewBoolVar(f'assign_p{p}_ph{ph}')

    logger.info(f"Optimizing for {num_patients} patients and {num_phlebotomists} phlebotomists")

    # Constraint 1: Each patient is assigned to at most one phlebotomist
    for p in range(num_patients):
        model.Add(sum(assignment[(p, ph)] for ph in range(num_phlebotomists)) <= 1)

    # Constraint 2: Each phlebotomist has at most max_visits patients
    for ph in range(num_phlebotomists):
        if phlebotomists[ph].available:
            model.Add(
                sum(assignment[(p, ph)] for p in range(num_patients))
                <= phlebotomists[ph].max_visits
            )
            logger.info(f"Phlebotomist {phlebotomists[ph].name} ({phlebotomists[ph].gender}): max {phlebotomists[ph].max_visits} visits")
        else:
            # If phlebotomist is not available, they get no assignments
            model.Add(sum(assignment[(p, ph)] for p in range(num_patients)) == 0)
            logger.info(f"Phlebotomist {phlebotomists[ph].name} is NOT available")

    # Constraint 3: Gender preference constraint
    for p in range(num_patients):
        patient = patients[p]
        if patient.gender_preference != "any":
            logger.info(f"Patient {patient.name} prefers {patient.gender_preference} phlebotomist")
            for ph in range(num_phlebotomists):
                if phlebotomists[ph].gender != patient.gender_preference:
                    # Cannot assign this patient to this phlebotomist
                    model.Add(assignment[(p, ph)] == 0)

    # Objective: Maximize number of assignments (primary) and minimize distance (secondary)
    # We want to assign as many patients as possible
    num_assignments = []
    distance_costs = []

    for p in range(num_patients):
        for ph in range(num_phlebotomists):
            # Track assignments
            num_assignments.append(assignment[(p, ph)])

            # Calculate distance from phlebotomist to patient
            dist = haversine_distance(
                phlebotomists[ph].location,
                patients[p].location
            )
            # Scale by 1000 to work with integers, make it small compared to assignment weight
            dist_scaled = int(dist * 10)  # Reduced scaling for secondary objective
            distance_costs.append(assignment[(p, ph)] * dist_scaled)

    # Multi-objective: Maximize assignments (weight 10000) and minimize distance
    # Negative sum to maximize assignments
    model.Maximize(sum(num_assignments) * 10000 - sum(distance_costs))

    # Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30.0
    status = solver.Solve(model)

    # Log solver status
    status_map = {
        cp_model.OPTIMAL: "OPTIMAL",
        cp_model.FEASIBLE: "FEASIBLE",
        cp_model.INFEASIBLE: "INFEASIBLE",
        cp_model.MODEL_INVALID: "MODEL_INVALID",
        cp_model.UNKNOWN: "UNKNOWN"
    }
    logger.info(f"Solver status: {status_map.get(status, 'UNKNOWN')}")

    # Extract solution
    assignments = []
    assigned_patients = set()

    if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        # Group assignments by phlebotomist
        for ph in range(num_phlebotomists):
            patient_assignments = []
            total_ph_distance = 0.0

            for p in range(num_patients):
                if solver.Value(assignment[(p, ph)]) == 1:
                    assigned_patients.add(p)
                    dist = haversine_distance(
                        phlebotomists[ph].location,
                        patients[p].location
                    )
                    patient_assignments.append({
                        "patient_id": patients[p].id,
                        "patient_name": patients[p].name,
                        "visit_time": patients[p].visit_time,
                        "location": patients[p].location.dict(),
                        "distance_km": round(dist, 2)
                    })
                    total_ph_distance += dist

            if patient_assignments:
                # Sort by visit time
                patient_assignments.sort(key=lambda x: time_to_minutes(x["visit_time"]))

                assignments.append(Assignment(
                    phlebotomist_id=phlebotomists[ph].id,
                    phlebotomist_name=phlebotomists[ph].name,
                    patient_assignments=patient_assignments,
                    total_distance=round(total_ph_distance, 2)
                ))

    # Find unassigned patients
    unassigned = [
        patients[p].id
        for p in range(num_patients)
        if p not in assigned_patients
    ]

    logger.info(f"Assigned {len(assigned_patients)} patients, {len(unassigned)} unassigned")
    if unassigned:
        logger.warning(f"Unassigned patients: {unassigned}")

    return assignments, unassigned
