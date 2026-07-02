# UI/UX Design Specification — Phase 2

## Screen Map

```
Login ──→ ICU Dashboard ──→ Patient Detail
               │                  │
               │                  └── Alert Timeline
               │                  └── Vitals History
               │
               └── Filter/Search
               └── Escalation View (charge nurse)
```

## Screens

### 1. Login Screen

Simple, clean authentication:

```
┌────────────────────────────────┐
│         CarePulse AI           │
│    Clinical Alert Triage       │
│                                │
│    ┌──────────────────────┐    │
│    │ Email                │    │
│    └──────────────────────┘    │
│    ┌──────────────────────┐    │
│    │ Password             │    │
│    └──────────────────────┘    │
│                                │
│    [Sign In]                   │
│                                │
│    © 2026 CarePulse AI         │
└────────────────────────────────┘
```

### 2. ICU Dashboard (Main Screen)

Header bar → Summary counts → Top critical patients → Full patient table

Detailed layout in [Chapter 16](../part-4-solution-design/16-dashboard-design.md).

### 3. Patient Detail (Slide-over Panel)

Opens from the right side when a patient card is clicked:

```
┌─────────────────────────────────────────────────┐
│ Patient 103                          [Close] X  │
│ Bed: ICU-07 | Risk: 98% (High)                  │
├─────────────────────────────────────────────────┤
│ ┌─ Current Vitals ────────────────────────────┐ │
│ │ HR  112 ▲  | SpO₂ 88% ▼ | BP 82/54 ▼      │ │
│ │ RR  28 ▲  | Temp 38.9°C ▲                   │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─ Trends (60 min) ───────────────────────────┐ │
│ │ [Sparkline: HR] [Sparkline: SpO₂]           │ │
│ │ [Sparkline: BP]  [Sparkline: RR]            │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─ AI Explanation ────────────────────────────┐ │
│ │ Risk: 97% — HIGH priority                   │ │
│ │ Rapid oxygen decrease (SpO₂ 88%, dropping)  │ │
│ │ BP falling (82/54, down 15% in 30 min)     │ │
│ │ HR increasing (112 bpm)                     │ │
│ │ Confidence: 95%                             │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─ Actions ───────────────────────────────────┐ │
│ │ [Accept] [Resolve] [Escalate]              │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─ Alert Timeline ────────────────────────────┐ │
│ │ 14:23  SpO₂ low (88%)      Waiting   Accept │ │
│ │ 14:20  BP low (82/54)     In Progress Priya │ │
│ │ 14:15  HR high (112)      Resolved   Priya  │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Component Tree

```
App
├── LoginScreen
│   ├── Logo
│   ├── LoginForm (email, password, submit)
│   └── Footer
├── DashboardLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── UnitSelector
│   │   ├── NotificationBell
│   │   ├── DarkModeToggle
│   │   └── UserMenu
│   ├── SummaryBar
│   │   ├── StatCard (Total Patients)
│   │   ├── StatCard (High Priority) — red
│   │   ├── StatCard (Medium Priority) — amber
│   │   └── StatCard (Low Priority) — green
│   ├── TopCriticalSection
│   │   └── PatientCard[] (top 4 by risk)
│   │       ├── RiskBadge
│   │       ├── PatientInfo (ID, bed)
│   │       ├── AlertReason
│   │       ├── StatusBadge
│   │       ├── NurseAssignment
│   │       └── ActionButton
│   ├── PatientTable
│   │   ├── TableHeader
│   │   └── PatientRow[]
│   ├── FilterBar
│   │   ├── PriorityFilter
│   │   ├── StatusFilter
│   │   └── SearchInput
│   └── PatientDetailPanel (slide-over)
│       ├── PatientHeader
│       ├── VitalsDisplay
│       ├── TrendsSection (sparklines)
│       ├── AiExplanation
│       ├── ActionButtons
│       └── AlertTimeline
│           └── TimelineEvent[]
└── Shared/Common
    ├── Badge (risk color-coded)
    ├── Button (primary, secondary, ghost)
    ├── Card
    ├── Sparkline (mini chart)
    ├── Spinner
    └── Modal
```

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg-surface` | #FFFFFF | #0F172A | Card backgrounds |
| `bg-page` | #F8FAFC | #020617 | Page background |
| `text-primary` | #0F172A | #F1F5F9 | Primary text |
| `text-secondary` | #64748B | #94A3B8 | Secondary text |
| `risk-high` | #DC2626 | #EF4444 | High priority (red) |
| `risk-medium` | #D97706 | #F59E0B | Medium priority (amber) |
| `risk-low` | #16A34A | #22C55E | Low priority (green) |
| `risk-info` | #6B7280 | #9CA3AF | Sensor issue (gray) |
| `accent` | #2563EB | #3B82F6 | Primary actions |
| `border` | #E2E8F0 | #334155 | Borders/dividers |

### Typography

| Element | Size | Weight | Family |
|---|---|---|---|
| Page title | 24px | 700 | Inter |
| Card heading | 16px | 600 | Inter |
| Body text | 14px | 400 | Inter |
| Risk score | 32px | 800 | Inter |
| Small/label | 12px | 500 | Inter |

### Spacing Scale

4px base unit: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Shadows

Light: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
Dark: `0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)`

## Interaction Patterns

| Pattern | Behavior |
|---|---|
| Patient card click | Opens slide-over detail panel from right |
| Accept button | Changes status to "In Progress", assigns nurse |
| Resolve button | Changes status to "Resolved", logs resolution time |
| Escalate | Triggers escalation workflow, notifies charge nurse |
| Timeout escalation | Auto-triggered after 5 min, card turns darker |
| Dark mode toggle | Switches all color tokens, persisted in localStorage |
| Search | Filters patient table by ID/bed in real-time |
| Filter pill click | Toggles priority/status filter, updates table |

## States

### Patient Card States

| State | Visual |
|---|---|
| Waiting | Normal card, "Waiting" badge |
| In Progress | Card slightly dimmed, nurse name shown |
| Resolved | Card grayed out, "Resolved" badge |
| Escalated | Red border, pulse animation, "Escalating" badge |

### Empty States

- No high-priority patients: "All patients stable. No critical alerts."
- No search results: "No patients match your search."
- No alert history: "No alerts recorded for this patient."

### Loading States

- Dashboard loading: Skeleton cards with pulse animation
- Patient detail loading: Skeleton panel
- AI score computing: "Analyzing..." badge on card

### Error States

- API error: "Unable to load patient data. Retry?"
- Auth error: Redirect to login with message
- Network offline: "Connection lost. Showing cached data."

## Accessibility

- All interactive elements keyboard-navigable (Tab/Shift+Tab)
- ARIA labels on risk badges, action buttons, patient cards
- Color not sole differentiator (risk scores also show % text)
- Focus indicators visible on all interactive elements
- Screen reader announces new critical alerts
- Minimum contrast ratio 4.5:1 for all text
