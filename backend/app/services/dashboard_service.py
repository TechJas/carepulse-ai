from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.riskscore import RiskScore
from app.models.patient import Patient
from app.models.assignment import Assignment
from app.models.nurse import Nurse
from app.services.alert_service import get_priority_counts


def get_summary(db: Session) -> dict:
    total = db.query(Patient).filter(Patient.status == "active").count()
    counts = get_priority_counts(db)

    unacknowledged = (
        db.query(Alert).filter(Alert.status == "waiting").count()
    )
    in_progress = (
        db.query(Alert).filter(Alert.status == "in_progress").count()
    )

    return {
        "total_patients": total,
        "high_priority": counts["high"],
        "medium_priority": counts["medium"],
        "low_priority": counts["low"],
        "unacknowledged": unacknowledged,
        "in_progress": in_progress,
    }


def get_top_critical(db: Session, limit: int = 4) -> list[dict]:
    results = (
        db.query(Alert, RiskScore, Patient)
        .outerjoin(RiskScore, Alert.id == RiskScore.alert_id)
        .join(Patient, Alert.patient_id == Patient.id)
        .filter(Alert.status.in_(["waiting", "in_progress"]))
        .order_by(RiskScore.score.desc().nullslast(), Alert.timestamp.desc())
        .limit(limit)
        .all()
    )

    patients = []
    for alert, risk, patient in results:
        assign = (
            db.query(Assignment, Nurse)
            .join(Nurse, Assignment.nurse_id == Nurse.id)
            .filter(Assignment.alert_id == alert.id, Assignment.status == "active")
            .first()
        )
        assigned_nurse = assign.Nurse.name if assign else None

        patients.append({
            "id": patient.id,
            "bed_id": patient.bed_id,
            "name": patient.name,
            "diagnosis": patient.diagnosis,
            "risk_score": float(risk.score) if risk else None,
            "priority": risk.priority if risk else None,
            "explanation": risk.explanation if risk else None,
            "status": alert.status,
            "assigned_nurse": assigned_nurse,
        })

    return patients
