# Chapter 19 — Security

## Authentication

All API requests require JWT (JSON Web Token) authentication.

- Token issued on login, expires in 8 hours (matching a nursing shift)
- Token contains: user ID, role, department
- All requests validate token on every call
- Passwords hashed with bcrypt (cost factor 12)

## Authorization

Role-based access control (RBAC):

| Role | Permissions |
|---|---|
| Nurse | View patients, acknowledge/resolve assigned alerts |
| Charge Nurse | All nurse permissions + view all alerts, escalate, reassign |
| Admin | All permissions + manage users, view audit logs |

## Audit Logs

Every state-changing action is logged:

| Event | Data Logged |
|---|---|
| Alert acknowledged | Who, when, which alert |
| Alert resolved | Who, when, resolution notes |
| Alert escalated | Who triggered, reason, escalation target |
| Login/logout | User, timestamp, IP |
| Patient data access | Who accessed which patient, when |

Logs are immutable (append-only) and stored in a separate audit table.

## Encryption

| Data State | Encryption |
|---|---|
| In transit | TLS 1.3 (HTTPS) |
| At rest (database) | AES-256 |
| Passwords | bcrypt (hash only) |
| JWT tokens | HS256 signed |

## Role-Based Access Control Summary

```
┌─────────────────────────────────────────────────────┐
│                    API Gateway                       │
│                    (JWT Validation)                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐    ┌──────────┐    ┌────────────────┐  │
│  │ Nurse   │    │ Charge   │    │ Admin          │  │
│  │         │    │ Nurse    │    │                │  │
│  │ Own     │    │ All      │    │ All            │  │
│  │ patients│    │ patients │    │ Manage users   │  │
│  │ Own     │    │ All      │    │ Full audit     │  │
│  │ alerts  │    │ alerts   │    │ Configuration  │  │
│  └─────────┘    └──────────┘    └────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**MVP note:** For the MVP (no live patient data), security is simplified. JWT-based auth with role guards is sufficient. Full HIPAA compliance, audit trails, and encryption at rest would be required for production deployment.

---

[← Back to Document Index](../README.md)
