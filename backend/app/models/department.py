from sqlalchemy import Column, Integer, String

from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    unit_type = Column(String(30), nullable=True)
    location = Column(String(100), nullable=True)
