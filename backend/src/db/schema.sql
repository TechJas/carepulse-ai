CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  unit_type VARCHAR(30),
  location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS nurses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT 'nurse'
);

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  department_id INTEGER REFERENCES departments(id),
  bed_id VARCHAR(10),
  name VARCHAR(100),
  age INTEGER,
  diagnosis TEXT,
  admit_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS vital_signs (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  hr INTEGER,
  spo2 NUMERIC(4,1),
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  rr INTEGER,
  temperature NUMERIC(4,1)
);
CREATE INDEX IF NOT EXISTS idx_vitals_patient_time ON vital_signs(patient_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  type VARCHAR(20) NOT NULL,
  parameter VARCHAR(20) NOT NULL,
  value NUMERIC(8,2),
  threshold NUMERIC(8,2),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'waiting'
);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_patient ON alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);

CREATE TABLE IF NOT EXISTS risk_scores (
  id SERIAL PRIMARY KEY,
  alert_id INTEGER REFERENCES alerts(id),
  score NUMERIC(5,2),
  confidence NUMERIC(5,2),
  priority VARCHAR(10),
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  alert_id INTEGER REFERENCES alerts(id),
  nurse_id INTEGER REFERENCES nurses(id),
  accepted_at TIMESTAMP,
  resolved_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);
CREATE INDEX IF NOT EXISTS idx_assignments_alert ON assignments(alert_id);
CREATE INDEX IF NOT EXISTS idx_assignments_nurse ON assignments(nurse_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  nurse_id INTEGER REFERENCES nurses(id),
  action VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_nurse ON audit_logs(nurse_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
