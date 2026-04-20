import React from 'react';
import { Patient, Phlebotomist } from '../types';

interface DataListProps {
  patients: Patient[];
  phlebotomists: Phlebotomist[];
  onDeletePatient: (id: string) => void;
  onDeletePhlebotomist: (id: string) => void;
}

const DataList: React.FC<DataListProps> = ({
  patients,
  phlebotomists,
  onDeletePatient,
  onDeletePhlebotomist,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2>Patients ({patients.length})</h2>
        {patients.length === 0 ? (
          <p style={styles.empty}>No patients added yet</p>
        ) : (
          <div style={styles.list}>
            {patients.map((patient) => (
              <div key={patient.id} style={styles.item}>
                <div style={styles.itemContent}>
                  <div style={styles.itemName}>{patient.name}</div>
                  <div style={styles.itemDetails}>
                    <span>Time: {patient.visit_time}</span>
                    <span style={styles.separator}>•</span>
                    <span>
                      Location: ({patient.location.lat.toFixed(4)}, {patient.location.lng.toFixed(4)})
                    </span>
                    {patient.gender_preference !== 'any' && (
                      <>
                        <span style={styles.separator}>•</span>
                        <span style={styles.preference}>
                          Prefers: {patient.gender_preference}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeletePatient(patient.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2>Phlebotomists ({phlebotomists.length})</h2>
        {phlebotomists.length === 0 ? (
          <p style={styles.empty}>No phlebotomists added yet</p>
        ) : (
          <div style={styles.list}>
            {phlebotomists.map((phlebotomist) => (
              <div key={phlebotomist.id} style={styles.item}>
                <div style={styles.itemContent}>
                  <div style={styles.itemName}>
                    {phlebotomist.name}
                    <span style={styles.genderBadge}>
                      {phlebotomist.gender}
                    </span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Max Visits: {phlebotomist.max_visits}</span>
                    <span style={styles.separator}>•</span>
                    <span>
                      Base Location: ({phlebotomist.location.lat.toFixed(4)}, {phlebotomist.location.lng.toFixed(4)})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePhlebotomist(phlebotomist.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  empty: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemDetails: {
    fontSize: '14px',
    color: '#666',
  },
  separator: {
    margin: '0 8px',
  },
  preference: {
    color: '#007bff',
    fontWeight: 500,
  },
  genderBadge: {
    fontSize: '12px',
    padding: '2px 8px',
    backgroundColor: '#6c757d',
    color: 'white',
    borderRadius: '10px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default DataList;
