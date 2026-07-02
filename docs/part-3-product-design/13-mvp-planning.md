# Chapter 13 — MVP Planning

## Must Have (MVP)

| Feature | Priority | Effort |
|---|---|---|
| Alert ingestion from simulated patient data | P0 | Medium |
| AI risk scoring (basic model) | P0 | High |
| Alert prioritization (High / Medium / Low) | P0 | Medium |
| Dashboard with ranked patient list | P0 | High |
| Alert acknowledgement workflow | P0 | Medium |
| Alert history / audit log | P0 | Low |
| Escalation after 5-minute timeout | P0 | Low |

## Should Have (V1.1)

| Feature | Rationale |
|---|---|
| Natural-language alert explanations | Reduces cognitive load further |
| Trend visualization on patient detail view | Helps nurses see deterioration patterns |
| Patient filter and search | Useful for larger ICUs |
| Dark mode | Reduces screen glare in dimly lit ICUs |

## Could Have (V1.2)

| Feature | Rationale |
|---|---|
| Sensor validation module | Reduces false alarms further |
| Shift handover summary | Improves information transfer |
| Export / reporting | Quality improvement analytics |
| Multi-unit support | Scalability to multiple ICUs or hospital-wide |

## Won't Have (V2+)

| Feature | Reason |
|---|---|
| Live hospital EHR integration | Requires HL7/FHIR, regulatory clearance |
| Predictive deterioration (30 min ahead) | Requires extensive clinical validation |
| Mobile app for doctors | Expands scope beyond MVP |
| Voice assistant | Experimental, adds complexity |
| FDA clearance | Out of scope for MVP |

## Release Plan

| Phase | Focus | Duration |
|---|---|---|
| **Phase 1** | Research & Documentation | Complete |
| **Phase 2** | UI/UX Design (Figma prototypes) | 2-3 weeks |
| **Phase 3** | Backend API + Database | 3-4 weeks |
| **Phase 4** | Frontend Dashboard | 3-4 weeks |
| **Phase 5** | AI Module (risk scoring) | 3-4 weeks |
| **Phase 6** | Integration & Testing | 2-3 weeks |
| **Phase 7** | Demo & Case Study | 1-2 weeks |
| **Total MVP** | | **16-22 weeks** |

---

[← Back to Document Index](../README.md)
