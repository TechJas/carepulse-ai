from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://carepulse:carepulse@localhost:5432/carepulse"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8-hour shift
    ESCALATION_TIMEOUT_MINUTES: int = 5

    class Config:
        env_file = ".env"


settings = Settings()
