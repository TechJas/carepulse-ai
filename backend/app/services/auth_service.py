from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.models.nurse import Nurse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(nurse_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(nurse_id), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload["sub"])
    except (JWTError, ValueError, KeyError):
        return None


def authenticate_nurse(db: Session, email: str, password: str) -> Nurse | None:
    nurse = db.query(Nurse).filter(Nurse.email == email).first()
    if not nurse or not verify_password(password, nurse.hashed_password):
        return None
    return nurse


def get_nurse_by_id(db: Session, nurse_id: int) -> Nurse | None:
    return db.query(Nurse).filter(Nurse.id == nurse_id).first()
