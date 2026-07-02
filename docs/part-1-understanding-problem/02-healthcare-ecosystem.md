# Chapter 2 — Healthcare Ecosystem

## 2.1 Hospital Departments

A hospital is organized into departments that specialize in different aspects of patient care. Key departments relevant to this project include:

| Department | Function |
|---|---|
| Emergency Department (ED) | First point of entry for acute cases |
| Intensive Care Unit (ICU) | Critical care for unstable patients |
| General Ward | Stable patients under observation |
| Operating Room (OR) | Surgical procedures |
| Radiology | Diagnostic imaging |
| Laboratory | Blood work, pathology |
| Pharmacy | Medication management |

Patients typically flow from ED → ICU (if critical) → Ward (when stable). Alert fatigue is most acute in the ICU, but the problem exists across all departments with monitoring.

## 2.2 ICU Overview

The Intensive Care Unit is a specialized department for patients with life-threatening conditions requiring continuous monitoring and intervention. ICUs have the highest nurse-to-patient ratios (typically 1:1 or 1:2), the most monitoring equipment per bed, and the highest alarm density in the hospital.

## 2.3 ICU Types

| ICU Type | Patient Population |
|---|---|
| Medical ICU (MICU) | Non-surgical critical illness (e.g., sepsis, respiratory failure) |
| Surgical ICU (SICU) | Post-operative critical care |
| Cardiac ICU (CICU/CCU) | Heart attacks, arrhythmias, post-cardiac surgery |
| Neuro ICU (NICU) | Stroke, traumatic brain injury, spinal cord injury |
| Neonatal ICU (NICU) | Premature or critically ill newborns |
| Pediatric ICU (PICU) | Critically ill children |

Each type has different monitoring requirements and alarm patterns, but the alert fatigue problem is universal.

## 2.4 ICU Team Structure

| Role | Responsibility |
|---|---|
| **Intensivist** | Lead physician; directs patient care plan |
| **ICU Nurse** | Continuous bedside monitoring, alert response, medication administration |
| **Resident Doctor** | Day-to-day patient management under intensivist guidance |
| **Respiratory Therapist** | Ventilator management, airway support, oxygen therapy |
| **Biomedical Engineer** | Maintains and calibrates monitoring equipment |
| **Pharmacist** | Medication review, dosing adjustments |

The ICU nurse is the primary consumer of alarm data and the primary user of CarePulse AI.

## 2.5 ICU Responsibilities

- Continuous patient monitoring and assessment
- Timely response to alarms and clinical changes
- Medication administration and IV management
- Ventilator management (with respiratory therapy)
- Communication with physicians and家属 (family)
- Documentation in EHR
- Infection control
- End-of-life care when applicable

## 2.6 ICU Technology Stack

| Technology | Purpose |
|---|---|
| Patient monitors | Real-time vitals display |
| Ventilators | Respiratory support |
| Infusion pumps | Controlled medication delivery |
| Central monitoring station | Aggregated view of all patients |
| EHR (Electronic Health Record) | Patient documentation |
| Clinical decision support (CDS) | Alert-based guidance |
| Barcode medication administration (BCMA) | Medication safety |

## 2.7 Existing Monitoring Infrastructure

Most ICUs use monitor systems from Philips (IntelliVue), GE (Carescape), or Mindray. These systems connect bedside monitors to a central station and generate alarms based on threshold violations. Data may or may not flow into the EHR depending on hospital integration level.

## 2.8 Key Challenges

1. **Siloed systems** — Monitors, ventilators, pumps, and EHRs often don't communicate
2. **One-size-fits-all alarms** — Same threshold for all patients regardless of baseline
3. **No intelligence** — Raw values only; no trend analysis or context
4. **Alert overload** — No filtering, deduplication, or prioritization

---

[← Back to Document Index](../README.md)
