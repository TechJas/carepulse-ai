from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse, UserInfo, MeResponse
from app.services.auth_service import authenticate_nurse, create_token, get_nurse_by_id
from app.midlware.auth_middleware import get_current_nurse
from app.models.nurse import Nurse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    nurse = authenticate_nurse(db, body.email, body.password)
    if not nurse:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(nurse.id)
    return TokenResponse(token=token, user=UserInfo(id=nurse.id, name=nurse.name, role=nurse.role))


@router.get("/me", response_model=MeResponse)
def me(nurse: Nurse = Depends(get_current_nurse)):
    return MeResponse(id=nurse.id, name=nurse.name, email=nurse.email, role=nurse.role)
