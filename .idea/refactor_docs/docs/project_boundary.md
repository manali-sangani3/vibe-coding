# PROJECT BOUNDARIES
# Enterprise Employee Travel & Expense Management System

**Version:** 1.0
**Date:** 2026-06-10
**Author:** Senior Product Manager
**Reference Docs:** [prd.md](./prd.md) · [kpi.md](./kpi.md) · [scope.md](./scope.md)

---

## 1. Code & Execution Constraints

* **No Auto-Commit:** DO NOT commit, push, or modify repository code directly. All code changes require explicit user confirmation before any git operation.
* **No Unauthorized Commands:** DO NOT execute any terminal commands, scripts, DB migrations, or seed scripts without explicit user confirmation first.
* **No Auto-Migration:** Prisma migrations (`prisma migrate dev`, `prisma db push`) MUST NOT run automatically. Every schema change requires a review gate before migration is applied.
* **No Direct DB Mutations:** DO NOT run raw SQL or Prisma queries against the production or staging database without explicit approval. All data mutations go through the API layer.
* **No Auto-Deployment:** DO NOT trigger Docker builds, GitHub Actions workflows, or any AWS deployments (S3 sync, SES config, EC2 restarts) without explicit user confirmation.
* **No Secrets in Code:** API keys, JWT secrets, AWS credentials, and database URIs MUST NOT be hardcoded in any source file. All secrets are managed via environment variables (`.env`) which are never committed.

---

## 2. Guardrails & Token Optimization

* **No Guessing / Assumptions:** DO NOT write code based on incomplete information. If a DB schema field, API payload shape, role permission, approval hierarchy config, or policy rule is ambiguous — STOP and ask.
* **Clarification First:** If any of the following are ambiguous, raise a blocking question before proceeding:
  * Approval chain configuration (Manager → Dept Head → Finance — are all three levels mandatory or configurable per department?)
  * Policy rule precedence (when grade-level and city-level policies conflict, which takes priority?)
  * Advance settlement vs. partial settlement rules (is partial settlement allowed before a new advance request?)
  * Notification channel priority (push vs. email vs. in-app — what is the fallback chain if push fails?)
  * Data retention period (7 years — hot storage, cold storage, or archival strategy to be confirmed with legal)
  * Multi-tenant readiness (single-tenant V1 — confirm before any schema decision that could lock out multi-tenancy)
* **No Redundant Iterations:** Do not implement speculative features. Only build what is explicitly listed in the PRD Scope. Reference `prd.md §2 Out of Scope` before starting any new feature.
* **Scope Lock — V1 Hard Limits:** The following are explicitly OUT of scope for V1 and MUST NOT be implemented regardless of technical feasibility:
  * Third-party travel portal booking integration (MakeMyTrip, Yatra, Concur, Cleartrip)
  * Live forex / multi-currency auto-conversion via external exchange rate APIs
  * Payroll system deep integration for automatic disbursement
  * HRMS / ERP API sync (CSV import only)
  * Receipt OCR / auto-extraction of expense data
  * AI / ML-based fraud detection
  * Web browser application (Flutter mobile only)
  * WhatsApp / SMS notification channel
  * Multi-company / subsidiary hierarchy
  * Automated regulatory filing or tax report generation

---

## 3. Code Quality Standards

* **Modular:** Every NestJS service, controller, and module MUST follow single-responsibility. One module per domain: `auth`, `users`, `travel-requests`, `expense-claims`, `advances`, `approvals`, `policies`, `reimbursements`, `notifications`, `audit`, `reports`, `admin`. Cross-domain logic goes through service interfaces, not direct imports.
* **Maintainable:** Prioritize clean, self-documenting code. Function names, variable names, and DTO field names must reflect domain language exactly as defined in `prd.md` (e.g., `PENDING_MANAGER_APPROVAL`, `CLAIM_PENDING_APPROVAL`, `POLICY_VIOLATION`, `PROCESSED`).
* **Predictable Data Flows:** Every API response MUST conform to the envelope: `{ "status": "success" | "error", "data": {} }`. No ad-hoc response shapes.
* **No Magic Numbers:** All configurable thresholds (SLA windows, file size limits, advance block rules, submission deadline windows, rate limits, token TTL) MUST be defined in a centralized config/constants file — never hardcoded inline.
* **Status Machine Integrity:** Travel request and expense claim status transitions MUST be enforced server-side. No client-driven status overrides. Valid state transitions (derived from `prd.md §3`):
  * Travel Request: `DRAFT` → `PENDING_MANAGER_APPROVAL` → `PENDING_FINANCE_APPROVAL` → `APPROVED` | `REJECTED`
  * Expense Claim: `DRAFT` → `CLAIM_PENDING_APPROVAL` → `CLAIM_APPROVED` → `PROCESSED` | `REJECTED`
  * Advance: `PENDING_FINANCE_APPROVAL` → `APPROVED` | `REJECTED` → `SETTLED`

---

## 4. Security & Compliance Constraints

* **JWT Enforcement (KPI-82):** Every protected endpoint MUST validate the JWT access token via the Passport.js guard. Unauthenticated requests return `401 Unauthorized`. No endpoint bypasses auth middleware without explicit documentation.
* **RBAC Enforcement (KPI-83):** Every endpoint MUST declare the minimum required role via a `@Roles()` guard decorator. Role-restricted access returns `403 Forbidden`. The six roles — `EMPLOYEE`, `MANAGER`, `FINANCE`, `AUDITOR`, `HR_ADMIN`, `SUPER_ADMIN` — MUST be consistently referenced by enum, not string literals.
* **Rate Limiting (KPI-84):** Redis-backed rate limiting MUST be applied at the API gateway level. Exceeded limits return `429 Too Many Requests`. Limits are configurable per endpoint category (auth, submission, admin).
* **Encryption at Rest (KPI-85):** All PII and financial fields (employee ID, amounts, bank details, receipt URLs) MUST be encrypted at rest (AES-256). Encryption is handled at the data layer, not the application layer.
* **S3 Access Control (KPI-87):** Receipt files MUST only be accessible via time-limited S3 pre-signed URLs (TTL ≤ 15 minutes). No public bucket policies. No public ACLs on any object.
* **Audit Trail is Immutable (KPI-70):** The `audit_logs` table MUST be append-only. No `UPDATE` or `DELETE` operations are permitted on audit records via any API, service, or migration. Any attempt returns `403 Forbidden`.
* **DPDP / GDPR (KPI-88):** No PII data to be logged in plaintext in application logs, error messages, or API responses beyond what is strictly required per the defined data schema.

---

## 5. API & Integration Constraints

* **API Versioning:** All endpoints MUST be namespaced under `/api/v1/`. No version-less routes. New breaking changes in V2 get `/api/v2/` namespace; V1 remains intact.
* **Idempotency (KPI-14):** Travel request submission endpoints MUST support idempotency keys. Duplicate requests within 60 seconds return `409 Conflict` with the existing record ID — not a new record.
* **Optimistic Locking (KPI-26, KPI-62):** All approval and reimbursement processing endpoints MUST implement optimistic locking via a `version` field. Concurrent updates return `409 Conflict`.
* **Async Jobs via BullMQ (KPI-95):** Notifications, report exports (CSV/PDF), SLA escalation timers, and audit log writes for bulk operations MUST be handled via BullMQ queues — not synchronous handlers. Job failures retry up to 3 times; unresolved jobs go to dead-letter queue.
* **No External API Calls in V1:** The system MUST NOT make outbound HTTP calls to third-party travel, booking, forex, payroll, or HRMS APIs in V1. AWS SES (email) and AWS S3 (file storage) are the only permitted external integrations.
* **Consistent Error Codes:** All validation errors return `422 Unprocessable Entity`. All auth failures return `401`. All access denials return `403`. All conflicts return `409`. All not-found errors return `404`. No custom HTTP status codes beyond standard RFC 7231.

---

## 6. Performance & Scalability Constraints

* **P95 Latency Target (KPI-91):** All core CRUD API endpoints MUST return P95 response time < 500ms under 500 concurrent users. Any endpoint consistently breaching this threshold in load tests MUST be optimized before sprint sign-off.
* **DB Query Cap (KPI-93):** No single Prisma query may exceed P95 = 100ms. Queries on large tables (`audit_logs`, `expense_claims`, `travel_requests`) MUST use indexed filters. N+1 query patterns are prohibited.
* **Redis Caching (KPI-94):** Policy rules, role-permission maps, and user-grade mappings MUST be cached in Redis. Cache TTL and invalidation strategy MUST be defined per entity before implementation.
* **Pagination Required:** All list endpoints (`GET /travel-requests`, `GET /expense-claims`, `GET /notifications`, `GET /audit-trail`) MUST return paginated responses with `page`, `limit`, `total` fields. Unpaginated list responses are not permitted.
* **Async Report Export (KPI-73):** CSV and PDF report generation MUST be handled as async BullMQ jobs. The API returns a job ID immediately; the client polls or receives a push notification on completion. Synchronous generation of reports > 1,000 records is prohibited.
* **Uptime Target (KPI-90):** The system MUST maintain ≥ 99.5% availability during business hours (6 AM – 11 PM IST). Scheduled maintenance MUST be communicated ≥ 24 hours in advance and performed outside business hours.

---

## 7. Data & Audit Constraints

* **Audit Log on Every State Change:** Every status transition on `TravelRequest`, `ExpenseClaim`, `Advance`, `Policy`, `User`, and `ApprovalAction` entities MUST produce an immutable audit log entry. Entries MUST capture: `entityType`, `entityId`, `actorId`, `action`, `ipAddress`, `timestamp`, `stateBefore`, `stateAfter`.
* **Data Retention (KPI-76):** All records (requests, claims, advances, audit logs, receipts) MUST be retained for a minimum of 7 years. Archival strategy (hot → warm → cold storage tiering) MUST be defined before go-live.
* **Receipt Lifecycle:** Receipt files deleted from S3 MUST leave a `receiptDeletedAt` tombstone on the corresponding expense line item. Hard deletes without tombstones are not permitted.
* **Advance Ledger Integrity (KPI-55):** The advance ledger MUST be reconciled on every settlement operation. Any balance discrepancy detected MUST raise an alert to Finance and log a `LEDGER_DISCREPANCY` audit event.
* **No Orphan Records:** Every `ExpenseClaim` MUST be linked to a valid `TravelRequest`. Every `Advance` MUST be linked to a valid `TravelRequest`. Orphan record creation MUST be blocked at the service layer with a `422` error.

---

## 8. Module-Level Boundary Map

| Module | Permitted Roles | Write Boundary | KPI Reference |
|---|---|---|---|
| Auth & User Management | `SUPER_ADMIN`, `HR_ADMIN` | Create/deactivate users, assign roles | KPI-01 to KPI-10 |
| Travel Request | `EMPLOYEE` | Create, edit own requests (DRAFT state only) | KPI-11 to KPI-20 |
| Approval Workflow | `MANAGER`, `DEPT_HEAD`, `FINANCE` | Approve/reject; no direct status overrides | KPI-21 to KPI-30 |
| Expense Claim | `EMPLOYEE` | Submit claims against own approved requests only | KPI-31 to KPI-40 |
| Policy Compliance Engine | `SUPER_ADMIN`, `HR_ADMIN`, `FINANCE` | Configure rules; no rule backdating | KPI-41 to KPI-50 |
| Advance Management | `EMPLOYEE` (request), `FINANCE` (approve/settle) | Raise/settle advance; one active advance per employee | KPI-51 to KPI-56 |
| Reimbursement Processing | `FINANCE` | Process, adjust, mark PROCESSED | KPI-57 to KPI-62 |
| Notification Engine | System (internal only) | No external write access; read-only for users | KPI-63 to KPI-68 |
| Audit Trail | `AUDITOR`, `SUPER_ADMIN` | Read-only; no write or delete | KPI-69 to KPI-76 |
| Admin & Config Panel | `SUPER_ADMIN`, `HR_ADMIN` | Full CRUD on policies, hierarchy, cost centers | KPI-77 to KPI-81 |
| Security Layer | System-enforced | No role bypasses any security middleware | KPI-82 to KPI-89 |
| Performance / Infra | DevOps / `SUPER_ADMIN` | Config via env vars; no runtime infra changes via API | KPI-90 to KPI-96 |
| Adoption & Reporting | `AUDITOR`, `FINANCE`, `SUPER_ADMIN` | Read-only exports; no data manipulation | KPI-97 to KPI-101 |
