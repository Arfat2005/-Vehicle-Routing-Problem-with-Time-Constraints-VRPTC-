-- Initialize VRP Database

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    visit_time VARCHAR(10) NOT NULL,
    time_window_minutes INTEGER DEFAULT 30,
    gender_preference VARCHAR(10) DEFAULT 'any'
);

-- Create phlebotomists table
CREATE TABLE IF NOT EXISTS phlebotomists (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    gender VARCHAR(10) NOT NULL,
    max_visits INTEGER DEFAULT 5,
    available BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_visit_time ON patients(visit_time);
CREATE INDEX IF NOT EXISTS idx_phlebotomists_gender ON phlebotomists(gender);
CREATE INDEX IF NOT EXISTS idx_phlebotomists_available ON phlebotomists(available);

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO phlebotomists (id, name, lat, lng, gender, max_visits, available)
VALUES
    ('ph_sample_1', 'Dr. Sarah Johnson', 28.7000, 77.1000, 'female', 5, true),
    ('ph_sample_2', 'Dr. Michael Chen', 28.7050, 77.1050, 'male', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, name, lat, lng, visit_time, time_window_minutes, gender_preference)
VALUES
    ('p_sample_1', 'Alice Williams', 28.7041, 77.1025, '09:00', 30, 'any'),
    ('p_sample_2', 'Bob Smith', 28.6900, 77.0950, '11:00', 30, 'any'),
    ('p_sample_3', 'Carol Davis', 28.7150, 77.1150, '14:00', 30, 'female')
ON CONFLICT (id) DO NOTHING;
