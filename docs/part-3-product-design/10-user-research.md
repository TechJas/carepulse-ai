# Chapter 10 — User Research

## Primary Users

**ICU Nurses** are the primary users. They spend 12-hour shifts at the bedside, responsible for 1-2 patients (high acuity) or 2-3 patients (step-down). Their work is interrupt-driven, documentation-heavy, and emotionally demanding.

## Secondary Users

**Charge Nurses** oversee the entire unit, assign patients to nurses, and manage crisis situations. They need a high-level view of alert activity across all beds and automated escalation when alerts go unanswered.

**Intensivists and Residents** occasionally use the dashboard for patient status overview but are not the primary interaction target.

## Personas

### Persona 1: Priya (ICU Nurse, 5 years experience)
- **Age:** 32
- **Shift:** Night shift, 12 hours
- **Patients:** 2-3 per shift
- **Pain point:** "I can't tell which alarm is real anymore. I've learned to ignore the SpO₂ alarm because it always false-alarms on Mr. Chen. But what if one day it's real?"
- **Need:** A system that tells her which patients genuinely need attention, sorted by urgency

### Persona 2: David (Charge Nurse, 12 years experience)
- **Age:** 45
- **Shift:** Day shift, 12 hours
- **Responsibility:** Overseeing 12-bed MICU
- **Pain point:** "I spend half my shift walking around checking if nurses have seen the alarms. There's no way to know if an alert has been acknowledged unless I physically go to the bed."
- **Need:** Centralized visibility into alert status and automatic escalation for unanswered alerts

### Persona 3: Dr. Sharma (Intensivist)
- **Age:** 40
- **Shift:** Rotating
- **Responsibility:** Medical oversight of ICU patients
- **Pain point:** "I get called for alarms that are nothing. The system doesn't differentiate between a transient desaturation and genuine respiratory failure."
- **Need:** Context-rich alerts that explain why this alarm matters and what trend led to it

## Pain Points

1. **Information overload** — Too many alarms, most irrelevant
2. **No prioritization** — Critical and trivial alarms look identical
3. **Context switching** — Each alarm interrupts the current task
4. **Unclear ownership** — Unclear which nurse is handling which alert
5. **No escalation safety net** — Alerts can go unnoticed with no automatic backup

## Needs

1. **At-a-glance triage** — Instantly see which patient is most critical
2. **Alert explanations** — Understand why a patient is flagged
3. **Ownership visibility** — Know who is handling each alert
4. **Escalation automation** — Automatic notification when alerts go unacknowledged

## Expectations

- Response time: Dashboard updates within 1 second of alert
- Training time: < 15 minutes to learn the system
- Integration: Works alongside existing monitors (not replacing them)
- Reliability: 99.9% uptime for critical alerts

---

[← Back to Document Index](../README.md)
