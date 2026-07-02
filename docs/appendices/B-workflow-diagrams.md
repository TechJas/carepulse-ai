# Appendix B — Workflow Diagrams

*This appendix describes the key workflows in text form. Diagrams (draw.io / Excalidraw) will be added to the `diagrams/` directory during Phase 2.*

## Alert Lifecycle

```
Vitals Stream
     ↓
Threshold Breach?
  ├── No → Continue monitoring
  └── Yes → Generate Alert
              ↓
         AI Sensor Validation
          ├── Artifact → Flag: Sensor Issue (no clinical alert)
          └── Real → Continue to Risk Scoring
                        ↓
                   AI Risk Engine
                    ├── Trend Analysis
                    ├── Feature Extraction
                    └── Risk Score (0-100%)
                          ↓
                     Priority Classification
                      ├── High (≥80%)
                      ├── Medium (40-79%)
                      └── Low (<40%)
                            ↓
                       Dashboard Update
                            ↓
                       Nurse Action
                        ├── Accept → In Progress → Resolve
                        ├── Ignore → 5 min → Escalate
                        └── Dismiss (low priority only)
```

## Nurse Shift Workflow

```
Login
  ↓
Dashboard Overview (ranked patients)
  ↓
┌────────────────────────────────────┐
│  Loop:                             │
│    Check top-priority patient      │
│    Accept alert → In Progress      │
│    Assess patient at bedside        │
│    Intervene if needed              │
│    Resolve alert                    │
│    Dashboard updates                │
│  → Loop to next patient             │
└────────────────────────────────────┘
  ↓
Shift Handover (alert history summary)
  ↓
Logout
```

## Escalation Flow

```
Alert Created (status: waiting)
  ↓
  Wait 5 minutes
  ├── Nurse accepts? → Status: In Progress → Normal workflow
  └── No action? → In-app reminder
                      ↓
                   Wait 5 more minutes
                    ├── Nurse accepts? → Status: In Progress
                    └── No action? → Notify Charge Nurse
                                        ↓
                                     Wait 5 more minutes
                                      ├── Nurse accepts? → Resolved
                                      └── No action? → Escalated (status: escalated)
                                                          ↓
                                                       Logged for review
```

---

[← Back to Document Index](../README.md)
