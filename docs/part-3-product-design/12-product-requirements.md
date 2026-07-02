# Chapter 12 — Product Requirements (PRD)

*Note: For the evidence-annotated PRD with research citations, see [PRD.md](../PRD.md). This chapter summarizes the requirements for quick reference.*

## Functional Requirements

### F1 — Alert Ingestion
The system shall accept vital sign data from simulated patient monitors and generate alerts based on configurable thresholds.

### F2 — AI Risk Scoring
The system shall compute a risk score (0-100%) for each alert, representing the probability of a critical event within 60 minutes.

### F3 — Alert Prioritization
The system shall classify alerts as High / Medium / Low based on risk score and display them in ranked order on the dashboard.

### F4 — Sensor Validation
The system shall detect and filter common sensor artifacts (lead displacement, motion noise, signal loss) before generating alerts.

### F5 — Trend Analysis
The system shall analyze vital sign trends over the past 60 minutes and incorporate trend direction into risk scoring.

### F6 — Alert Explanation
The system shall generate a natural-language explanation for each alert (e.g., "Rapid oxygen decrease | BP dropping | HR increasing").

### F7 — Dashboard Display
The system shall display a ranked patient list with risk score, bed location, alert reason, and status.

### F8 — Alert Acknowledgement
The nurse shall be able to accept an alert (→ In Progress) and later resolve or escalate it.

### F9 — Escalation
If an alert is not acknowledged within 5 minutes, the system shall notify the charge nurse.

### F10 — Alert History
The system shall maintain an audit log of all alerts, acknowledgements, and resolutions.

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| Dashboard refresh rate | < 1 second |
| Alert processing latency | < 500ms |
| System uptime | 99.9% |
| Concurrent users | 20+ nurses |
| Training time | < 15 minutes |
| Data retention | 90 days for alerts |

## Business Requirements

- Must reduce non-actionable alerts by at least 30%
- Must demonstrate ROI through reduced response time
- Must comply with basic healthcare data privacy principles
- Must be deployable alongside existing monitoring infrastructure

## Constraints

- MVP will use simulated patient data (no live hospital integration)
- AI model training limited to publicly available ICU datasets
- No FDA clearance or HIPAA compliance audit for MVP phase

## Assumptions

- ICU has existing patient monitors with standard alarm outputs
- Nurses have access to a computer or tablet for dashboard viewing
- Network connectivity is available within the ICU

## Acceptance Criteria

| Scenario | Given | Then |
|---|---|---|
| High-risk alert | Vitals indicate rapid deterioration | Alert appears at top of dashboard with Risk > 90% |
| Sensor artifact | ECG lead disconnects | Alert is filtered and marked as "Sensor Issue" |
| Alert acknowledged | Nurse clicks Accept | Status changes to In Progress, timer stops |
| Alert not acknowledged | 5 minutes pass | Charge nurse is notified |
| Duplicate alert | Same event triggers twice | Only one alert appears in the list |
| Trend detection | BP dropping slowly over 30 min | Risk score increases before threshold is breached |

---

[← Back to Document Index](../README.md)
