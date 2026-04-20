import React, { useState } from 'react';
import { Phlebotomist } from '../types';

interface PhlebotomistFormProps {
  onAdd: (phlebotomist: Phlebotomist) => void;
}

const PhlebotomistForm: React.FC<PhlebotomistFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [maxVisits, setMaxVisits] = useState('5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !lat || !lng) {
      alert('Please fill all required fields');
      return;
    }

    const phlebotomist: Phlebotomist = {
      id: `phlebotomist_${Date.now()}`,
      name,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      gender,
      max_visits: parseInt(maxVisits),
      available: true,
    };

    onAdd(phlebotomist);

    // Reset form
    setName('');
    setLat('');
    setLng('');
    setGender('male');
    setMaxVisits('5');
  };

  return (
    <div style={styles.container}>
      <h2>Add Phlebotomist</h2>
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

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              style={styles.select}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Max Visits Per Day *</label>
            <input
              type="number"
              min="1"
              max="10"
              value={maxVisits}
              onChange={(e) => setMaxVisits(e.target.value)}
              style={styles.input}
              required
            />
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Add Phlebotomist
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
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default PhlebotomistForm;
