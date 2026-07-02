# Chapter 14 — Solution Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ ICU Dashboard│  │ Patient      │  │ Alert Timeline│  │
│  │ (Ranked View)│  │ Detail View  │  │ & History     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────┴──────────────────────────────────┐
│                    Backend (Node.js)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Auth     │ │ Alert    │ │ Patient  │ │ Dashboard │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                   AI Engine (Python)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Sensor      │  │ Trend        │  │ Risk Scoring  │  │
│  │ Validation  │  │ Analysis     │  │ & Ranking     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│  ┌─────────────┐                                      │
│  │ Explainability                                     │
│  │ (NLP output)                                       │
│  └─────────────┘                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                   Database (PostgreSQL)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Patients │ │  Vitals  │ │  Alerts  │ │ Risk Scores│  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

## System Components

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React, TypeScript | Dashboard UI, patient views, alert interaction |
| Backend API | Node.js, Express | Business logic, authentication, data access |
| AI Engine | Python, scikit-learn | Risk scoring, sensor validation, explanation generation |
| Database | PostgreSQL | Persistent storage for patients, vitals, alerts |
| Simulated Monitor | Python script | Generates realistic patient vitals + alert events |

## Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend | React + TypeScript | Industry standard, strong typing, large ecosystem |
| State Management | React Context / Zustand | Lightweight, sufficient for MVP |
| UI Components | Tailwind CSS + shadcn/ui | Rapid prototyping, accessible components |
| Backend | Node.js + Express | JavaScript across stack, fast iteration |
| AI/ML | Python + scikit-learn | Mature ML libraries, structured data focus |
| Database | PostgreSQL | Reliable, supports JSON, good for health data |
| API Style | REST (JSON) | Simple, widely understood |
| Auth | JWT | Stateless, simple for MVP |

---

[← Back to Document Index](../README.md)
