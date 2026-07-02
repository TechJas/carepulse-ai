from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey

from app.database import Base


class VitalSign(Base):
    __tablename__ = "vital_signs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    hr = Column(Integer, nullable=True)
    spo2 = Column(Numeric(4, 1), nullable=True)
    systolic_bp = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)
    rr = Column(Integer, nullable=True)
    temperature = Column(Numeric(4, 1), nullable=True)
