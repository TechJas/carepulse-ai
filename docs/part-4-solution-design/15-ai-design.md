# Chapter 15 — AI Design

## Problem Definition

**Task:** Given a patient's current vitals, recent vital trends, and sensor quality information, predict the probability of a critical event within the next 60 minutes.

**Output:** Risk score (0-100%), priority level (High/Medium/Low), and natural language explanation.

## Input Features

| Feature | Source | Type | Example |
|---|---|---|---|
| Heart Rate | Current monitor reading | Numeric | 112 bpm |
| SpO₂ | Current monitor reading | Numeric | 88% |
| Systolic BP | Current monitor reading | Numeric | 82 mmHg |
| Diastolic BP | Current monitor reading | Numeric | 54 mmHg |
| Respiratory Rate | Current monitor reading | Numeric | 28 /min |
| Temperature | Current monitor reading | Numeric | 38.9°C |
| HR trend (30 min) | Historical vitals | Vector | [+5, +8, +12, ...] |
| SpO₂ trend (30 min) | Historical vitals | Vector | [-1, -2, -3, ...] |
| BP trend (30 min) | Historical vitals | Vector | [-5, -8, -10, ...] |
| Sensor quality | Device diagnostics | Categorical | Good / Noisy / Lost |
| Age | Patient record | Numeric | 72 |
| Prior alerts (24h) | Alert history | Numeric | 14 |

## Alert Validation

**Goal:** Distinguish real physiological alerts from artifacts.

**Approach:** Rule-based + ML hybrid.

- **Immediate filter:** If sensor quality is "Lost" or "Noisy" → flag as artifact
- **ML classifier:** If sensor quality is ambiguous, a lightweight classifier (Random Forest) predicts: Real Alert vs. Artifact
- **Training data:** Public ICU datasets with labeled artifact events

**Expected impact:** Reduce false alerts by 30-50%.

## Priority Ranking

**Approach:** Risk score → priority mapping.

| Risk Score | Priority | Action Expected |
|---|---|---|
| 80-100% | High | Immediate attention required |
| 40-79% | Medium | Acknowledge, assess within 5 min |
| 0-39% | Low | Monitor, no immediate action |
| N/A (artifact) | Information | Sensor issue, no clinical action |

Risk score is computed using an ensemble model (XGBoost + Logistic Regression) trained on labeled ICU deterioration events.

## Explainability

**Goal:** Answer "why is this patient critical?" in plain language.

**Approach:** Feature importance extraction from the model, mapped to natural language templates.

**Example:**
```
Risk Score: 97%
Reason: Rapid oxygen decrease (SpO₂ 88% and dropping).
  Blood pressure falling (82/54, down 15% in 30 min).
  Heart rate increasing (112 bpm, up 20% in 30 min).
Confidence: 95%
```

Templates:
- `{vital} is {direction}` → "Heart rate increasing"
- `{vital} at {value}, {trend} over {window}` → "SpO₂ at 88%, dropping 3% in 30 min"
- Combination: Top 3 contributing features are selected and rendered

## Future AI

| Feature | Description | Timeline |
|---|---|---|
| Predictive deterioration | Predict alerts 30 min before threshold breach | V2 |
| Workload balancing | Recommend alert distribution across nurses | V3 |
| Anomaly detection | Unsupervised learning for novel deterioration patterns | V3 |
| Multi-ICU model | Transfer learning across ICU types | V4 |

---

[← Back to Document Index](../README.md)
