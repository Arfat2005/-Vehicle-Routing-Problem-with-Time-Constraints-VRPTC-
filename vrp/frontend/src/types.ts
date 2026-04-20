export interface Location {
  lat: number;
  lng: number;
}

export interface Patient {
  id: string;
  name: string;
  location: Location;
  visit_time: string;
  time_window_minutes: number;
  gender_preference: "male" | "female" | "any";
}

export interface Phlebotomist {
  id: string;
  name: string;
  location: Location;
  gender: "male" | "female";
  max_visits: number;
  available: boolean;
}

export interface PatientAssignment {
  patient_id: string;
  patient_name: string;
  visit_time: string;
  location: Location;
  distance_km: number;
}

export interface Assignment {
  phlebotomist_id: string;
  phlebotomist_name: string;
  patient_assignments: PatientAssignment[];
  total_distance: number;
}

export interface OptimizationResponse {
  assignments: Assignment[];
  total_distance: number;
  unassigned_patients: string[];
}
