from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    type = Column(String(20), nullable=False)
    parameter = Column(String(20), nullable=False)
    value = Column(Numeric(8, 2), nullable=True)
    threshold = Column(Numeric(8, 2), nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    status = Column(String(20), default="waiting")
