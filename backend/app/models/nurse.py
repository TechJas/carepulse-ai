from sqlalchemy import Column, Integer, String

from app.database import Base


class Nurse(Base):
    __tablename__ = "nurses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default="nurse")
