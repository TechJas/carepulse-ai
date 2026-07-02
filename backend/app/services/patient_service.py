from datetime import timedelta, timezone

from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.vitalsign import VitalSign
from app.models.alert import Alert
from app.models.riskscore import RiskScore


def list_patients(db: Session) -> list[Patient]:
    return db.query(Patient).filter(Patient.status == "active").all()


def get_patient_detail(db: Session, patient_id: int) -> dict | None:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        return None

    now = datetime.now(timezone.utc)
    window_start = now - timedelta(hours=1)

    recent_vitals = (
        db.query(VitalSign)
        .filter(VitalSign.patient_id == patient_id, VitalSign.timestamp >= window_start)
        .order_by(VitalSign.timestamp.desc())
        .all()
    )

    current_vitals = None
    vitals_trend = {"hr": [], "spo2": [], "systolic_bp": []}

    if recent_vitals:
        latest = recent_vitals[0]
        current_vitals = {
            "hr": latest.hr,
            "spo2": float(latest.spo2) if latest.spo2 else None,
            "systolic_bp": latest.systolic_bp,
            "diastolic_bp": latest.diastolic_bp,
            "rr": latest.rr,
            "temperature": float(latest.temperature) if latest.temperature else None,
        }

        trend_window = now - timedelta(hours=1)
        trend_vitals = (
            db.query(VitalSign)
            .filter(VitalSign.patient_id == patient_id, VitalSign.timestamp >= trend_window)
            .order_by(VitalSign.timestamp.asc())
            .all()
        )
        for v in trend_vitals:
            if v.hr:
                vitals_trend["hr"].append(v.hr)
            if v.spo2:
                vitals_trend["spo2"].append(float(v.spo2))
            if v.systolic_bp:
                vitals_trend["systolic_bp"].append(v.systolic_bp)

    active_alert = None
    active = (
        db.query(Alert, RiskScore)
        .outerjoin(RiskScore, Alert.id == RiskScore.alert_id)
        .filter(
            Alert.patient_id == patient_id,
            Alert.status.in_(["waiting", "in_progress"]),
        )
        .order_by(Alert.timestamp.desc())
        .first()
    )
    if active:
        alert, risk = active
        active_alert = {
            "id": alert.id,
            "risk_score": float(risk.score) if risk else None,
            "priority": risk.priority if risk else None,
            "explanation": risk.explanation if risk else None,
        }

    return {
        "id": patient.id,
        "bed_id": patient.bed_id,
        "name": patient.name,
        "age": patient.age,
        "diagnosis": patient.diagnosis,
        "admit_date": patient.admit_date.isoformat() if patient.admit_date else None,
        "status": patient.status,
        "current_vitals": current_vitals,
        "vitals_trend": vitals_trend,
        "active_alert": active_alert,
    }


def get_patient_vitals(db: Session, patient_id: int, hours: int = 1) -> list[VitalSign]:
    from datetime import timedelta, timezone

    window_start = datetime.now(timezone.utc) - timedelta(hours=hours)
    return (
        db.query(VitalSign)
        .filter(VitalSign.patient_id == patient_id, VitalSign.timestamp >= window_start)
        .order_by(VitalSign.timestamp.asc())
        .all()
    )


def get_patient_alerts(db: Session, patient_id: int) -> list[Alert]:
    return (
        db.query(Alert)
        .filter(Alert.patient_id == patient_id)
        .order_by(Alert.timestamp.desc())
        .limit(50)
        .all()
    )
