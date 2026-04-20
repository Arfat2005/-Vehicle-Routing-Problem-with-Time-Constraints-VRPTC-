from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class Location(BaseModel):
    lat: float
    lng: float


class Patient(BaseModel):
    id: str
    name: str
    location: Location
    visit_time: str  # Format: "HH:MM" (e.g., "09:30")
    time_window_minutes: int = 30  # Time window flexibility
    gender_preference: Optional[Literal["male", "female", "any"]] = "any"


class Phlebotomist(BaseModel):
    id: str
    name: str
    location: Location  # Starting location
    gender: Literal["male", "female"]
    max_visits: int = 5
    available: bool = True


class Assignment(BaseModel):
    phlebotomist_id: str
    phlebotomist_name: str
    patient_assignments: List[dict]  # List of {patient_id, patient_name, visit_time, distance}
    total_distance: float


class OptimizationRequest(BaseModel):
    patients: List[Patient]
    phlebotomists: List[Phlebotomist]


class OptimizationResponse(BaseModel):
    assignments: List[Assignment]
    total_distance: float
    unassigned_patients: List[str]
