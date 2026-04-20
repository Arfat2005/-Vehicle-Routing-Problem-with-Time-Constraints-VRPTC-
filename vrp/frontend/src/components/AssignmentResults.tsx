import React from 'react';
import { OptimizationResponse } from '../types';

interface AssignmentResultsProps {
  results: OptimizationResponse | null;
}

const AssignmentResults: React.FC<AssignmentResultsProps> = ({ results }) => {
  if (!results) {
    return (
      <div style={styles.container}>
        <h2>Optimization Results</h2>
        <p style={styles.placeholder}>
          Click "Optimize Assignments" to generate the schedule
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Optimization Results</h2>

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <strong>Total Distance:</strong> {results.total_distance.toFixed(2)} km
        </div>
        <div style={styles.summaryItem}>
          <strong>Phlebotomists Assigned:</strong> {results.assignments.length}
        </div>
        <div style={styles.summaryItem}>
          <strong>Unassigned Patients:</strong> {results.unassigned_patients.length}
        </div>
      </div>

      {results.unassigned_patients.length > 0 && (
        <div style={styles.warning}>
          <strong>Warning:</strong> {results.unassigned_patients.length} patient(s) could not be assigned.
          <br />
          Unassigned: {results.unassigned_patients.join(', ')}
        </div>
      )}

      <div style={styles.assignmentsList}>
        {results.assignments.map((assignment) => (
          <div key={assignment.phlebotomist_id} style={styles.assignmentCard}>
            <div style={styles.assignmentHeader}>
              <h3>{assignment.phlebotomist_name}</h3>
              <span style={styles.badge}>
                {assignment.patient_assignments.length} visit(s)
              </span>
            </div>

            <div style={styles.totalDistance}>
              Total Distance: {assignment.total_distance.toFixed(2)} km
            </div>

            <div style={styles.patientList}>
              {assignment.patient_assignments.map((patient, index) => (
                <div key={patient.patient_id} style={styles.patientItem}>
                  <div style={styles.visitNumber}>{index + 1}</div>
                  <div style={styles.patientInfo}>
                    <div style={styles.patientName}>{patient.patient_name}</div>
                    <div style={styles.patientDetails}>
                      <span>Time: {patient.visit_time}</span>
                      <span style={styles.separator}>•</span>
                      <span>Distance: {patient.distance_km.toFixed(2)} km</span>
                      <span style={styles.separator}>•</span>
                      <span>
                        Location: ({patient.location.lat.toFixed(4)}, {patient.location.lng.toFixed(4)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  placeholder: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '40px 0',
  },
  summary: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    flexWrap: 'wrap',
  },
  summaryItem: {
    flex: 1,
    minWidth: '150px',
  },
  warning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #ffeaa7',
  },
  assignmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  assignmentCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fafafa',
  },
  assignmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  badge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
  },
  totalDistance: {
    color: '#666',
    marginBottom: '15px',
    fontSize: '14px',
  },
  patientList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  patientItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  visitNumber: {
    backgroundColor: '#28a745',
    color: 'white',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  patientDetails: {
    fontSize: '14px',
    color: '#666',
  },
  separator: {
    margin: '0 8px',
  },
};

export default AssignmentResults;
