from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from models import (
    Patient,
    Phlebotomist,
    OptimizationRequest,
    OptimizationResponse,
    Assignment
)
from optimizer import optimize_assignments

app = FastAPI(title="Phlebotomist Assignment Optimizer")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
patients_db: Dict[str, Patient] = {}
phlebotomists_db: Dict[str, Phlebotomist] = {}


@app.get("/")
def read_root():
    return {"message": "Phlebotomist Assignment Optimizer API"}


# Patient endpoints
@app.post("/patients", response_model=Patient)
def add_patient(patient: Patient):
    """Add a new patient."""
    if patient.id in patients_db:
        raise HTTPException(status_code=400, detail="Patient already exists")
    patients_db[patient.id] = patient
    return patient


@app.get("/patients", response_model=List[Patient])
def get_patients():
    """Get all patients."""
    return list(patients_db.values())


@app.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: str):
    """Get a specific patient."""
    if patient_id not in patients_db:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patients_db[patient_id]


@app.put("/patients/{patient_id}", response_model=Patient)
def update_patient(patient_id: str, patient: Patient):
    """Update a patient."""
    if patient_id not in patients_db:
        raise HTTPException(status_code=404, detail="Patient not found")
    patients_db[patient_id] = patient
    return patient


@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: str):
    """Delete a patient."""
    if patient_id not in patients_db:
        raise HTTPException(status_code=404, detail="Patient not found")
    del patients_db[patient_id]
    return {"message": "Patient deleted"}


# Phlebotomist endpoints
@app.post("/phlebotomists", response_model=Phlebotomist)
def add_phlebotomist(phlebotomist: Phlebotomist):
    """Add a new phlebotomist."""
    if phlebotomist.id in phlebotomists_db:
        raise HTTPException(status_code=400, detail="Phlebotomist already exists")
    phlebotomists_db[phlebotomist.id] = phlebotomist
    return phlebotomist


@app.get("/phlebotomists", response_model=List[Phlebotomist])
def get_phlebotomists():
    """Get all phlebotomists."""
    return list(phlebotomists_db.values())


@app.get("/phlebotomists/{phlebotomist_id}", response_model=Phlebotomist)
def get_phlebotomist(phlebotomist_id: str):
    """Get a specific phlebotomist."""
    if phlebotomist_id not in phlebotomists_db:
        raise HTTPException(status_code=404, detail="Phlebotomist not found")
    return phlebotomists_db[phlebotomist_id]


@app.put("/phlebotomists/{phlebotomist_id}", response_model=Phlebotomist)
def update_phlebotomist(phlebotomist_id: str, phlebotomist: Phlebotomist):
    """Update a phlebotomist."""
    if phlebotomist_id not in phlebotomists_db:
        raise HTTPException(status_code=404, detail="Phlebotomist not found")
    phlebotomists_db[phlebotomist_id] = phlebotomist
    return phlebotomist


@app.delete("/phlebotomists/{phlebotomist_id}")
def delete_phlebotomist(phlebotomist_id: str):
    """Delete a phlebotomist."""
    if phlebotomist_id not in phlebotomists_db:
        raise HTTPException(status_code=404, detail="Phlebotomist not found")
    del phlebotomists_db[phlebotomist_id]
    return {"message": "Phlebotomist deleted"}


# Optimization endpoint
@app.post("/optimize", response_model=OptimizationResponse)
def optimize(request: OptimizationRequest = None):
    """
    Optimize patient-phlebotomist assignments.
    If no request body is provided, uses all patients and phlebotomists in the database.
    """
    if request is None:
        patients = list(patients_db.values())
        phlebotomists = list(phlebotomists_db.values())
    else:
        patients = request.patients
        phlebotomists = request.phlebotomists

    if not patients:
        raise HTTPException(status_code=400, detail="No patients provided")
    if not phlebotomists:
        raise HTTPException(status_code=400, detail="No phlebotomists provided")

    assignments, unassigned = optimize_assignments(patients, phlebotomists)

    total_distance = sum(a.total_distance for a in assignments)

    return OptimizationResponse(
        assignments=assignments,
        total_distance=round(total_distance, 2),
        unassigned_patients=unassigned
    )


@app.get("/optimize-stored", response_model=OptimizationResponse)
def optimize_stored():
    """Optimize using all stored patients and phlebotomists."""
    patients = list(patients_db.values())
    phlebotomists = list(phlebotomists_db.values())

    if not patients:
        raise HTTPException(status_code=400, detail="No patients in database")
    if not phlebotomists:
        raise HTTPException(status_code=400, detail="No phlebotomists in database")

    assignments, unassigned = optimize_assignments(patients, phlebotomists)

    total_distance = sum(a.total_distance for a in assignments)

    return OptimizationResponse(
        assignments=assignments,
        total_distance=round(total_distance, 2),
        unassigned_patients=unassigned
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
