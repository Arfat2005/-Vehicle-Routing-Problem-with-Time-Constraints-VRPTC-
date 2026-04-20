import React, { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import PhlebotomistForm from './components/PhlebotomistForm';
import DataList from './components/DataList';
import AssignmentResults from './components/AssignmentResults';
import AssignmentMap from './components/AssignmentMap';
import { Patient, Phlebotomist, OptimizationResponse } from './types';
import {
  addPatient,
  addPhlebotomist,
  getPatients,
  getPhlebotomists,
  deletePatient,
  deletePhlebotomist,
  optimizeAssignments,
} from './api';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [phlebotomists, setPhlebotomists] = useState<Phlebotomist[]>([]);
  const [results, setResults] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsRes, phlebotomistsRes] = await Promise.all([
        getPatients(),
        getPhlebotomists(),
      ]);
      setPatients(patientsRes.data);
      setPhlebotomists(phlebotomistsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Make sure the backend is running.');
    }
  };

  const handleAddPatient = async (patient: Patient) => {
    try {
      await addPatient(patient);
      setPatients([...patients, patient]);
      setResults(null); // Clear previous results
    } catch (err) {
      console.error('Error adding patient:', err);
      alert('Failed to add patient');
    }
  };

  const handleAddPhlebotomist = async (phlebotomist: Phlebotomist) => {
    try {
      await addPhlebotomist(phlebotomist);
      setPhlebotomists([...phlebotomists, phlebotomist]);
      setResults(null); // Clear previous results
    } catch (err) {
      console.error('Error adding phlebotomist:', err);
      alert('Failed to add phlebotomist');
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter((p) => p.id !== id));
      setResults(null); // Clear previous results
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert('Failed to delete patient');
    }
  };

  const handleDeletePhlebotomist = async (id: string) => {
    try {
      await deletePhlebotomist(id);
      setPhlebotomists(phlebotomists.filter((p) => p.id !== id));
      setResults(null); // Clear previous results
    } catch (err) {
      console.error('Error deleting phlebotomist:', err);
      alert('Failed to delete phlebotomist');
    }
  };

  const handleOptimize = async () => {
    if (patients.length === 0) {
      alert('Please add at least one patient');
      return;
    }
    if (phlebotomists.length === 0) {
      alert('Please add at least one phlebotomist');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await optimizeAssignments();
      setResults(response.data);
    } catch (err) {
      console.error('Error optimizing:', err);
      setError('Failed to optimize assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>Phlebotomist Assignment Optimizer</h1>
        <p>Optimize patient visits using Google OR-Tools</p>
      </header>

      <div style={styles.container}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.forms}>
          <PatientForm onAdd={handleAddPatient} />
          <PhlebotomistForm onAdd={handleAddPhlebotomist} />
        </div>

        <DataList
          patients={patients}
          phlebotomists={phlebotomists}
          onDeletePatient={handleDeletePatient}
          onDeletePhlebotomist={handleDeletePhlebotomist}
        />

        <div style={styles.actionSection}>
          <button
            onClick={handleOptimize}
            disabled={loading}
            style={{
              ...styles.optimizeButton,
              ...(loading ? styles.optimizeButtonDisabled : {}),
            }}
          >
            {loading ? 'Optimizing...' : 'Optimize Assignments'}
          </button>
        </div>

        <AssignmentMap results={results} />

        <AssignmentResults results={results} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  forms: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  actionSection: {
    textAlign: 'center',
    margin: '30px 0',
  },
  optimizeButton: {
    padding: '15px 40px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s',
  },
  optimizeButtonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
};

export default App;
