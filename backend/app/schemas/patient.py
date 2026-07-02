from pydantic import BaseModel
from typing import Optional


class PatientResponse(BaseModel):
    id: int
    bed_id: Optional[str] = None
    name: Optional[str] = None
    age: Optional[int] = None
    diagnosis: Optional[str] = None
    admit_date: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class VitalSignResponse(BaseModel):
    id: int
    patient_id: int
    timestamp: str
    hr: Optional[int] = None
    spo2: Optional[float] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    rr: Optional[int] = None
    temperature: Optional[float] = None

    class Config:
        from_attributes = True


class PatientDetailResponse(BaseModel):
    id: int
    bed_id: Optional[str] = None
    name: Optional[str] = None
    age: Optional[int] = None
    diagnosis: Optional[str] = None
    admit_date: Optional[str] = None
    status: str
    current_vitals: Optional[dict] = None
    vitals_trend: Optional[dict] = None
    active_alert: Optional[dict] = None

    class Config:
        from_attributes = True
