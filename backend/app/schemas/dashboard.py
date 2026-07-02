from pydantic import BaseModel
from typing import Optional


class DashboardSummaryResponse(BaseModel):
    total_patients: int
    high_priority: int
    medium_priority: int
    low_priority: int
    unacknowledged: int
    in_progress: int


class TopCriticalResponse(BaseModel):
    patients: list[dict]
