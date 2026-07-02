from pydantic import BaseModel
from typing import Optional


class AlertResponse(BaseModel):
    id: int
    patient_id: int
    type: str
    parameter: str
    value: Optional[float] = None
    threshold: Optional[float] = None
    timestamp: str
    status: str

    class Config:
        from_attributes = True


class AlertListResponse(BaseModel):
    alerts: list["AlertItem"]
    total: int
    high: int
    medium: int
    low: int


class AlertItem(BaseModel):
    id: int
    patient_id: int
    patient_name: Optional[str] = None
    bed_id: Optional[str] = None
    type: str
    parameter: str
    value: Optional[float] = None
    threshold: Optional[float] = None
    timestamp: str
    status: str
    risk_score: Optional[float] = None
    priority: Optional[str] = None
    explanation: Optional[str] = None
    assigned_to: Optional[dict] = None

    class Config:
        from_attributes = True


class AlertAcknowledgeResponse(BaseModel):
    id: int
    status: str
    assigned_to: Optional[dict] = None
    acknowledged_at: Optional[str] = None


class AlertActionResponse(BaseModel):
    id: int
    status: str
    message: str
