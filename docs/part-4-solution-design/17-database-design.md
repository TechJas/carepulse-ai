# Chapter 17 — Database Design

## Entities

| Entity | Description |
|---|---|
| Patient | ICU patient with demographics and admission info |
| Nurse | ICU staff with role and assignment |
| VitalSign | Time-series vital sign measurements |
| Alert | Generated alert event |
| RiskScore | AI-computed risk score for an alert |
| Assignment | Nurse-to-alert assignment tracking |
| Department | ICU unit or ward |

## Relationships

```
Patient ──1:N──> VitalSign
Patient ──1:N──> Alert
Alert ────1:1──> RiskScore
Alert ────1:N──> Assignment
Nurse ────1:N──> Assignment
Department ─1:N──> Patient
```

## ER Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Department  │     │   Patient   │     │   Nurse     │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │1──N│ id (PK)     │     │ id (PK)     │
│ name        │     │ department_id│     │ name        │
│ unit_type   │     │ bed_id      │     │ email       │
│ location    │     │ name        │     │ role        │
└─────────────┘     │ age         │     └─────────────┘
                    │ diagnosis   │            │
                    │ admit_date  │            │
                    │ status      │            │
                    └─────────────┘            │
                         │ 1                   │ 1
                         │                     │
                         │ N                   │ N
                    ┌─────────────┐     ┌─────────────┐
                    │ VitalSign   │     │ Assignment  │
                    ├─────────────┤     ├─────────────┤
                    │ id (PK)     │     │ id (PK)     │
                    │ patient_id  │     │ alert_id    │
                    │ timestamp   │     │ nurse_id    │
                    │ hr          │     │ accepted_at │
                    │ spo2        │     │ resolved_at │
                    │ systolic_bp │     │ status      │
                    │ diastolic_bp│     └─────────────┘
                    │ rr          │            │
                    │ temperature │            │ 1
                    └─────────────┘            │
                                              │ N
                    ┌─────────────┐     ┌─────────────┐
                    │    Alert    │     │  RiskScore  │
                    ├─────────────┤     ├─────────────┤
                    │ id (PK)     │1───1│ id (PK)     │
                    │ patient_id  │     │ alert_id    │
                    │ type        │     │ score       │
                    │ parameter   │     │ confidence  │
                    │ value       │     │ priority    │
                    │ threshold   │     │ explanation │
                    │ timestamp   │     │ created_at  │
                    │ status      │     └─────────────┘
                    └─────────────┘
```

## Tables

### Patients
```sql
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    bed_id VARCHAR(10),
    name VARCHAR(100),
    age INTEGER,
    diagnosis TEXT,
    admit_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);
```

### Vital Signs
```sql
CREATE TABLE vital_signs (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    timestamp TIMESTAMP NOT NULL,
    hr INTEGER,
    spo2 NUMERIC(4,1),
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    rr INTEGER,
    temperature NUMERIC(4,1)
);
CREATE INDEX idx_vitals_patient_time ON vital_signs(patient_id, timestamp);
```

### Alerts
```sql
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    type VARCHAR(20),          -- physiological, technical, advisory
    parameter VARCHAR(20),     -- hr, spo2, bp, rr, temp
    value NUMERIC(8,2),
    threshold NUMERIC(8,2),
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting'  -- waiting, in_progress, resolved, escalated
);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_patient ON alerts(patient_id);
```

### Risk Scores
```sql
CREATE TABLE risk_scores (
    id SERIAL PRIMARY KEY,
    alert_id INTEGER REFERENCES alerts(id),
    score NUMERIC(5,2),
    confidence NUMERIC(5,2),
    priority VARCHAR(10),       -- high, medium, low
    explanation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Assignments
```sql
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    alert_id INTEGER REFERENCES alerts(id),
    nurse_id INTEGER REFERENCES nurses(id),
    accepted_at TIMESTAMP,
    resolved_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'  -- active, resolved
);
```

### Nurses
```sql
CREATE TABLE nurses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(30) DEFAULT 'nurse'  -- nurse, charge_nurse
);
```

### Departments
```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    unit_type VARCHAR(30),
    location VARCHAR(100)
);
```

## Indexes

| Table | Index | Purpose |
|---|---|---|
| vital_signs | (patient_id, timestamp) | Fast time-series queries per patient |
| alerts | (status) | Filter active alerts for dashboard |
| alerts | (patient_id) | Lookup alerts by patient |
| alerts | (timestamp) | Time-range queries for audit/history |
| risk_scores | (alert_id) | One-to-one lookup |
| assignments | (alert_id, nurse_id) | Track active assignments |

---

[← Back to Document Index](../README.md)
