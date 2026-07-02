# Phase 0 Research Report

## CarePulse AI — Evidence-Driven Product Validation

**Version:** 1.0  
**Date:** June 2026  
**Author:** Senior Product Manager  
**Status:** Complete  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Validation: Literature Review](#2-problem-validation-literature-review)
3. [Competitive Landscape Analysis](#3-competitive-landscape-analysis)
4. [Nurse Workflow Analysis](#4-nurse-workflow-analysis)
5. [Current System Failure Mode Analysis](#5-current-system-failure-mode-analysis)
6. [Standards & Architecture Prerequisites](#6-standards--architecture-prerequisites)
7. [Evidence-Annotated PRD](#7-evidence-annotated-prd)
8. [References](#8-references)

---

## 1. Executive Summary

### Problem

ICU nurses are exposed to **771 alerts per bed per day**. An estimated **72–99% of these alarms are false or non-actionable** [1][2][3]. This phenomenon, known as **alarm fatigue**, leads to desensitization, delayed response to critical events, increased nurse burnout, and preventable patient deaths [4][5].

### Market Opportunity

The ICU Analytics AI market was valued at **$1.2B in 2024** and is projected to reach **$8.9B by 2033** (CAGR 24.6%) [6]. Regulatory bodies have made alarm management a **National Patient Safety Goal** since 2014 [7]. Despite this, no dominant software solution exists — the space is fragmented among hardware vendors (Philips, GE, Mindray), enterprise middleware (Ascom), and early-stage AI startups (CalmWave).

### Product Thesis

CarePulse AI is not an "AI project." It is a **Clinical Operations Platform** whose first feature is **Intelligent Alert Triage**. The core insight validated by this research is:

> Nurses don't need more alerts. They need fewer, better, prioritized alerts — delivered to the right person at the right time with an explanation of why.

### Key Validation Findings

| Claim | Evidence | Confidence |
|---|---|---|
| 85%+ of ICU alarms are non-actionable | Replicated across 15+ peer-reviewed studies (2010–2026) | **High** |
| Alarm fatigue causes preventable deaths | Joint Commission: 80 deaths in 3.5 years; FDA: 560+ deaths (2005–2008) | **High** |
| Nurses spend 35% of time on alarms | Springer study, Cognition Technology & Work | **High** |
| No standardized triage system exists | Qualitative studies show nurses use "conditional prioritization" — a dangerous coping strategy | **High** |
| AI can reduce alarms by 47% and detect deterioration 15min earlier | CalmWave/Wellstar case study, 2025 | **Medium** (single site) |

---

## 2. Problem Validation: Literature Review

### 2.1 The Scale of the Problem

A 2025 systematic review and meta-synthesis of 11 qualitative studies (PMCID: PMC11992819) summarized three main themes [8]:

1. **Adverse outcomes of frequent alarms** — increased workload, eroded trust, heightened fatigue, endangered patient safety
2. **Causes of alarm fatigue** — excessive false alarms, poor device design, lack of standardization
3. **Effective strategies to manage alarm fatigue** — reducing false alarms, enhancing reliability, nurse training, optimizing environments

Key quantitative findings across the literature:

| Study | Year | Finding |
|---|---|---|
| Ruppel et al. | 2018 | >85% of ICU alarms are non-actionable |
| AACN Practice Alert | 2018 | ~90% of alarms in critical care are false or clinically irrelevant |
| Graham & Cvach | 2010 | 900 alarm signals per patient per day in some ICUs |
| Lewandowska et al. | 2020 | 389 nurses studied; alarms are "burdensome and too frequent" |
| Li et al. (PLOS One) | 2025 | Median alarm fatigue score 26 (IQR 19.75–31); 54.4% moderate fatigue |
| Hohenwallner et al. (BMC Nursing) | 2025 | Mean CAFQa score 17.7 ± 5; no correlation with experience level |
| South Korea study | 2024 | 2,184 alarms over 2 days; 63.8% false |
| Ucak et al. (J Clinical Nursing) | 2025 | "Building alarm management culture" and "improving device features" as key themes |

### 2.2 Documented Harm

**Massachusetts General Hospital, 2010** [9]:

A young cardiac patient died after staff ignored her alarms for over 23 minutes. Ten nurses were on duty that morning; none recalled hearing any warnings. This case is the most cited example of alarm fatigue causing preventable death.

**Joint Commission Sentinel Event Data, 2009–2012** [7]:

- 98 alarm-related adverse events reported
- 80 resulted in patient death
- 13 resulted in permanent loss of function
- 5 resulted in unexpected extended hospitalization

**FDA Data, 2005–2008** [10]:

- 560 alarm-related deaths reported

### 2.3 Root Causes Identified in Literature

1. **Device manufacturers over-alarm** to minimize liability — sensitivity prioritized over specificity [11]
2. **Default alarm thresholds are not patient-specific** — a 70-year-old with COPD has different baselines than a 30-year-old athlete [12]
3. **No cross-vendor interoperability** — ventilators, infusion pumps, and monitors alarm independently without correlation [13]
4. **Alarm frequency range (2.5–3.15 kHz)** is similar to a human scream — deliberately attention-grabbing but cognitively exhausting [14]
5. **Nurses are mobile, devices are static** — alarms go to the central station, not the nurse [13]

---

## 3. Competitive Landscape Analysis

### 3.1 Direct Competitors

| Company | Product | Approach | Stage | Key Metric |
|---|---|---|---|---|
| **CalmWave** | Calm ICU | AI-powered alarm reduction, medication/vital trend overlay | $9.6M seed; Wellstar pilot | 47% alarm reduction; 15min earlier deterioration detection |
| **Ascom** | Silent ICU | Alarm distribution middleware using ISO/IEEE 11073 SDC | Enterprise (Dräger, B. Braun partners) | Silent bedside, dashboard routing at nurse station |
| **SASICU** | Smart and Silent ICU | EU-funded research consortium (IHI) | Multi-center studies | No commercial product yet |
| **Parallel Technologies** | Virtual Patient Monitoring | AI camera-based monitoring + EHR integration | Enterprise | Fall prediction, behavioral detection |

### 3.2 Indirect Competitors

| Company | Product | Relevance |
|---|---|---|
| **Epic / Cerner** | EHR systems with basic alerting | No AI triage; alerts are generic |
| **Philips / GE / Mindray** | Patient monitors with proprietary alarms | Hardware-locked; no cross-platform triage |
| **Spok** | Clinical communication middleware | Alert routing but no AI prioritization |
| **Vital** | ED patient experience platform | FHIR-based but not ICU-focused |

### 3.3 Competitive Gap (CarePulse Opportunity)

| Capability | CalmWave | Ascom | Epic/Cerner | CarePulse (Target) |
|---|---|---|---|---|
| AI risk scoring | Yes | No | No | Yes |
| Cross-device aggregation | Partial | Yes (via SDC) | No | Yes |
| Mobile-first workflow | No | Yes (pager/smartphone) | No | Yes |
| Open-source / extensible | No | No | No | **Planned** |
| Explainable AI | No | N/A | N/A | Yes |
| Escalation engine | No | Basic routing | No | Yes |
| Nurse assignment | No | No | Yes (basic) | Yes |
| FHIR-native | Yes | No | Yes | Yes |

**Key Insight**: No current product combines **AI risk prioritization + cross-platform aggregation + mobile-first workflow + escalation engine** in a single platform. This is CarePulse's wedge.

---

## 4. Nurse Workflow Analysis

### 4.1 Current Workflow (Synthesized from Qualitative Studies)

The following workflow is derived from thematic synthesis of 11 qualitative studies [8] plus task analysis from Bostan et al. [15]:

```
Alarm sounds
  ↓
Nurse identifies which patient (2-5 sec)
  ↓
Nurse identifies which device (1-2 sec)
  ↓
Nurse determines criticality (3-10 sec)
    ├── High → Respond immediately
    ├── Medium → Complete current task first
    └── Low/Ignore → Silence or disable
  ↓
If response: walk to bedside
  ↓
Assess patient
  ↓
Take action (adjust meds, call physician, reposition)
  ↓
Silence alarm
  ↓
Resume prior task (context switch cost: 23 min recovery)
```

### 4.2 Cognitive Load Points

1. **Alarm identification** — No visual differentiation between critical vs. non-critical alarms
2. **Patient prioritization** — No ranked view of which patient needs attention first
3. **Context recovery** — Each alarm interrupts the current task; nurses report 23-minute cost to regain deep focus
4. **Trust erosion** — After 10+ false alarms, nurses begin ignoring all alarms

### 4.3 Coping Strategies (Dangerous)

Iranian ICU nurses described four coping strategies [16]:

| Strategy | Description | Risk |
|---|---|---|
| **Smart care** | Experienced nurses use intuition to filter alarms | Works for experts; fails for novices |
| **Deliberate balancing** | Choose which alarms to respond to based on workload | Missed critical events during high load |
| **Conditional prioritization** | Prioritize by patient history, not alarm urgency | Subjective; inconsistent |
| **Negligent performance** | Ignoring or disabling alarms entirely | Direct patient harm |

### 4.4 Time Allocation

- **35%** of nurse time spent on alarm-related activities [17]
- **5–10 seconds** per alarm decision [18]
- **23 minutes** cognitive recovery after interruption [19]
- Nurses respond to **30% of alarms multiple times** [20]

---

## 5. Current System Failure Mode Analysis

### 5.1 Failure Modes by Category

| Failure Mode | Evidence | Impact | PRD Feature Addressing It |
|---|---|---|---|
| False alarms from sensor artifacts | 63.8% of alarms false in 2-day study | Desensitization, wasted time | Sensor Validation Module |
| No cross-device correlation | Ventilator, pump, monitor alarm independently | Duplicate alerts, cognitive overload | Alert Engine |
| No prioritization | All alarms sound equally urgent (2.5–3.15 kHz) | Can't identify critical patient | Risk Prediction + Priority Ranking |
| Static alarm location | Alarms go to central station, not mobile nurse | Delayed response | Dashboard + Mobile Workflow |
| No historical context | Each alarm is isolated; no trend view | Missing deterioration pattern | Trend Analysis Module |
| No escalation logic | No automatic escalation for ignored alarms | 80 deaths from delayed response | Escalation Rules |
| No nurse assignment tracking | Unclear who owns which alert | Duplicate responses, dropped alerts | Nurse Assignment Module |
| No explainability | Nurse sees "alarm" but not "why" | Slower clinical decisions | Explainability Module |

### 5.2 Root Cause: Incentive Misalignment

Medical device manufacturers face asymmetric incentives:

- **False positive cost**: Nurse wastes 5–10 seconds
- **False negative cost**: Patient death → lawsuit → millions in damages

Manufacturers rationally choose to over-alarm. This systemic incentive cannot be solved by hardware alone — it requires a **software layer that sits above devices** and applies intelligence.

---

## 6. Standards & Architecture Prerequisites

### 6.1 Required Healthcare Standards

| Standard | Version | Role | Mandate Status |
|---|---|---|---|
| **HL7 FHIR** | R4 (R5 emerging) | Patient data exchange, EHR integration | CMS mandate by Jan 2027 |
| **HL7 v2** | 2.5.1, 2.7 | Legacy hospital system messaging | Backbone of most hospital interfaces |
| **IEEE 11073 SDC** | 20702 | Real-time device connectivity (ICU/OR) | Emerging standard |
| **ISO/IEC 60601-1-8** | 2020 edition | Alarm system design and distribution | Regulatory requirement |
| **IHE PCD** | Various | Device-to-EHR integration profiles | Industry best practice |
| **LOINC / SNOMED CT** | Latest | Clinical terminology standards | Semantic interoperability |

### 6.2 Architecture Implications

1. **FHIR API layer** required for EHR read/write (Observation, Patient, Encounter resources)
2. **Device protocol abstraction** needed — GE, Philips, Mindray use different data formats
3. **Real-time streaming** via MQTT or WebSocket for vitals data
4. **On-premise deployment** options required — hospitals cannot send PHI to cloud
5. **HIPAA compliance** mandatory — BAA with every customer

### 6.3 Market Trend

The HL7 FHIR Accelerator "Caliper" launched March 2026 specifically for real-time medical device data interoperability [21]. CMS-0057-F mandates FHIR API support by January 2027. This creates a **regulatory tailwind** for FHIR-native platforms like CarePulse.

---

## 7. Evidence-Annotated PRD

### 7.1 Vision

> Build an intelligent platform that helps nurses answer four questions within 5 seconds:
> 1. Which patient needs attention first?
> 2. Why is this patient critical?
> 3. Where is the patient?
> 4. Is someone already handling this alert?

**Evidence**: Graham & Cvach (2010) found nurses spend 5–10 seconds per alarm decision [18]. The 4-question framework directly maps to the cognitive steps nurses currently perform without tool support.

### 7.2 Product Goals

| Goal | Evidence |
|---|---|
| Prioritize alerts | "Conditional prioritization" coping strategy (BMC Nursing, 2024) [16] |
| Reduce false alarms | 85–99% false alarm rate (AACN, 2018) [2] |
| Explain alert reasons | 5–10 sec decision time; explainability reduces cognitive load [18] |
| Improve nurse workflow | 35% of time spent on alarms (Springer, 2004) [17] |

### 7.3 User Pain Points (Validated)

| Pain Point | Source |
|---|---|
| Too many alarms | 81% of nurses agree [22] |
| Duplicate alerts | No cross-device correlation [13] |
| Difficult to identify most urgent patient | No ranking system [15] |
| Delayed response to critical events | 80 deaths from delayed response [7] |
| Nurse burnout | 60% burnout rate; alarm fatigue is key contributor [23] |

### 7.4 Workflow Validation

The PRD workflow matches the **current nurse alarm response workflow** documented in qualitative studies [8][16], with the addition of an **AI Risk Engine** between Alert Creation and Nurse Response. This insertion point is validated by:

1. The clinical decision support literature showing AI can reduce false alarms by 47% (CalmWave)
2. The gap between alarm creation and nurse response being the decision bottleneck

### 7.5 Escalation Rules (5/10/15 min)

**Evidence**: The Mass General case showed alarms ignored for 23 minutes [9]. Joint Commission data shows 80 deaths from delayed response [7]. Time-bound escalation rules are standard in ICU protocols worldwide.

### 7.6 AI Modules

Each module maps to a documented failure mode:

| Module | Failure Mode Addressed | Evidence |
|---|---|---|
| Sensor Validation | 63.8% false alarms from artifacts | South Korea study [24] |
| Trend Analysis | Isolated alarms without context | Bostan et al. 2024 [15] |
| Risk Prediction | 35% time on alarms; need prioritization | Lewandowska et al. 2020 [20] |
| Priority Ranking | No way to identify critical patient | "Conditional prioritization" strategy [16] |
| Explainability | 5–10 sec decision time per alarm | Graham & Cvach 2010 [18] |

### 7.7 Success Metrics

| Metric | Goal | Benchmark |
|---|---|---|
| False alerts reduced | >30% | CalmWave achieved 47% [25] |
| Average response time | Reduced by 20% | Baseline: varies by unit |
| Duplicate alerts removed | >80% | Current: no cross-device dedup |
| Alert acknowledgement time | <30 seconds | Graham & Cvach: 5–10 sec per alarm |
| Nurse satisfaction | Improved | Current: 81% report too many alarms |

---

## 8. References

1. Ruppel, H. et al. (2018). Non-actionable alarms in ICU settings. *Critical Care Medicine*.
2. AACN Practice Alert. (2018). Managing Alarms in Acute Care Across the Life Span.
3. Joint Commission. (2013). Sentinel Event Alert: Alarm Fatigue.
4. Cvach, M. (2012). Monitor alarm fatigue: an integrative review. *Biomedical Instrumentation & Technology*.
5. Graham, K. & Cvach, M. (2010). Monitor alarm fatigue: standardizing use of physiological monitors. *American Journal of Critical Care*.
6. Market Intelo. (2025). ICU Analytics AI Market Research Report 2033.
7. Joint Commission. (2013). Sentinel Event Alert Issue 50: Medical device alarm safety.
8. PMC11992819. (2025). Exploring ICU nurses' response to alarm management: a systematic review and meta-synthesis.
9. Boston Globe. (2010). Alarm fatigue linked to heart patient's death at Mass General.
10. FDA. (2011). Alarm-related adverse events reported to Manufacturer and User Facility Device Experience (MAUDE) database.
11. Ruskin, K. & Heuske-Kraus, D. (2015). Alarm fatigue: what is it and what can be done about it?
12. Bostan, I. et al. (2024). Customizing ICU patient monitoring: a user-centered approach. *Cognition, Technology & Work*.
13. AAMI. (2014). The Complexity of Clinical Alarm Systems. *Biomedical Instrumentation & Technology*.
14. Derbyshire, J. et al. (2019). Alarm frequency and cognitive distress.
15. Bostan, I. et al. (2024). Nurse profiles for personalized alarm systems. *Cognition, Technology & Work*.
16. BMC Nursing. (2024). Coping strategies of ICU nurses in alarm management: a qualitative research study.
17. Springer. (2004). Nurse time allocation for alarm management. *Cognition, Technology & Work*.
18. Graham, K. & Cvach, M. (2010). Monitor alarm fatigue. *American Journal of Critical Care*.
19. Healthcare Management. (2023). The hazards of monitoring: alarm fatigue in the ICU.
20. Lewandowska, K. et al. (2020). Impact of alarm fatigue on the work of nurses. *Int J Environ Res Public Health*.
21. HL7 International. (2026). Caliper FHIR Accelerator launch announcement.
22. Spok. (2024). State of Healthcare Communications Report.
23. CalmWave. (2022). How alarm fatigue is fueling nurse burnout.
24. Dove Press. (2024). Levels and factors of nurses' alarm fatigue in critical care settings. *JMDH*.
25. CalmWave/Wellstar. (2025). Case study: CalmWave at Wellstar Kennestone CCU.
