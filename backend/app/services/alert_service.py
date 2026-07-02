from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.riskscore import RiskScore
from app.models.assignment import Assignment
from app.models.nurse import Nurse
from app.models.patient import Patient
from app.models.vitalsign import VitalSign


def list_alerts(
    db: Session,
    status: str | None = None,
    priority: str | None = None,
    limit: int = 20,
    nurse_id: int | None = None,
) -> dict:
    query = (
        db.query(Alert, RiskScore, Patient)
        .outerjoin(RiskScore, Alert.id == RiskScore.alert_id)
        .join(Patient, Alert.patient_id == Patient.id)
    )

    if status:
        query = query.filter(Alert.status == status)
    if priority:
        query = query.filter(RiskScore.priority == priority)
    if nurse_id:
        query = query.join(Assignment, Alert.id == Assignment.alert_id).filter(
            Assignment.nurse_id == nurse_id, Assignment.status == "active"
        )

    results = query.order_by(
        RiskScore.score.desc().nullslast(), Alert.timestamp.desc()
    ).limit(limit).all()

    alerts = []
    for alert, risk, patient in results:
        assign = (
            db.query(Assignment, Nurse)
            .join(Nurse, Assignment.nurse_id == Nurse.id)
            .filter(Assignment.alert_id == alert.id, Assignment.status == "active")
            .first()
        )
        assigned_to = (
            {"id": assign.Nurse.id, "name": assign.Nurse.name}
            if assign else None
        )

        alerts.append({
            "id": alert.id,
            "patient_id": alert.patient_id,
            "patient_name": patient.name,
            "bed_id": patient.bed_id,
            "type": alert.type,
            "parameter": alert.parameter,
            "value": float(alert.value) if alert.value else None,
            "threshold": float(alert.threshold) if alert.threshold else None,
            "timestamp": alert.timestamp.isoformat(),
            "status": alert.status,
            "risk_score": float(risk.score) if risk else None,
            "priority": risk.priority if risk else None,
            "explanation": risk.explanation if risk else None,
            "assigned_to": assigned_to,
        })

    counts = get_priority_counts(db)

    return {"alerts": alerts, "total": len(alerts), **counts}


def get_priority_counts(db: Session) -> dict:
    base = db.query(Alert).filter(Alert.status.in_(["waiting", "in_progress"]))
    high = base.join(RiskScore).filter(RiskScore.priority == "high").count()
    medium = base.join(RiskScore).filter(RiskScore.priority == "medium").count()
    low = base.join(RiskScore).filter(RiskScore.priority == "low").count()
    return {"high": high, "medium": medium, "low": low}


def acknowledge_alert(db: Session, alert_id: int, nurse_id: int) -> dict | None:
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.status == "waiting").first()
    if not alert:
        return None

    alert.status = "in_progress"
    now = datetime.now(timezone.utc)

    assign = Assignment(alert_id=alert_id, nurse_id=nurse_id, accepted_at=now, status="active")
    db.add(assign)
    db.commit()

    nurse = db.query(Nurse).filter(Nurse.id == nurse_id).first()
    return {
        "id": alert.id,
        "status": alert.status,
        "assigned_to": {"id": nurse.id, "name": nurse.name},
        "acknowledged_at": now.isoformat(),
    }


def resolve_alert(db: Session, alert_id: int, nurse_id: int) -> dict | None:
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.status == "in_progress").first()
    if not alert:
        return None

    alert.status = "resolved"
    now = datetime.now(timezone.utc)

    assign = (
        db.query(Assignment)
        .filter(Assignment.alert_id == alert_id, Assignment.status == "active")
        .first()
    )
    if assign:
        assign.status = "resolved"
        assign.resolved_at = now

    db.commit()
    return {"id": alert.id, "status": alert.status, "message": "Alert resolved"}


def escalate_alert(db: Session, alert_id: int) -> dict | None:
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        return None
    alert.status = "escalated"
    db.commit()
    return {"id": alert.id, "status": alert.status, "message": "Alert escalated to charge nurse"}


def check_escalations(db: Session) -> list[dict]:
    from app.config import settings
    from datetime import timedelta

    threshold = datetime.now(timezone.utc) - timedelta(minutes=settings.ESCALATION_TIMEOUT_MINUTES)
    overdue = (
        db.query(Alert)
        .filter(Alert.status == "waiting", Alert.timestamp < threshold)
        .all()
    )

    escalated = []
    for alert in overdue:
        result = escalate_alert(db, alert.id)
        if result:
            escalated.append(result)
    return escalated
