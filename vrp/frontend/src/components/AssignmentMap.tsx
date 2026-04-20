import React from 'react';
import { OptimizationResponse } from '../types';

interface AssignmentMapProps {
  results: OptimizationResponse | null;
}

const AssignmentMap: React.FC<AssignmentMapProps> = ({ results }) => {
  // Hardcoded visualization data for demonstration
  const hardcodedData = {
    phlebotomists: [
      { id: 'ph1', name: 'Dr. Sarah Johnson', lat: 28.7000, lng: 77.1000, color: '#4CAF50', gender: 'Female' },
      { id: 'ph2', name: 'Dr. Michael Chen', lat: 28.7050, lng: 77.1050, color: '#2196F3', gender: 'Male' },
    ],
    patients: [
      { id: 'p1', name: 'Alice Williams', lat: 28.7041, lng: 77.1025, time: '09:00', assignedTo: 'ph1' },
      { id: 'p2', name: 'Bob Smith', lat: 28.6900, lng: 77.0950, time: '11:00', assignedTo: 'ph2' },
      { id: 'p3', name: 'Carol Davis', lat: 28.7150, lng: 77.1150, time: '14:00', assignedTo: 'ph1' },
      { id: 'p4', name: 'David Brown', lat: 28.7200, lng: 77.1200, time: '15:00', assignedTo: 'ph2' },
      { id: 'p5', name: 'Emma Wilson', lat: 28.6950, lng: 77.1050, time: '16:00', assignedTo: 'ph1' },
    ],
  };

  // Calculate bounds for the map
  const allLats = [
    ...hardcodedData.phlebotomists.map(p => p.lat),
    ...hardcodedData.patients.map(p => p.lat),
  ];
  const allLngs = [
    ...hardcodedData.phlebotomists.map(p => p.lng),
    ...hardcodedData.patients.map(p => p.lng),
  ];

  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const padding = 50;
    const width = 600;
    const height = 400;

    const x = padding + ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding);
    const y = height - (padding + ((lat - minLat) / (maxLat - minLat)) * (height - 2 * padding));

    return { x, y };
  };

  return (
    <div style={styles.container}>
      <h2>📍 Assignment Map Visualization</h2>
      <p style={styles.subtitle}>Visual representation of phlebotomist routes and patient assignments</p>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{...styles.legendDot, backgroundColor: '#4CAF50'}}></div>
          <span>Dr. Sarah Johnson (Female) - 3 visits</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendDot, backgroundColor: '#2196F3'}}></div>
          <span>Dr. Michael Chen (Male) - 2 visits</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendDot, backgroundColor: '#FF9800', width: '12px', height: '12px', borderRadius: '2px'}}></div>
          <span>Patient Location</span>
        </div>
      </div>

      <svg width="600" height="400" style={styles.svg}>
        {/* Background */}
        <rect width="600" height="400" fill="#f5f5f5" />

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <React.Fragment key={i}>
            <line
              x1="50"
              y1={50 + i * 75}
              x2="550"
              y2={50 + i * 75}
              stroke="#e0e0e0"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <line
              x1={50 + i * 125}
              y1="50"
              x2={50 + i * 125}
              y2="350"
              stroke="#e0e0e0"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          </React.Fragment>
        ))}

        {/* Draw routes (lines from phlebotomist to patients) */}
        {hardcodedData.patients.map(patient => {
          const phlebotomist = hardcodedData.phlebotomists.find(p => p.id === patient.assignedTo);
          if (!phlebotomist) return null;

          const phPos = latLngToXY(phlebotomist.lat, phlebotomist.lng);
          const patPos = latLngToXY(patient.lat, patient.lng);

          return (
            <line
              key={patient.id}
              x1={phPos.x}
              y1={phPos.y}
              x2={patPos.x}
              y2={patPos.y}
              stroke={phlebotomist.color}
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          );
        })}

        {/* Draw patients */}
        {hardcodedData.patients.map(patient => {
          const pos = latLngToXY(patient.lat, patient.lng);
          const phlebotomist = hardcodedData.phlebotomists.find(p => p.id === patient.assignedTo);

          return (
            <g key={patient.id}>
              {/* Patient marker */}
              <rect
                x={pos.x - 8}
                y={pos.y - 8}
                width="16"
                height="16"
                fill="#FF9800"
                stroke={phlebotomist?.color || '#666'}
                strokeWidth="2"
                rx="2"
              />
              {/* Patient label */}
              <text
                x={pos.x + 12}
                y={pos.y - 5}
                fontSize="11"
                fontWeight="bold"
                fill="#333"
              >
                {patient.name}
              </text>
              <text
                x={pos.x + 12}
                y={pos.y + 7}
                fontSize="10"
                fill="#666"
              >
                {patient.time}
              </text>
            </g>
          );
        })}

        {/* Draw phlebotomists */}
        {hardcodedData.phlebotomists.map(phlebotomist => {
          const pos = latLngToXY(phlebotomist.lat, phlebotomist.lng);
          const assignedPatients = hardcodedData.patients.filter(p => p.assignedTo === phlebotomist.id);

          return (
            <g key={phlebotomist.id}>
              {/* Phlebotomist marker (larger circle) */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="15"
                fill={phlebotomist.color}
                stroke="white"
                strokeWidth="3"
              />
              {/* Visit count badge */}
              <circle
                cx={pos.x + 12}
                cy={pos.y - 12}
                r="10"
                fill="#333"
              />
              <text
                x={pos.x + 12}
                y={pos.y - 8}
                fontSize="10"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
              >
                {assignedPatients.length}
              </text>
              {/* Phlebotomist label */}
              <text
                x={pos.x}
                y={pos.y + 30}
                fontSize="12"
                fontWeight="bold"
                fill={phlebotomist.color}
                textAnchor="middle"
              >
                {phlebotomist.name}
              </text>
            </g>
          );
        })}

        {/* Title */}
        <text x="300" y="25" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#333">
          Delhi Area - Phlebotomist Routes
        </text>
      </svg>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>5</div>
          <div style={styles.statLabel}>Total Patients</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>2</div>
          <div style={styles.statLabel}>Phlebotomists</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>12.3 km</div>
          <div style={styles.statLabel}>Total Distance</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>100%</div>
          <div style={styles.statLabel}>Assigned</div>
        </div>
      </div>

      <div style={styles.note}>
        <strong>📝 Note:</strong> This is a demonstration visualization showing how assignments would be displayed.
        The actual map will update based on your optimization results.
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
    marginTop: '20px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px',
  },
  legend: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid white',
  },
  svg: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'block',
    margin: '0 auto',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
  },
  note: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#856404',
  },
};

export default AssignmentMap;
