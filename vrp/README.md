# Phlebotomist Assignment Optimizer

A full-stack application built with FastAPI and React that optimizes patient-phlebotomist assignments using Google OR-Tools.

## Features

- **Patient Management**: Add patients with location (lat/lng), visit time, and gender preferences
- **Phlebotomist Management**: Add phlebotomists with location, gender, and max visits per day (up to 5)
- **Smart Optimization**: Uses Google OR-Tools CP-SAT solver to minimize travel distance
- **Constraint Handling**:
  - Respects patient time slots
  - Honors gender preferences (e.g., female-only phlebotomist requests)
  - Limits phlebotomists to maximum 5 visits per day
  - Calculates distances using Haversine formula
- **Assignment Visualization**: View optimized schedules with total distances and routes

## Architecture

### Backend (FastAPI)
- RESTful API with CRUD operations for patients and phlebotomists
- OR-Tools optimization engine
- Haversine distance calculation
- In-memory storage (can be replaced with database)

### Frontend (React + TypeScript)
- Patient and phlebotomist input forms
- Real-time data management
- Assignment results visualization
- Responsive design

## Project Structure

```
vrp/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic data models
│   ├── optimizer.py         # OR-Tools optimization logic
│   ├── distance_calculator.py  # Haversine distance function
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/      # React components
    │   ├── api.ts          # API client
    │   ├── types.ts        # TypeScript types
    │   ├── App.tsx         # Main app component
    │   └── index.tsx       # Entry point
    └── package.json        # Node dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   API docs at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Usage

1. **Add Phlebotomists**:
   - Enter name, location (latitude/longitude), gender, and max visits
   - Click "Add Phlebotomist"

2. **Add Patients**:
   - Enter name, location (latitude/longitude), visit time
   - Optionally select gender preference (Any/Male Only/Female Only)
   - Click "Add Patient"

3. **Optimize Assignments**:
   - Click "Optimize Assignments" button
   - View the optimized schedule showing:
     - Which phlebotomist is assigned to which patients
     - Visit order sorted by time
     - Distance traveled for each assignment
     - Total distance across all assignments
     - Any unassigned patients (if constraints cannot be satisfied)

## API Endpoints

### Patients
- `POST /patients` - Add a patient
- `GET /patients` - Get all patients
- `GET /patients/{id}` - Get a patient by ID
- `PUT /patients/{id}` - Update a patient
- `DELETE /patients/{id}` - Delete a patient

### Phlebotomists
- `POST /phlebotomists` - Add a phlebotomist
- `GET /phlebotomists` - Get all phlebotomists
- `GET /phlebotomists/{id}` - Get a phlebotomist by ID
- `PUT /phlebotomists/{id}` - Update a phlebotomist
- `DELETE /phlebotomists/{id}` - Delete a phlebotomist

### Optimization
- `GET /optimize-stored` - Optimize using stored data
- `POST /optimize` - Optimize with provided data in request body

## Example Data

### Sample Patient:
```json
{
  "id": "patient_1",
  "name": "John Doe",
  "location": {"lat": 28.7041, "lng": 77.1025},
  "visit_time": "09:30",
  "time_window_minutes": 30,
  "gender_preference": "any"
}
```

### Sample Phlebotomist:
```json
{
  "id": "phlebotomist_1",
  "name": "Jane Smith",
  "location": {"lat": 28.7000, "lng": 77.1000},
  "gender": "female",
  "max_visits": 5,
  "available": true
}
```

## Optimization Constraints

The OR-Tools solver optimizes assignments with these constraints:

1. **Assignment**: Each patient assigned to at most one phlebotomist
2. **Capacity**: Each phlebotomist gets at most `max_visits` patients (default: 5)
3. **Gender Preference**: Respects patient gender preferences for phlebotomist
4. **Objective**: Minimizes total travel distance using Haversine formula

## Technologies Used

- **Backend**:
  - FastAPI 0.109.0
  - OR-Tools 9.8
  - Pydantic 2.5
  - Uvicorn

- **Frontend**:
  - React 18
  - TypeScript 4.9
  - Axios 1.6

## Future Enhancements

- Add map visualization using Google Maps or Leaflet
- Implement time window constraints for more precise scheduling
- Add authentication and user management
- Persist data in a database (PostgreSQL, MongoDB)
- Export schedules to PDF/CSV
- Real-time updates using WebSockets
- Add route optimization considering traffic
- Multi-day scheduling support

## License

MIT
