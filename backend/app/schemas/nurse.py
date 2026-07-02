from pydantic import BaseModel


class NurseAlertsResponse(BaseModel):
    alerts: list[dict]


class NurseStatsResponse(BaseModel):
    total_acknowledged: int
    total_resolved: int
    active_alerts: int
