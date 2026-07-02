from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    token: str
    user: "UserInfo"


class UserInfo(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True


class MeResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True
