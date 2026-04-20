"""
Sample script to test the optimizer with sample data.
Run this to test the optimization logic without the web interface.
"""

from models import Patient, Phlebotomist, Location
from optimizer import optimize_assignments


def main():
    # Create sample patients
    patients = [
        Patient(
            id="p1",
            name="Alice Johnson",
            location=Location(lat=28.7041, lng=77.1025),
            visit_time="09:00",
            gender_preference="any"
        ),
        Patient(
            id="p2",
            name="Bob Smith",
            location=Location(lat=28.7100, lng=77.1100),
            visit_time="10:00",
            gender_preference="any"
        ),
        Patient(
            id="p3",
            name="Carol Williams",
            location=Location(lat=28.6900, lng=77.0950),
            visit_time="11:00",
            gender_preference="female"
        ),
        Patient(
            id="p4",
            name="David Brown",
            location=Location(lat=28.7200, lng=77.1200),
            visit_time="14:00",
            gender_preference="any"
        ),
        Patient(
            id="p5",
            name="Emma Davis",
            location=Location(lat=28.6950, lng=77.1050),
            visit_time="15:00",
            gender_preference="female"
        ),
        Patient(
            id="p6",
            name="Frank Miller",
            location=Location(lat=28.7150, lng=77.1150),
            visit_time="16:00",
            gender_preference="any"
        ),
    ]

    # Create sample phlebotomists
    phlebotomists = [
        Phlebotomist(
            id="ph1",
            name="Dr. Sarah Johnson",
            location=Location(lat=28.7000, lng=77.1000),
            gender="female",
            max_visits=5,
            available=True
        ),
        Phlebotomist(
            id="ph2",
            name="Dr. Michael Chen",
            location=Location(lat=28.7050, lng=77.1050),
            gender="male",
            max_visits=5,
            available=True
        ),
    ]

    print("=" * 70)
    print("PHLEBOTOMIST ASSIGNMENT OPTIMIZER - TEST RUN")
    print("=" * 70)

    print("\nPatients:")
    print("-" * 70)
    for p in patients:
        pref_str = f" (Prefers: {p.gender_preference})" if p.gender_preference != "any" else ""
        print(f"  {p.name} - {p.visit_time} - ({p.location.lat}, {p.location.lng}){pref_str}")

    print("\nPhlebotomists:")
    print("-" * 70)
    for ph in phlebotomists:
        print(f"  {ph.name} ({ph.gender}) - Base: ({ph.location.lat}, {ph.location.lng}) - Max visits: {ph.max_visits}")

    print("\nOptimizing assignments...")
    print("=" * 70)

    # Run optimization
    assignments, unassigned = optimize_assignments(patients, phlebotomists)

    print("\nOPTIMIZATION RESULTS:")
    print("=" * 70)

    total_distance = 0.0
    for assignment in assignments:
        print(f"\n{assignment.phlebotomist_name}:")
        print(f"  Total distance: {assignment.total_distance:.2f} km")
        print(f"  Number of visits: {len(assignment.patient_assignments)}")
        print("  Schedule:")

        for i, patient_assignment in enumerate(assignment.patient_assignments, 1):
            print(f"    {i}. {patient_assignment['visit_time']} - "
                  f"{patient_assignment['patient_name']} "
                  f"({patient_assignment['distance_km']:.2f} km)")

        total_distance += assignment.total_distance

    print("\n" + "=" * 70)
    print(f"TOTAL DISTANCE: {total_distance:.2f} km")
    print(f"ASSIGNED PATIENTS: {sum(len(a.patient_assignments) for a in assignments)}/{len(patients)}")

    if unassigned:
        print(f"UNASSIGNED PATIENTS: {', '.join(unassigned)}")
    else:
        print("ALL PATIENTS ASSIGNED SUCCESSFULLY!")

    print("=" * 70)


if __name__ == "__main__":
    main()
