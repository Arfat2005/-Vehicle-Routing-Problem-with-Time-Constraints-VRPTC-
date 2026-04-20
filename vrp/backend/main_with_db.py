import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from models import (
    Patient,
    Phlebotomist,
    Location,
    OptimizationRequest,
    OptimizationResponse,
)
from optimizer import optimize_assignments
from database import get_db, init_db, PatientDB, PhlebotomistDB, USE_DATABASE

app = FastAPI(title="Phlebotomist Assignment Optimizer with Database")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    if USE_DATABASE:
        init_db()
        print("✅ Database initialized")


# Helper functions to convert between DB and Pydantic models
def db_to_patient(db_patient: PatientDB) -> Patient:
    return Patient(
        id=db_patient.id,
        name=db_patient.name,
        location=Location(lat=db_patient.lat, lng=db_patient.lng),
        visit_time=db_patient.visit_time,
        time_window_minutes=db_patient.time_window_minutes,
        gender_preference=db_patient.gender_preference
    )


def patient_to_db(patient: Patient) -> PatientDB:
    return PatientDB(
        id=patient.id,
        name=patient.name,
        lat=patient.location.lat,
        lng=patient.location.lng,
        visit_time=patient.visit_time,
        time_window_minutes=patient.time_window_minutes,
        gender_preference=patient.gender_preference
    )


def db_to_phlebotomist(db_phlebotomist: PhlebotomistDB) -> Phlebotomist:
    return Phlebotomist(
        id=db_phlebotomist.id,
        name=db_phlebotomist.name,
        location=Location(lat=db_phlebotomist.lat, lng=db_phlebotomist.lng),
        gender=db_phlebotomist.gender,
        max_visits=db_phlebotomist.max_visits,
        available=db_phlebotomist.available
    )


def phlebotomist_to_db(phlebotomist: Phlebotomist) -> PhlebotomistDB:
    return PhlebotomistDB(
        id=phlebotomist.id,
        name=phlebotomist.name,
        lat=phlebotomist.location.lat,
        lng=phlebotomist.location.lng,
        gender=phlebotomist.gender,
        max_visits=phlebotomist.max_visits,
        available=phlebotomist.available
    )


@app.get("/")
def read_root():
    db_status = "PostgreSQL" if USE_DATABASE else "In-Memory"
    return {
        "message": "Phlebotomist Assignment Optimizer API",
        "database": db_status
    }


# Patient endpoints
@app.post("/patients", response_model=Patient)
def add_patient(patient: Patient, db: Session = Depends(get_db)):
    """Add a new patient."""
    existing = db.query(PatientDB).filter(PatientDB.id == patient.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient already exists")

    db_patient = patient_to_db(patient)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return patient


@app.get("/patients", response_model=List[Patient])
def get_patients(db: Session = Depends(get_db)):
    """Get all patients."""
    db_patients = db.query(PatientDB).all()
    return [db_to_patient(p) for p in db_patients]


@app.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """Get a specific patient."""
    db_patient = db.query(PatientDB).filter(PatientDB.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_to_patient(db_patient)


@app.put("/patients/{patient_id}", response_model=Patient)
def update_patient(patient_id: str, patient: Patient, db: Session = Depends(get_db)):
    """Update a patient."""
    db_patient = db.query(PatientDB).filter(PatientDB.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db_patient.name = patient.name
    db_patient.lat = patient.location.lat
    db_patient.lng = patient.location.lng
    db_patient.visit_time = patient.visit_time
    db_patient.time_window_minutes = patient.time_window_minutes
    db_patient.gender_preference = patient.gender_preference

    db.commit()
    db.refresh(db_patient)
    return db_to_patient(db_patient)


@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: str, db: Session = Depends(get_db)):
    """Delete a patient."""
    db_patient = db.query(PatientDB).filter(PatientDB.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(db_patient)
    db.commit()
    return {"message": "Patient deleted"}


# Phlebotomist endpoints
@app.post("/phlebotomists", response_model=Phlebotomist)
def add_phlebotomist(phlebotomist: Phlebotomist, db: Session = Depends(get_db)):
    """Add a new phlebotomist."""
    existing = db.query(PhlebotomistDB).filter(PhlebotomistDB.id == phlebotomist.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phlebotomist already exists")

    db_phlebotomist = phlebotomist_to_db(phlebotomist)
    db.add(db_phlebotomist)
    db.commit()
    db.refresh(db_phlebotomist)
    return phlebotomist


@app.get("/phlebotomists", response_model=List[Phlebotomist])
def get_phlebotomists(db: Session = Depends(get_db)):
    """Get all phlebotomists."""
    db_phlebotomists = db.query(PhlebotomistDB).all()
    return [db_to_phlebotomist(p) for p in db_phlebotomists]


@app.get("/phlebotomists/{phlebotomist_id}", response_model=Phlebotomist)
def get_phlebotomist(phlebotomist_id: str, db: Session = Depends(get_db)):
    """Get a specific phlebotomist."""
    db_phlebotomist = db.query(PhlebotomistDB).filter(
        PhlebotomistDB.id == phlebotomist_id
    ).first()
    if not db_phlebotomist:
        raise HTTPException(status_code=404, detail="Phlebotomist not found")
    return db_to_phlebotomist(db_phlebotomist)


@app.put("/phlebotomists/{phlebotomist_id}", response_model=Phlebotomist)
def update_phlebotomist(
    phlebotomist_id: str,
    phlebotomist: Phlebotomist,
    db: Session = Depends(get_db)
):
    """Update a phlebotomist."""
    db_phlebotomist = db.query(PhlebotomistDB).filter(
        PhlebotomistDB.id == phlebotomist_id
    ).first()
    if not db_phlebotomist:
        raise HTTPException(status_code=404, detail="Phlebotomist not found")

    db_phlebotomist.name = phlebotomist.name
    db_phlebotomist.lat = phlebotomist.location.lat
    db_phlebotomist.lng = phlebotomist.location.lng
    db_phlebotomist.gender = phlebotomist.gender
    db_phlebotomist.max_visits = phlebotomist.max_visits
    db_phlebotomist.available = phlebotomist.available

    db.commit()
    db.refresh(db_phlebotomist)
    return db_to_phlebotomist(db_phlebotomist)


@app.delete("/phlebotomists/{phlebotomist_id}")
def delete_phlebotomist(phlebotomist_id: str, db: Session = Depends(get_db)):
    """Delete a phlebotomist."""
    db_phlebotomist = db.query(PhlebotomistDB).filter(
        PhlebotomistDB.id == phlebotomist_id
    ).first()
    if not db_phlebotomist:
        raise HTTPException(status_code=404, detail="Phlebotomist not found")

    db.delete(db_phlebotomist)
    db.commit()
    return {"message": "Phlebotomist deleted"}


# Optimization endpoint
@app.post("/optimize", response_model=OptimizationResponse)
def optimize(request: OptimizationRequest = None, db: Session = Depends(get_db)):
    """
    Optimize patient-phlebotomist assignments.
    If no request body is provided, uses all patients and phlebotomists in the database.
    """
    if request is None:
        # Get from database
        db_patients = db.query(PatientDB).all()
        db_phlebotomists = db.query(PhlebotomistDB).all()
        patients = [db_to_patient(p) for p in db_patients]
        phlebotomists = [db_to_phlebotomist(p) for p in db_phlebotomists]
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
def optimize_stored(db: Session = Depends(get_db)):
    """Optimize using all stored patients and phlebotomists."""
    db_patients = db.query(PatientDB).all()
    db_phlebotomists = db.query(PhlebotomistDB).all()

    patients = [db_to_patient(p) for p in db_patients]
    phlebotomists = [db_to_phlebotomist(p) for p in db_phlebotomists]

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
