from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.database import Base, engine
from app.models.department import Department
from app.models.patient import Patient
from app.models.nurse import Nurse
from app.models.vitalsign import VitalSign
from app.models.alert import Alert
from app.models.riskscore import RiskScore
from app.models.assignment import Assignment
from app.services.auth_service import hash_password


def seed_database(db: Session):
    Base.metadata.create_all(bind=engine)

    if db.query(Department).count() > 0:
        return

    dept = Department(name="Medical ICU", unit_type="MICU", location="Floor 3 West")
    db.add(dept)
    db.flush()

    nurses = [
        Nurse(name="Priya Sharma", email="priya@hospital.com", hashed_password=hash_password("password123"), role="nurse"),
        Nurse(name="David Chen", email="david@hospital.com", hashed_password=hash_password("password123"), role="charge_nurse"),
        Nurse(name="Maria Lopez", email="maria@hospital.com", hashed_password=hash_password("password123"), role="nurse"),
    ]
    db.add_all(nurses)
    db.flush()

    patients = [
        Patient(department_id=dept.id, bed_id="ICU-07", name="Patient 103", age=72, diagnosis="Sepsis", admit_date=datetime(2026, 6, 30, 8, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-03", name="Patient 210", age=65, diagnosis="Post-CABG", admit_date=datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-09", name="Patient 118", age=58, diagnosis="Respiratory Failure", admit_date=datetime(2026, 6, 29, 22, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-11", name="Patient 087", age=45, diagnosis="Pancreatitis", admit_date=datetime(2026, 7, 1, 16, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-05", name="Patient 045", age=80, diagnosis="CHF", admit_date=datetime(2026, 6, 28, 6, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-02", name="Patient 132", age=35, diagnosis="Trauma", admit_date=datetime(2026, 7, 2, 2, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-08", name="Patient 156", age=52, diagnosis="Pneumonia", admit_date=datetime(2026, 7, 1, 12, 0, tzinfo=timezone.utc), status="active"),
        Patient(department_id=dept.id, bed_id="ICU-01", name="Patient 189", age=70, diagnosis="AKI", admit_date=datetime(2026, 6, 30, 14, 0, tzinfo=timezone.utc), status="active"),
    ]
    db.add_all(patients)
    db.flush()

    now = datetime(2026, 7, 2, 14, 23, 0, tzinfo=timezone.utc)

    vitals_data = [
        (patients[0], now - timedelta(minutes=60), 105, 94, 95, 62, 24, 38.5),
        (patients[0], now - timedelta(minutes=45), 108, 92, 90, 60, 26, 38.7),
        (patients[0], now - timedelta(minutes=30), 110, 90, 85, 58, 27, 38.8),
        (patients[0], now - timedelta(minutes=15), 112, 88, 82, 54, 28, 38.9),
        (patients[1], now - timedelta(minutes=60), 120, 98, 110, 72, 20, 37.0),
        (patients[1], now - timedelta(minutes=30), 125, 97, 108, 70, 21, 37.1),
        (patients[1], now - timedelta(minutes=15), 130, 96, 104, 68, 22, 37.2),
        (patients[1], now - timedelta(minutes=5), 134, 96, 100, 68, 22, 37.2),
        (patients[2], now - timedelta(minutes=30), 87, 98, 119, 78, 16, 36.8),
        (patients[2], now - timedelta(minutes=15), 88, 97, 120, 78, 16, 36.8),
        (patients[3], now - timedelta(minutes=60), 95, 97, 115, 74, 18, 37.3),
        (patients[3], now - timedelta(minutes=30), 98, 96, 110, 72, 19, 37.4),
        (patients[3], now - timedelta(minutes=15), 100, 95, 108, 70, 20, 37.5),
        (patients[3], now - timedelta(minutes=5), 102, 95, 105, 70, 20, 37.5),
    ]

    vitals_records = []
    for p, ts, hr, spo2, sbp, dbp, rr, temp in vitals_data:
        v = VitalSign(patient_id=p.id, timestamp=ts, hr=hr, spo2=spo2, systolic_bp=sbp, diastolic_bp=dbp, rr=rr, temperature=temp)
        vitals_records.append(v)
    db.add_all(vitals_records)
    db.flush()

    alerts = [
        Alert(patient_id=patients[0].id, type="physiological", parameter="spo2", value=88, threshold=90, timestamp=now - timedelta(minutes=0), status="waiting"),
        Alert(patient_id=patients[1].id, type="physiological", parameter="hr", value=134, threshold=120, timestamp=now - timedelta(minutes=3), status="in_progress"),
        Alert(patient_id=patients[2].id, type="technical", parameter="ecg", value=0, threshold=1, timestamp=now - timedelta(minutes=5), status="waiting"),
        Alert(patient_id=patients[3].id, type="physiological", parameter="bp", value=105, threshold=110, timestamp=now - timedelta(minutes=8), status="waiting"),
        Alert(patient_id=patients[4].id, type="physiological", parameter="hr", value=95, threshold=90, timestamp=now - timedelta(minutes=33), status="resolved"),
        Alert(patient_id=patients[5].id, type="physiological", parameter="hr", value=76, threshold=60, timestamp=now - timedelta(minutes=143), status="resolved"),
        Alert(patient_id=patients[6].id, type="physiological", parameter="spo2", value=91, threshold=92, timestamp=now - timedelta(minutes=13), status="waiting"),
        Alert(patient_id=patients[7].id, type="physiological", parameter="bp", value=135, threshold=130, timestamp=now - timedelta(minutes=83), status="resolved"),
    ]
    db.add_all(alerts)
    db.flush()

    risk_scores = [
        RiskScore(alert_id=alerts[0].id, score=97, confidence=95, priority="high", explanation="Rapid oxygen decrease | BP falling | HR increasing", created_at=now),
        RiskScore(alert_id=alerts[1].id, score=95, confidence=92, priority="high", explanation="HR elevated (134 bpm) | BP trending down", created_at=now),
        RiskScore(alert_id=alerts[2].id, score=0, confidence=99, priority="info", explanation="Sensor Issue - ECG lead disconnected", created_at=now),
        RiskScore(alert_id=alerts[3].id, score=72, confidence=85, priority="medium", explanation="BP trending down | HR elevated", created_at=now),
        RiskScore(alert_id=alerts[4].id, score=45, confidence=78, priority="low", explanation="HR slightly elevated (95 bpm) - Stable", created_at=now - timedelta(minutes=33)),
        RiskScore(alert_id=alerts[5].id, score=15, confidence=95, priority="low", explanation="All vitals stable - No action needed", created_at=now - timedelta(minutes=143)),
        RiskScore(alert_id=alerts[6].id, score=68, confidence=82, priority="medium", explanation="SpO2 decreasing (91%) | HR elevated | Temp rising", created_at=now),
        RiskScore(alert_id=alerts[7].id, score=25, confidence=90, priority="low", explanation="BP slightly elevated - Monitoring", created_at=now - timedelta(minutes=83)),
    ]
    db.add_all(risk_scores)
    db.flush()

    assign1 = Assignment(alert_id=alerts[1].id, nurse_id=nurses[0].id, accepted_at=now - timedelta(minutes=2), status="active")
    assign2 = Assignment(alert_id=alerts[4].id, nurse_id=nurses[0].id, accepted_at=now - timedelta(minutes=30), resolved_at=now - timedelta(minutes=15), status="resolved")
    assign3 = Assignment(alert_id=alerts[5].id, nurse_id=nurses[2].id, accepted_at=now - timedelta(minutes=140), resolved_at=now - timedelta(minutes=120), status="resolved")
    assign4 = Assignment(alert_id=alerts[7].id, nurse_id=nurses[1].id, accepted_at=now - timedelta(minutes=80), resolved_at=now - timedelta(minutes=60), status="resolved")
    db.add_all([assign1, assign2, assign3, assign4])

    db.commit()
    print("Database seeded successfully")
