from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import DashboardSummaryResponse, TopCriticalResponse
from app.services.dashboard_service import get_summary, get_top_critical
from app.midlware.auth_middleware import get_current_nurse
from app.models.nurse import Nurse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def summary(db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    return get_summary(db)


@router.get("/top-critical", response_model=TopCriticalResponse)
def top_critical(db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    patients = get_top_critical(db)
    return {"patients": patients}
