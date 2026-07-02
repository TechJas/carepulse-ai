# Chapter 11 — User Journey

## Current Journey (Without CarePulse AI)

1. Nurse hears alarm from unknown bed
2. Nurse looks around to identify source (5-15 seconds)
3. Nurse walks to bedside (15-60 seconds depending on location)
4. Nurse checks monitor display (5 seconds)
5. Nurse assesses patient (15-60 seconds)
6. Nurse decides: real or artifact? (5-10 seconds)
7. If real: intervene; if not: silence alarm
8. Nurse documents event (60-120 seconds)
9. Nurse resumes previous task (context switch recovery: 5-10 minutes)

**Total time per alarm:** 2-5 minutes (and that's for a single alarm decision)

## Future Journey (With CarePulse AI)

1. Dashboard updates automatically — ranked patients by risk score
2. Nurse glances at dashboard (2-3 seconds)
3. Nurse identifies: Patient 103, Risk 97%, Bed ICU-07, Oxygen dropping
4. Nurse accepts alert → "In Progress" (1 click, 1 second)
5. Nurse walks to bedside with context already in mind
6. Nurse assesses and intervenes
7. Alert auto-resolves or nurse marks resolved
8. Dashboard updates — next patient now top of list

**Total time per alert:** 30-90 seconds (with context pre-loaded)

## Journey Mapping

| Stage | Current Experience | Pain Level | Future Experience | Improvement |
|---|---|---|---|---|
| Alert occurs | Loud, undifferentiated alarm | High | Invisible — system validates silently | Reduced noise |
| Identify source | Look around, ask colleagues | High | Dashboard shows ranked list | Instant |
| Understand urgency | Check monitor, assess patient | Medium | Risk score + explanation shown | Cognitive load cut |
| Decide action | Mental triage of competing priorities | High | System shows priority order | Clear next step |
| Respond | Walk to bed, intervene | Medium | Walk with context already known | Faster response |
| Document | Manual EHR entry | High | Auto-populated alert log | Time saved |
| Return | Context switch recovery | High | Clear UI of pending items | Reduced cognitive cost |

## Experience Improvements

| Improvement | Impact |
|---|---|
| Eliminate context-free alarms | Reduced noise burden by 30%+ |
| Pre-computed risk scores | Decision time from 10s → 2s |
| Visual priority ranking | No mental triage needed |
| One-click acknowledgement | Ownership established immediately |
| Auto-documentation | Reduced documentation time |
| Escalation automation | Safety net for missed alerts |

---

[← Back to Document Index](../README.md)
