# Chapter 16 — Dashboard Design

## ICU Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ ICU Dashboard                                    Priya ▼│
│ Patients: 18   High: 4 ●   Medium: 7 ●   Low: 12 ●     │
├─────────────────────────────────────────────────────────┤
│ ┌─ Top Critical Patients ──────────────────────────────┐│
│ │                                                     ││
│ │ ● Patient 103 │ Risk 98% │ Bed ICU-07 │ Waiting    ││
│ │   Reason: Oxygen ↓ | BP ↓ | HR ↑                    ││
│ │                                                     ││
│ │ ● Patient 210 │ Risk 95% │ Bed ICU-03 │ In Progress ││
│ │   Handled by: Nurse Priya                           ││
│ │                                                     ││
│ │ ● Patient 118 │ Risk 90% │ Bed ICU-09 │ Waiting    ││
│ │   Reason: Sensor Issue — ECG lead disconnected      ││
│ │                                                     ││
│ │ ● Patient 087 │ Risk 72% │ Bed ICU-11 │ Waiting    ││
│ │   Reason: BP trending down | HR elevated            ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─ All Patients ──────────────────────────────────────┐│
│ │ ID │ Bed │ Risk │ Top Reason              │ Status  ││
│ │103 │ICU-7│ 98%  │ Oxygen ↓ BP ↓ HR ↑      │ Waiting ││
│ │210 │ICU-3│ 95%  │ Arrhythmia detected     │ Active  ││
│ │118 │ICU-9│ 90%  │ Sensor Issue            │ Waiting ││
│ │087 │ICU-11│ 72%  │ BP trend ↓             │ Waiting ││
│ │045 │ICU-5│ 45%  │ HR slightly elevated    │ Resolved││
│ │... │ ... │ ...  │ ...                     │ ...     ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Patient Queue

The main dashboard displays patients in descending order of risk score. Each card shows:
- Patient ID / name
- Risk score (color-coded: red ≥ 80%, yellow 40-79%, green < 40%)
- Bed location
- Alert reason (top 1-3 contributing factors)
- Status (Waiting / In Progress / Resolved)
- Assigned nurse (if any)

## Risk Cards

Each patient card is color-coded:
- **Red** (≥80% risk) — High priority, immediate action
- **Amber** (40-79% risk) — Medium priority, assess soon
- **Green** (<40% risk) — Low priority, monitor
- **Gray** — Sensor issue, no clinical alert

## Patient Details (on click)

When a nurse clicks a patient card, a detail panel opens showing:

1. **Patient Summary** — Name, age, diagnosis, admit date
2. **Current Vitals** — Real-time values for HR, SpO₂, BP, RR, Temp
3. **Historical Trend** — Sparkline charts for each vital (last 60 min)
4. **Alert Timeline** — Chronological list of recent alerts with status
5. **AI Explanation** — Full natural language explanation of current risk
6. **Action Buttons** — Accept / Resolve / Escalate

## Alert Timeline

Chronological list of all alerts for a selected patient:
- Time of alert
- Type (Physiological / Technical / Advisory)
- Value that triggered it
- Status (Waiting / In Progress / Resolved)
- Nurse action (who acknowledged, when)
- Duration from alert to resolution

## Acknowledgement Workflow

1. Dashboard shows alert as "Waiting"
2. Nurse clicks → "Accept" → Status becomes "In Progress"
3. Nurse clicks → "Resolve" → Status becomes "Resolved"
4. If no click within 5 minutes → Escalation triggers

## Escalation

When an alert is not acknowledged within 5 minutes:
- Background of card turns darker red
- "Escalating..." badge appears
- Charge nurse dashboard shows notification
- Sound alert (distinct from patient monitor alarms)

## Filtering

Nurses can filter the patient list by:
- Priority level (High / Medium / Low)
- Status (Waiting / In Progress / Resolved)
- Assigned nurse
- Bed location / ICU zone

## Search

Quick-search bar to find patients by:
- Patient ID
- Bed number
- Name (if available)

## Dark Mode

The dashboard supports a dark mode toggle, reducing screen glare in the dimly lit ICU environment. Default mode adapts to system preference.

## Accessibility

- High contrast mode option
- Keyboard navigable (Tab / Shift+Tab through patient cards)
- Screen reader support (ARIA labels)
- Font size adjustable
- Color not the only differentiator (risk percentage also shown numerically)

---

[← Back to Document Index](../README.md)
