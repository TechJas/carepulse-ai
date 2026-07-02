from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.auth_service import decode_token, get_nurse_by_id

security = HTTPBearer()


def get_current_nurse(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    nurse_id = decode_token(token)
    if nurse_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    nurse = get_nurse_by_id(db, nurse_id)
    if nurse is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nurse not found")
    return nurse
