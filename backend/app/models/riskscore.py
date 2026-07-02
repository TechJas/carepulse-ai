from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime, ForeignKey

from app.database import Base


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=False)
    score = Column(Numeric(5, 2), nullable=True)
    confidence = Column(Numeric(5, 2), nullable=True)
    priority = Column(String(10), nullable=True)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
