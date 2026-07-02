from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from app.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=False)
    nurse_id = Column(Integer, ForeignKey("nurses.id"), nullable=False)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="active")
