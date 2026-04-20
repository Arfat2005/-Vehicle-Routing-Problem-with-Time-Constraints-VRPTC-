import axios from 'axios';
import { Patient, Phlebotomist, OptimizationResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient API
export const addPatient = (patient: Patient) =>
  api.post<Patient>('/patients', patient);

export const getPatients = () =>
  api.get<Patient[]>('/patients');

export const deletePatient = (id: string) =>
  api.delete(`/patients/${id}`);

// Phlebotomist API
export const addPhlebotomist = (phlebotomist: Phlebotomist) =>
  api.post<Phlebotomist>('/phlebotomists', phlebotomist);

export const getPhlebotomists = () =>
  api.get<Phlebotomist[]>('/phlebotomists');

export const deletePhlebotomist = (id: string) =>
  api.delete(`/phlebotomists/${id}`);

// Optimization API
export const optimizeAssignments = () =>
  api.get<OptimizationResponse>('/optimize-stored');

export default api;
