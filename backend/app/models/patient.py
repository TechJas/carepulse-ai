from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    bed_id = Column(String(10), nullable=True)
    name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    diagnosis = Column(Text, nullable=True)
    admit_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="active")
