# Chapter 18 — API Design

## Authentication

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Authenticate nurse, return JWT |
| `/api/auth/me` | GET | Current user profile |
| `/api/auth/logout` | POST | Invalidate session |

### POST /api/auth/login
```json
{
    "email": "priya@hospital.com",
    "password": "***"
}
// Response:
{
    "token": "eyJhbGci...",
    "user": { "id": 1, "name": "Priya", "role": "nurse" }
}
```

## Alert APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/alerts` | GET | List alerts (filterable) |
| `/api/alerts/:id` | GET | Get alert detail |
| `/api/alerts/:id/acknowledge` | POST | Accept alert ownership |
| `/api/alerts/:id/resolve` | POST | Mark alert resolved |
| `/api/alerts/:id/escalate` | POST | Escalate alert |

### GET /api/alerts
```json
// Query params: status=waiting&priority=high&limit=20
// Response:
{
    "alerts": [
        {
            "id": 123,
            "patient_id": 103,
            "patient_name": "Patient 103",
            "bed_id": "ICU-07",
            "type": "physiological",
            "parameter": "spo2",
            "value": 88,
            "threshold": 90,
            "timestamp": "2026-07-02T14:23:00Z",
            "status": "waiting",
            "risk_score": 97,
            "priority": "high",
            "explanation": "Oxygen dropping | BP falling | HR increasing",
            "assigned_to": null
        }
    ],
    "total": 18,
    "high": 4,
    "medium": 7,
    "low": 12
}
```

### POST /api/alerts/:id/acknowledge
```json
// Response:
{
    "id": 123,
    "status": "in_progress",
    "assigned_to": { "id": 1, "name": "Priya" },
    "acknowledged_at": "2026-07-02T14:23:45Z"
}
```

## Patient APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/patients` | GET | List patients |
| `/api/patients/:id` | GET | Patient detail with vitals |
| `/api/patients/:id/vitals` | GET | Patient vital sign history |
| `/api/patients/:id/alerts` | GET | Patient alert history |

### GET /api/patients/:id
```json
// Response:
{
    "id": 103,
    "bed_id": "ICU-07",
    "name": "Patient 103",
    "age": 72,
    "diagnosis": "Sepsis",
    "admit_date": "2026-06-30T08:00:00Z",
    "status": "active",
    "current_vitals": {
        "hr": 112,
        "spo2": 88,
        "systolic_bp": 82,
        "diastolic_bp": 54,
        "rr": 28,
        "temperature": 38.9
    },
    "vitals_trend": {
        "hr": [105, 108, 110, 112],
        "spo2": [94, 92, 90, 88],
        "systolic_bp": [95, 90, 85, 82]
    },
    "active_alert": {
        "id": 123,
        "risk_score": 97,
        "priority": "high",
        "explanation": "Oxygen dropping | BP falling | HR increasing"
    }
}
```

## Nurse APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/nurses/me/alerts` | GET | Alerts assigned to current nurse |
| `/api/nurses/me/stats` | GET | Nurse's shift statistics |

## Dashboard APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard/summary` | GET | Unit summary counts |
| `/api/dashboard/top-critical` | GET | Top critical patients |
| `/api/dashboard/activity` | GET | Recent activity feed |

### GET /api/dashboard/summary
```json
// Response:
{
    "total_patients": 18,
    "high_priority": 4,
    "medium_priority": 7,
    "low_priority": 12,
    "unacknowledged": 3,
    "in_progress": 1,
    "resolved_today": 42
}
```

---

## API Route Map

```
/api
├── /auth
│   ├── POST /login
│   ├── GET  /me
│   └── POST /logout
├── /alerts
│   ├── GET  /
│   ├── GET  /:id
│   ├── POST /:id/acknowledge
│   ├── POST /:id/resolve
│   └── POST /:id/escalate
├── /patients
│   ├── GET  /
│   ├── GET  /:id
│   ├── GET  /:id/vitals
│   └── GET  /:id/alerts
├── /nurses
│   ├── GET  /me/alerts
│   └── GET  /me/stats
└── /dashboard
    ├── GET  /summary
    ├── GET  /top-critical
    └── GET  /activity
```

---

[← Back to Document Index](../README.md)
