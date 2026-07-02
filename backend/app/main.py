from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import SessionLocal
from app.api import auth, alerts, patients, dashboard, nurses
from app.seed.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="CarePulse AI",
    description="AI-Powered Clinical Alert Triage Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(patients.router)
app.include_router(dashboard.router)
app.include_router(nurses.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}
