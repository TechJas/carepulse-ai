# Appendix E — Design Decisions

## Decision Log

| # | Decision | Rationale | Alternative Considered |
|---|---|---|---|
| 1 | **Risk score as 0-100%** | Familiar mental model; easy to map to priority tiers | Categorical (Low/Med/High) alone loses granularity |
| 2 | **60-minute prediction window** | Long enough for clinical intervention, short enough for accuracy | 30 min (too reactive), 120 min (too uncertain) |
| 3 | **XGBoost for risk scoring** | Best performance on tabular healthcare data; interpretable; well-documented | Deep learning (requires more data; harder to explain) |
| 4 | **REST API (not GraphQL)** | Simpler to build and document; sufficient for dashboard queries | GraphQL (overkill for MVP query patterns) |
| 5 | **PostgreSQL (not NoSQL)** | Relational data model; FHIR-like structure; JSON support when needed | MongoDB (less suited for time-series + relational queries) |
| 6 | **React (not Vue/Angular)** | Ecosystem maturity; TypeScript support; shadcn/ui component library available | Vue (less ecosystem), Angular (more boilerplate) |
| 7 | **Node.js backend (not Python)** | Single language across stack; faster MVP iteration | Python Flask (better for ML integration, but language mismatch) |
| 8 | **AI in Python (separate service)** | Python is the ecosystem for ML; separation keeps concerns decoupled | Node.js ML libraries (limited maturity) |
| 9 | **Alert explanation via feature templates (not LLM)** | Deterministic, fast, no hallucination risk; sufficient for MVP | LLM-based (flexible but slower, unreliable, expensive) |
| 10 | **JWT auth (not OAuth/SSO)** | Simple to implement; sufficient for MVP with simulated data | OAuth (needed for real EHR SSO, but adds complexity now) |
| 11 | **5-minute escalation threshold** | Aligned with literature showing >5 min delays increase adverse events | 10 min (too late), 3 min (too aggressive) |
| 12 | **Dark mode default in ICU** | ICUs are dimly lit; dark mode reduces glare and eye strain | Light mode (appropriate for office but not ICU environment) |

## Key Trade-offs

| Trade-off | Chosen Path | What We Sacrificed |
|---|---|---|
| MVP speed vs. completeness | Build core workflow first | Advanced features (predictive, mobile, voice) |
| Accuracy vs. interpretability | XGBoost + feature templates | Potential accuracy of deep learning |
| React frontend vs. native | React web app | Native performance, offline capability |
| Simulated data vs. real integration | Simulated data for MVP | Real-world validation, hospital buy-in |
| Single ICU focus vs. hospital-wide | ICU-only initial scope | Broader market appeal initially |

## Future Decision Points

- When to add LLM-based explanations (requires: reliability guarantees + cost analysis)
- When to invest in FHIR/HL7 integration (requires: hospital partnership)
- When to expand from ICU to other departments (requires: ICU traction data)

---

[← Back to Document Index](../README.md)
