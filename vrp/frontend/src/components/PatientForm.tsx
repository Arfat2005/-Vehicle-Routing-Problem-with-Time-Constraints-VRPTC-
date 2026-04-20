import React, { useState } from 'react';
import { Patient } from '../types';

interface PatientFormProps {
  onAdd: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [genderPreference, setGenderPreference] = useState<'male' | 'female' | 'any'>('any');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !lat || !lng || !visitTime) {
      alert('Please fill all required fields');
      return;
    }

    const patient: Patient = {
      id: `patient_${Date.now()}`,
      name,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      visit_time: visitTime,
      time_window_minutes: 30,
      gender_preference: genderPreference,
    };

    onAdd(patient);

    // Reset form
    setName('');
    setLat('');
    setLng('');
    setVisitTime('');
    setGenderPreference('any');
  };

  return (
    <div style={styles.container}>
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>Latitude *</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              style={styles.input}
              placeholder="e.g., 28.7041"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Longitude *</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              style={styles.input}
              placeholder="e.g., 77.1025"
              required
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label>Visit Time *</label>
          <input
            type="time"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Gender Preference</label>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value as 'male' | 'female' | 'any')}
            style={styles.select}
          >
            <option value="any">Any</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Add Patient
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '15px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
  },
  select: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default PatientForm;
