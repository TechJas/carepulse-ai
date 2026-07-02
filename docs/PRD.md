# Product Requirements Document (PRD)

## Project Name

**CarePulse AI**

**AI-Powered Clinical Alert Triage Platform**

Version 1.0 | June 2026

> **Note**: This is the evidence-annotated PRD. Every feature is linked to findings from the Phase 0 Research Report (`docs/phase-0-research-report.md`), which validated all claims against published clinical literature.

---

# 1. Vision

## Problem Statement

ICU nurses receive hundreds of alarms every shift.

Many alarms are:

- Duplicate
- Sensor noise
- Temporary fluctuations
- Low clinical importance

Because every alert sounds similar, nurses gradually become desensitized.

This phenomenon is known as **Alert Fatigue**.

**Evidence**: 72–99% of ICU alarms are false or non-actionable [Phase 0 §2.1]. 81% of nurses report too many alarms [Phase 0 §4.4].

## Impact

| Problem | Evidence |
|---|---|
| Critical alerts may be delayed | 80 deaths from delayed response (Joint Commission 2009–2012) |
| Nurse workload increases | 35% of nurse time spent on alarms |
| Response time increases | 5–10 sec per alarm decision |
| Patient safety decreases | 560+ alarm-related deaths reported to FDA (2005–2008) |

## Vision

Build an intelligent platform that helps nurses answer four questions within **5 seconds**.

1. Which patient needs attention first?
2. Why is this patient critical?
3. Where is the patient?
4. Is someone already handling this alert?

**Evidence**: Nurses currently spend 5–10 seconds per alarm just deciding if it's actionable [Phase 0 §4.4]. The 4-question framework maps directly to their cognitive workflow [Phase 0 §4.1].

---

# 2. Product Goals

## What the System Does NOT Do

| Constraint | Rationale |
|---|---|
| Diagnose diseases | Outside scope; requires regulatory clearance (FDA SaMD Class II/III) |
| Recommend medicines | Would require clinical decision support certification |
| Replace nurses | Nursing judgment remains final; this is a triage tool |

## What the System Does

| Goal | Evidence |
|---|---|
| Prioritize alerts | Nurses use "conditional prioritization" as a coping strategy — dangerous and inconsistent [Phase 0 §4.3] |
| Reduce false alarms | 85–99% of current alarms are non-actionable [Phase 0 §2.1] |
| Explain alert reasons | 5–10 sec decision time per alarm; explainability cuts cognitive load [Phase 0 §4.4] |
| Improve nurse workflow | 35% of nurse time reclaimed from alarm management [Phase 0 §4.4] |

---

# 3. Users

## Primary User

**ICU Nurse**

| Aspect | Detail |
|---|---|
| Responsibility | Monitor patients, receive alerts, respond quickly |
| Pain points | Too many alarms, duplicate alerts, difficult to identify urgent patient |
| **Evidence** | Coping strategy analysis shows nurses develop "deliberate balancing" and "negligent performance" — both dangerous [Phase 0 §4.3] |

## Secondary User

**Head Nurse**

| Responsibility | Monitor ICU activity, escalate delayed alerts, manage workload |
|---|---|
| **Need** | 80 deaths from delayed response could be prevented with automated escalation [Phase 0 §2.2] |

## Future Users

- Hospital Administrator
- Doctor
- Quality Team

---

# 4. Scope

## Included

| Feature | Evidence |
|---|---|
| AI Risk Prioritization | 72–99% false alarms → need intelligent filtering [Phase 0 §2.1] |
| Alert Ranking | No current system ranks patients by urgency [Phase 0 §5.1] |
| Trend Analysis | Isolated alarms miss deterioration patterns [Phase 0 §5.1] |
| Alert Dashboard | Nurses need at-a-glance triage view [Phase 0 §4.1] |
| Patient Timeline | Current systems lack historical context [Phase 0 §5.1] |
| Alert History | No audit trail in current systems |
| Nurse Assignment | "Conditional prioritization" shows unclear ownership [Phase 0 §4.3] |
| Alert Escalation | 80 deaths from non-escalated alarms [Phase 0 §2.2] |

## Not Included

- Disease Prediction
- Drug Recommendation
- Medical Diagnosis
- Treatment Planning

---

# 5. Product Workflow

```
Patient Monitor
     ↓
Vitals Stream
     ↓
Alert Engine (validates: real alert? sensor error? duplicate?)
     ↓
AI Risk Engine (calculates risk score)
     ↓
Priority Classification (High / Medium / Low)
     ↓
Dashboard (ranked patient view)
     ↓
Nurse Action (accept → in progress → resolved)
     ↓
Alert Closed (or escalated if no action in 5 min)
```

**Validation**: This workflow matches the documented nurse alarm response process [Phase 0 §4.1], with the AI Risk Engine inserted at the decision bottleneck point.

---

# 6. User Journey

## Step 1–4: Alert Creation → AI Processing

| Step | Detail |
|---|---|
| Patient monitor detects abnormal vitals | Device-specific protocol |
| Alert enters AI Engine | Sensor Validation module filters artifacts |
| AI calculates Risk Score | Defined as: *probability of critical event within 60 minutes* |
| Alert classified | High / Medium / Low |

**Evidence**: Risk score definition is grounded in the trend analysis literature — deterioration signals appear 15–30 minutes before critical events [Phase 0 §3.1].

## Step 5–7: Nurse Action → Escalation

| Step | Detail |
|---|---|
| Dashboard updates automatically | Ranked by risk score |
| Nurse accepts alert → "In Progress" | Ownership is tracked |
| If no action within 5 minutes → Escalate to Head Nurse | Time-bound escalation reduces delayed response [Phase 0 §5.1] |

**Evidence**: The 5-minute threshold is based on Joint Commission findings that delays >5 minutes increase risk of adverse events [Phase 0 §2.2].

---

# 7. Dashboard

## Home Screen Layout

```
--------------------------------------------------
ICU Dashboard
--------------------------------------------------
Patients: 18   High: 4   Medium: 7   Low: 12
--------------------------------------------------
Top Critical Patients
--------------------------------------------------
1. Patient 103   Risk 98%   Bed ICU-07   Status: Waiting
   Reason: Oxygen ↓ | BP ↓ | HR ↑
--------------------------------------------------
2. Patient 210   Risk 95%   Bed ICU-03   Status: In Progress
   Handled by: Nurse Priya
--------------------------------------------------
3. Patient 118   Risk 90%   Bed ICU-09   Status: Waiting
   Sensor Issue
--------------------------------------------------
```

## Patient Detail View (on click)

- Patient Summary
- Current Vitals
- Historical Trend
- Alert Timeline
- Medical History
- Assigned Nurse
- Previous Alerts
- AI Explanation

**Validation**: The 4-column top-patient layout maps to the 4-question vision (which patient → why → where → who).

---

# 8. AI Engine

## Inputs

| Input | Source | Purpose |
|---|---|---|
| Current Vitals | Patient monitor (FHIR Observation) | Real-time status |
| Historical Vitals | EHR / local database | Trend detection |
| Patient Context (ward, age, history) | EHR (FHIR Patient) | Baseline adjustment |
| Sensor Quality | Device self-diagnostics | Artifact detection |
| Previous Alerts | Local database | Duplicate detection |

## Outputs

| Output | Format | Purpose |
|---|---|---|
| Risk Score | 0–100% | Probability of critical event within 60 min |
| Priority | High / Medium / Low | Action urgency |
| Reason | Natural language | Clinical explanation |
| Confidence | 0–100% | Model certainty |

## Example Output

```
Risk Score:    97%
Priority:      High
Reason:        Rapid oxygen decrease | BP dropping | HR increasing
Confidence:    95%
```

---

# 9. Nurse Workflow

```
Login → Dashboard → Accept Alert → Visit Patient → Update Status → Close Alert
```

## Alert Statuses

| Status | Definition |
|---|---|
| Waiting | Alert created, no action taken |
| In Progress | Nurse accepted ownership |
| Resolved | Patient assessed, issue addressed |
| Escalated | Timeout exceeded, Head Nurse notified |
| Closed | Completed |

---

# 10. Escalation Rules

| Time | Action |
|---|---|
| Alert created | Status: Waiting |
| 5 minutes | In-app reminder |
| 10 minutes | Notify Head Nurse |
| 15 minutes | Escalate again (escalated status) |

**Evidence**: MGH case showed 23-minute ignored alarm [Phase 0 §2.2]. Joint Commission reports 80 deaths from delayed response [Phase 0 §2.2].

---

# 11. AI Modules

| Module | Purpose | Validation |
|---|---|---|
| Sensor Validation | Detect faulty sensors; reduce artifact-triggered alarms | 63.8% of alarms are from sensor artifacts [Phase 0 §2.1] |
| Trend Analysis | Detect worsening condition before threshold breach | Trend detection enables 15-min earlier alerts [Phase 0 §3.1] |
| Risk Prediction | Estimate deterioration probability within 60 min | Risk scoring is the core unmet need [Phase 0 §5.1] |
| Priority Ranking | Sort patients by risk score | No current system ranks patients [Phase 0 §4.3] |
| Explainability | Explain AI decisions in natural language | 5–10 sec decision time; explanation reduces cognitive load [Phase 0 §4.4] |

---

# 12. Database Entities

- Patients
- Nurses
- Vitals
- Alerts
- Risk Scores
- Assignments
- Alert History
- Departments

---

# 13. API Endpoints

| API | Purpose |
|---|---|
| Login API | Authentication (SSO with EHR) |
| Patient API | Patient data (FHIR Patient resource) |
| Vitals API | Vital signs (FHIR Observation resource) |
| Alert API | Alert CRUD |
| Risk API | Risk score computation |
| Assignment API | Nurse alert assignment |
| Dashboard API | Aggregated view |
| History API | Alert audit log |

---

# 14. Future Roadmap

| Version | Feature |
|---|---|
| V2 | Predict deterioration 30 minutes before alerts |
| V3 | AI Nurse Workload Balancer |
| V4 | Hospital-wide Operations Dashboard |
| V5 | Doctor Mobile App |

---

# 15. Success Metrics

| Metric | Goal | Baseline |
|---|---|---|
| False alerts reduced | >30% | Current: 85–99% non-actionable |
| Average nurse response time | Reduced by 20% | CalmWave benchmark: 15-min earlier alerts |
| Duplicate alerts removed | >80% | Current: zero deduplication |
| Alert acknowledgement time | <30 seconds | Current: 5–10 sec per alarm + context switch |
| Nurse satisfaction | Improved | Current: 81% report too many alarms |

---

# Appendix A: Evidence Map

Every PRD feature mapped to Phase 0 findings:

| Feature | Phase 0 Section |
|---|---|
| AI Risk Prioritization | §2.1, §5.1 |
| Alert Ranking | §4.3, §5.1 |
| Trend Analysis | §5.1, §3.1 |
| Sensor Validation | §2.1, §5.1 |
| Escalation Rules | §2.2, §5.1 |
| Nurse Assignment | §4.3, §5.1 |
| Dashboard | §4.1, §4.4 |
| Explainability | §4.4, §5.1 |
| AI Modules | §5.1 (full traceability matrix) |
| Success Metrics | §2.1, §3.1, §4.4 |

---

*End of PRD. See `docs/phase-0-research-report.md` for full evidence citations.*
