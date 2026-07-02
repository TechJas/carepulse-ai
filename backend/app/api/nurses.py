from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.midlware.auth_middleware import get_current_nurse
from app.models.nurse import Nurse
from app.services.alert_service import list_alerts

router = APIRouter(prefix="/api/nurses", tags=["nurses"])


@router.get("/me/alerts")
def my_alerts(db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    return list_alerts(db, nurse_id=nurse.id)


@router.get("/me/stats")
def my_stats(db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    from app.models.assignment import Assignment

    total_acknowledged = (
        db.query(Assignment)
        .filter(Assignment.nurse_id == nurse.id)
        .count()
    )
    total_resolved = (
        db.query(Assignment)
        .filter(Assignment.nurse_id == nurse.id, Assignment.status == "resolved")
        .count()
    )
    active = (
        db.query(Assignment)
        .filter(Assignment.nurse_id == nurse.id, Assignment.status == "active")
        .count()
    )
    return {
        "total_acknowledged": total_acknowledged,
        "total_resolved": total_resolved,
        "active_alerts": active,
    }
