from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.alert import (
    AlertListResponse,
    AlertResponse,
    AlertAcknowledgeResponse,
    AlertActionResponse,
)
from app.services.alert_service import (
    list_alerts,
    acknowledge_alert,
    resolve_alert,
    escalate_alert,
)
from app.midlware.auth_middleware import get_current_nurse
from app.models.nurse import Nurse
from app.models.alert import Alert

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=AlertListResponse)
def get_alerts(
    status: str | None = Query(None),
    priority: str | None = Query(None),
    limit: int = Query(20),
    db: Session = Depends(get_db),
    nurse: Nurse = Depends(get_current_nurse),
):
    return list_alerts(db, status=status, priority=priority, limit=limit)


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int, db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.post("/{alert_id}/acknowledge", response_model=AlertAcknowledgeResponse)
def acknowledge(alert_id: int, db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    result = acknowledge_alert(db, alert_id, nurse.id)
    if not result:
        raise HTTPException(status_code=400, detail="Alert not found or already acknowledged")
    return result


@router.post("/{alert_id}/resolve", response_model=AlertActionResponse)
def resolve(alert_id: int, db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    result = resolve_alert(db, alert_id, nurse.id)
    if not result:
        raise HTTPException(status_code=400, detail="Alert not found or not in progress")
    return result


@router.post("/{alert_id}/escalate", response_model=AlertActionResponse)
def escalate(alert_id: int, db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    result = escalate_alert(db, alert_id)
    if not result:
        raise HTTPException(status_code=400, detail="Alert not found")
    return result
