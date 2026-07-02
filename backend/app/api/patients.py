from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.patient import PatientResponse, PatientDetailResponse, VitalSignResponse
from app.services.patient_service import (
    list_patients,
    get_patient_detail,
    get_patient_vitals,
    get_patient_alerts,
)
from app.midlware.auth_middleware import get_current_nurse
from app.models.nurse import Nurse

router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.get("", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    return list_patients(db)


@router.get("/{patient_id}", response_model=PatientDetailResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db), nurse: Nurse = Depends(get_current_nurse)):
    result = get_patient_detail(db, patient_id)
    if not result:
        raise HTTPException(status_code=404, detail="Patient not found")
    return result


@router.get("/{patient_id}/vitals", response_model=list[VitalSignResponse])
def get_vitals(
    patient_id: int,
    hours: int = Query(1),
    db: Session = Depends(get_db),
    nurse: Nurse = Depends(get_current_nurse),
):
    return get_patient_vitals(db, patient_id, hours=hours)


@router.get("/{patient_id}/alerts")
def get_patient_alerts_endpoint(
    patient_id: int,
    db: Session = Depends(get_db),
    nurse: Nurse = Depends(get_current_nurse),
):
    alerts = get_patient_alerts(db, patient_id)
    return [
        {
            "id": a.id,
            "type": a.type,
            "parameter": a.parameter,
            "value": float(a.value) if a.value else None,
            "threshold": float(a.threshold) if a.threshold else None,
            "timestamp": a.timestamp.isoformat(),
            "status": a.status,
        }
        for a in alerts
    ]
