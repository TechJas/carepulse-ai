# CarePulse AI

**AI-Powered Clinical Alert Triage Platform**

ICU nurses receive **771 alerts per bed per day**. **72–99% are false or non-actionable**. This causes alert fatigue, delayed response to critical events, and preventable patient deaths.

CarePulse AI is a research-backed, AI-driven platform that helps nurses answer four questions within **5 seconds**:

1. **Which patient** needs attention first?
2. **Why** is this patient critical?
3. **Where** is the patient?
4. **Is someone** already handling this alert?

---

## Documentation

| Document | Description |
|---|---|
| [Research Blueprint](docs/README.md) | 22-chapter product research, design & technical blueprint |
| [PRD](docs/PRD.md) | Evidence-annotated Product Requirements Document |
| [Phase 0 Research](docs/phase-0-research-report.md) | Literature review, competitive analysis, failure modes |

### Quick Links by Part

| Part | Chapters | Topics |
|---|---|---|
| [Part 1 — Understanding the Problem](docs/part-1-understanding-problem/) | 1–6 | Healthcare ecosystem, ICU workflow, monitoring, alert fatigue |
| [Part 2 — Market Research](docs/part-2-market-research/) | 7–8 | Competitor analysis, gap analysis, SWOT |
| [Part 3 — Product Design](docs/part-3-product-design/) | 9–13 | Vision, user research, journey, PRD, MVP planning |
| [Part 4 — Solution Design](docs/part-4-solution-design/) | 14–19 | Architecture, AI design, dashboard, database, API, security |
| [Part 5 — Development](docs/part-5-development/) | 20–22 | Roadmap, future scope, conclusion |
| [Appendices](docs/appendices/) | A–E | Terminology, diagrams, references, papers, design decisions |

---

## The Problem

ICU nurses are overwhelmed by alarms:

- **771 alerts** per bed per day
- **72–99%** are false or non-actionable
- **81%** of nurses report too many alarms
- **35%** of nurse time spent on alarm management
- **560+** alarm-related deaths reported to FDA (2005–2008)
- **80 deaths** from delayed response (Joint Commission 2009–2012)

## The Solution

A platform that uses AI to:

- **Validate** alerts — filter sensor noise and artifacts
- **Rank** patients by clinical urgency
- **Explain** why an alert matters in natural language
- **Escalate** when no action is taken within a defined window

---

## Frontend (Live)

The MVP frontend is built in `frontend/`:

```bash
cd frontend
npm install
npm run dev      # → http://localhost:5173
npm run build    # → dist/
```

Includes: ICU dashboard with ranked patient cards, patient detail panel, alert acknowledgement workflow, dark mode, filtering/search.

---

## Tech Stack

*Planned — MVP phase*

| Layer | Technology |
|---|---|
| Frontend | React / TypeScript |
| Backend | Node.js / Python |
| AI/ML | Python (scikit-learn, XGBoost) |
| Database | PostgreSQL |
| API | REST (FHIR-aligned) |
| Auth | JWT / SSO |

---

## Status

Phase 0 research complete. Research blueprint documented. Ready for system design and implementation.

---

## License

MIT — see [LICENSE](LICENSE).

## Author

**Jasmin** — [GitHub](https://github.com/TechJas)
