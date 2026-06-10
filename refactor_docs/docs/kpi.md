# KPI DOCUMENT

**Project:** Enterprise Employee Travel & Expense Management System
**Version:** 1.0
**Date:** 2026-06-09
**Author:** Senior Product Manager
**Status:** Draft

---

## MODULE 1 — Authentication & User Management

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-01 | Login Success Rate | Percentage of login attempts that succeed with valid credentials | ≥ 99.5% successful login rate |
| KPI-02 | Login Failure Lockout Enforcement | System locks account after defined consecutive failed login attempts | Account locked after 5 consecutive failures; lockout logged in audit trail |
| KPI-03 | Token Refresh Success Rate | Percentage of silent JWT token refresh attempts that succeed | ≥ 99% silent refresh success rate |
| KPI-04 | Session Timeout Handling | System saves user draft and redirects to login on session expiry | 100% of expired sessions redirect with draft preserved |
| KPI-05 | Role Assignment Accuracy | Users are assigned correct roles (Employee, Manager, Finance, Auditor, Admin) at account creation | 0% role misconfiguration at onboarding; verified by RBAC tests |
| KPI-06 | Password Reset SLA | Time from reset request to email delivery | ≤ 60 seconds email delivery |
| KPI-07 | Admin User Deactivation Propagation | Deactivating a user account removes all active sessions and blocks API access | 100% session invalidation within 5 seconds of deactivation |
| KPI-08 | Bulk User Import Success Rate | Percentage of employee records successfully imported via CSV | ≥ 98% import success rate with error report for failures |
| KPI-09 | RBAC Enforcement Rate | Unauthorized role-based access attempts blocked | 100% unauthorized access attempts return `403 Forbidden` |
| KPI-10 | Audit Log — Auth Events | All login, logout, failed login, and token refresh events logged | 100% of auth events captured with actor ID, IP, and timestamp |

---

## MODULE 2 — Travel Request Management

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-11 | Travel Request Submission Success Rate | Percentage of valid requests submitted without system error | ≥ 99% successful submission rate |
| KPI-12 | Mandatory Field Validation Rate | System enforces all mandatory fields before allowing submission | 100% of incomplete submissions blocked with field-level error messages |
| KPI-13 | Policy Limit Real-Time Warning Rate | System displays real-time warning when estimated amount exceeds policy cap | 100% of limit-breaching requests display inline warning before submission |
| KPI-14 | Duplicate Request Detection Rate | System detects and blocks duplicate submissions within 60-second window | 100% of duplicates detected via idempotency key; `409 Conflict` returned |
| KPI-15 | Request Status Transition Accuracy | Status transitions (DRAFT → PENDING → APPROVED/REJECTED) occur correctly | 100% correct status transitions verified across all request lifecycle states |
| KPI-16 | Retrospective Request Handling | Past-dated travel requests require mandatory justification | 100% of past-dated submissions enforce justification field |
| KPI-17 | Notification Delivery — Request Created | Employee and Manager receive notification within 30 seconds of submission | ≥ 98% notification delivery within 30-second SLA |
| KPI-18 | Attachment Upload Success Rate | Receipts/documents attached to travel requests upload successfully | ≥ 98% upload success rate; failed uploads prompt retry |
| KPI-19 | Request Retrieval Latency | Time to fetch paginated travel request list for authenticated user | P95 ≤ 300ms under 500 concurrent users |
| KPI-20 | Audit Log — Request Events | All create, update, submit, approve, reject actions on requests logged | 100% of request state changes captured with actor, timestamp, IP |

---

## MODULE 3 — Multi-Level Approval Workflow

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-21 | Approval Routing Accuracy | Requests routed to correct approver per configured hierarchy | 100% correct first-level approver assignment |
| KPI-22 | SLA Compliance Rate — Manager Approval | Percentage of manager approvals completed within SLA window | ≥ 90% approved/rejected within 48-hour SLA |
| KPI-23 | SLA Compliance Rate — Finance Approval | Percentage of Finance approvals completed within SLA window | ≥ 90% approved/rejected within 72-hour SLA |
| KPI-24 | Auto-Escalation Trigger Accuracy | System auto-escalates to next level exactly at SLA expiry | 100% of SLA breaches trigger escalation; escalation logged |
| KPI-25 | Escalation Notification Delivery | Skip-level approver and original approver notified on escalation | ≥ 98% notification delivery within 60 seconds of escalation |
| KPI-26 | Concurrent Approval Conflict Prevention | System prevents two approvers from processing the same request simultaneously | 100% of concurrent attempts return `409 Conflict`; only first action persists |
| KPI-27 | Rejection Reason Enforcement | Manager rejection requires mandatory reason comment | 100% of rejection actions blocked without reason |
| KPI-28 | Deactivated Manager Reassignment Rate | Pending requests reassigned to skip-level when manager is deactivated | 100% of affected requests reassigned within 5 minutes of deactivation |
| KPI-29 | Approval Audit Completeness | Every approval/rejection logged with actor, action, comments, timestamp | 100% of approval actions captured in immutable audit trail |
| KPI-30 | Approver Queue Load Time | Time to load approver's pending approval queue | P95 ≤ 400ms for queues up to 500 items |

---

## MODULE 4 — Expense Claim Submission

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-31 | Expense Claim Submission Success Rate | Percentage of valid claims submitted without system error | ≥ 99% successful submission rate |
| KPI-32 | Line Item Validation Rate | All mandatory line item fields validated before claim submission | 100% of incomplete line items blocked with field-level errors |
| KPI-33 | Policy Compliance Flag Rate | System flags policy-violating line items in real-time | 100% of policy-breaching items tagged `POLICY_VIOLATION` before submission |
| KPI-34 | Receipt Upload Success Rate | Receipts uploaded successfully on first attempt | ≥ 98% first-attempt success; retry prompt on failure |
| KPI-35 | Unsupported File Format Rejection Rate | System rejects non-JPG/PNG/PDF uploads | 100% of unsupported formats rejected with `422` error |
| KPI-36 | File Size Limit Enforcement | System rejects files exceeding 10MB | 100% of oversized files blocked with clear error message |
| KPI-37 | Submission Window Enforcement | Claims submitted after 30-day window are blocked | 100% of late submissions blocked with clear error message |
| KPI-38 | Per-Diem Auto-Calculation Accuracy | System auto-calculates per-diem entitlement based on grade and destination | 100% of per-diem calculations match policy configuration; verified by test cases |
| KPI-39 | Claim-to-Request Linkage Accuracy | Every expense claim correctly linked to originating travel request | 100% correct linkage; orphan claims blocked |
| KPI-40 | Audit Log — Claim Events | All claim create, update, submit, approve, reject, adjust actions logged | 100% of claim events captured with actor, timestamp, IP |

---

## MODULE 5 — Policy Compliance Engine

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-41 | Policy Configuration Completeness | All active travel grades and city combinations have at least one policy rule | 0% unconfigured active policy combinations at go-live |
| KPI-42 | Real-Time Policy Validation Latency | Time to validate an expense line item against policy on submission | P95 ≤ 200ms validation response |
| KPI-43 | Per-Diem Limit Enforcement Rate | Per-diem claims exceeding grade/city limit are flagged | 100% of limit-breaching per-diem items flagged |
| KPI-44 | Hotel Cap Enforcement Rate | Hotel expenses exceeding grade-specific cap are flagged | 100% of cap-exceeding hotel items flagged |
| KPI-45 | Flight Class Enforcement Rate | Flight bookings above allowed class are flagged | 100% of class violations flagged |
| KPI-46 | Finance Override Audit Rate | All Finance overrides on policy-flagged items include mandatory justification | 100% of override actions blocked without justification comment |
| KPI-47 | Policy Update Propagation Latency | Time for updated policy rules to apply to new submissions | ≤ 60 seconds for updated policy to take effect on new submissions |
| KPI-48 | Policy Audit Log Completeness | All policy CRUD operations and enforcement events logged | 100% of policy changes captured with admin actor, timestamp |
| KPI-49 | False Positive Flag Rate | Percentage of policy flags raised incorrectly on compliant items | ≤ 0.5% false positive rate |
| KPI-50 | Policy Coverage Rate | Percentage of all expense categories covered by at least one active policy rule | ≥ 95% category coverage at go-live |

---

## MODULE 6 — Advance Management

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-51 | Advance Request Submission Success Rate | Valid advance requests created without system error | ≥ 99% successful submission rate |
| KPI-52 | Unsettled Advance Block Enforcement | System blocks new advance when outstanding advance exists | 100% of new advance attempts with unsettled balance return validation error |
| KPI-53 | Advance Approval SLA Compliance | Finance approves/rejects advance within SLA window | ≥ 90% processed within 48-hour SLA |
| KPI-54 | Advance Settlement Accuracy | Settled amount correctly deducted from outstanding advance balance | 100% balance calculation accuracy verified by test cases |
| KPI-55 | Advance Ledger Integrity | Employee advance ledger reflects all disbursements, settlements, and adjustments | 100% ledger consistency validated on all transactions |
| KPI-56 | Advance Audit Completeness | All advance create, approve, reject, disburse, settle actions logged | 100% of advance events captured with actor, timestamp, IP |

---

## MODULE 7 — Reimbursement Processing

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-57 | Reimbursement Cycle Time | End-to-end time from claim approval to payment confirmation | ≤ 7 business days |
| KPI-58 | Finance Processing Time | Time taken by Finance to process an approved claim | Average ≤ 3 business days |
| KPI-59 | Payment Confirmation Notification Delivery | Employee notified of payment within 30 seconds of Finance marking `PROCESSED` | ≥ 98% notification delivery within 30-second SLA |
| KPI-60 | Reimbursement Ledger Accuracy | Employee ledger updated accurately on every payment action | 100% ledger accuracy verified by reconciliation tests |
| KPI-61 | Adjustment Audit Completeness | All Finance amount adjustments logged with actor, original amount, adjusted amount, remarks | 100% of adjustments captured in audit trail |
| KPI-62 | Concurrent Processing Conflict Prevention | Two Finance users cannot process the same claim simultaneously | 100% of concurrent attempts return `409 Conflict` |

---

## MODULE 8 — Notification & Alerts

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-63 | Push Notification Delivery Rate | Percentage of push notifications successfully delivered | ≥ 98% delivery rate |
| KPI-64 | Email Notification Delivery Rate | Percentage of emails successfully delivered | ≥ 99% delivery rate (via AWS SES); bounce rate < 1% |
| KPI-65 | In-App Notification Accuracy | In-app notifications display correct entity, action, and link | 100% of notifications link to correct entity |
| KPI-66 | SLA Breach Notification Delivery | SLA breach escalation notifications delivered within 60 seconds | ≥ 98% delivery within 60-second window |
| KPI-67 | Notification Read State Accuracy | `read` flag updated correctly when user views notification | 100% read-state accuracy |
| KPI-68 | Unread Notification Count Accuracy | Unread count displayed correctly across sessions | 100% count accuracy verified by E2E tests |

---

## MODULE 9 — Audit Trail & Reporting

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-69 | Audit Log Completeness Rate | Percentage of all system state-change events captured in audit log | 100% — zero state changes occur without an audit log entry |
| KPI-70 | Audit Log Immutability | Audit log entries cannot be modified or deleted via any API | 0% mutability — all update/delete attempts on audit logs return `403 Forbidden` |
| KPI-71 | Audit Trail Query Latency | Time to return filtered audit trail results | P95 ≤ 500ms for date-range queries up to 1-year window |
| KPI-72 | Report Generation Latency — JSON | Time to generate travel summary report in JSON format | P95 ≤ 2 seconds for 10,000-record datasets |
| KPI-73 | Report Generation Latency — CSV/PDF | Time to generate and deliver CSV/PDF export | ≤ 30 seconds for up to 50,000 records via async job |
| KPI-74 | Report Filter Accuracy | Filters (date, department, employee, status) return correct, consistent data | 100% filter accuracy verified by data consistency tests |
| KPI-75 | Dashboard Data Freshness | Dashboard metrics reflect data no older than 5 minutes | ≤ 5-minute data staleness for all dashboard KPI widgets |
| KPI-76 | Data Retention Compliance | All records retained for minimum 7 years per regulatory requirement | 100% records within retention window accessible; archival policy enforced |

---

## MODULE 10 — Admin & Configuration Panel

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-77 | Policy CRUD Success Rate | Admin creates, updates, deletes travel policies without system error | ≥ 99% success rate |
| KPI-78 | Approval Hierarchy Configuration Accuracy | Configured approval chains route requests to correct approvers | 100% routing accuracy verified by workflow tests |
| KPI-79 | Cost Center Mapping Accuracy | Expense claims mapped to correct cost center per configuration | 100% mapping accuracy |
| KPI-80 | Admin Action Audit Completeness | All admin CRUD actions logged with actor, timestamp, before/after state | 100% admin actions captured in audit trail |
| KPI-81 | Configuration Change Propagation Latency | Policy, hierarchy, and RBAC changes take effect within 60 seconds | ≤ 60-second propagation latency |

---

## MODULE 11 — Security & Compliance

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-82 | API Authentication Enforcement | All protected endpoints require valid JWT; unauthenticated requests blocked | 100% of unauthenticated requests return `401 Unauthorized` |
| KPI-83 | Authorization (RBAC) Enforcement | Role-restricted endpoints inaccessible to unauthorized roles | 100% of unauthorized role-access attempts return `403 Forbidden` |
| KPI-84 | Rate Limiting Enforcement | API rate limiting applied per user/IP to prevent abuse | Requests exceeding rate limit return `429 Too Many Requests` within configured window |
| KPI-85 | Data Encryption at Rest | All sensitive data (PII, financial data) encrypted at rest | 100% of sensitive fields encrypted (AES-256); verified by security audit |
| KPI-86 | Data Encryption in Transit | All API communication over HTTPS/TLS | 100% TLS enforcement; HTTP redirected to HTTPS |
| KPI-87 | S3 Receipt Storage Access Control | Receipts accessible only via time-limited pre-signed URLs; no public access | 0% publicly accessible receipt objects; pre-signed URL TTL ≤ 15 minutes |
| KPI-88 | DPDP/GDPR Compliance | PII data handling, retention, and deletion comply with applicable regulations | 100% compliance verified by legal/compliance review before go-live |
| KPI-89 | Security Incident Audit Trail | All security events (failed logins, unauthorized access attempts) logged | 100% of security events captured with IP, timestamp, actor |

---

## MODULE 12 — Performance & Scalability

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-90 | System Uptime — Business Hours | Platform availability during 6 AM – 11 PM IST | ≥ 99.5% uptime |
| KPI-91 | API Response Time — Core Operations (P95) | P95 latency for all core CRUD endpoints | < 500ms under 500 concurrent users |
| KPI-92 | Concurrent User Load Handling | System handles peak concurrent load without degradation | ≥ 500 concurrent users without P95 latency exceeding 800ms |
| KPI-93 | Database Query Performance | No single query exceeds threshold under normal load | P95 DB query time < 100ms |
| KPI-94 | Redis Cache Hit Rate | Percentage of cacheable reads served from Redis | ≥ 80% cache hit rate for frequently accessed configurations and policies |
| KPI-95 | Background Job Success Rate | BullMQ jobs (report generation, notification dispatch, escalation) complete successfully | ≥ 99% job success rate; failed jobs retried up to 3 times with dead-letter logging |
| KPI-96 | File Upload Throughput | System handles concurrent receipt uploads without timeout | ≥ 100 concurrent 10MB uploads without error |

---

## MODULE 13 — User Adoption & Operational KPIs

| KPI Number | KPI Name | Description | Criteria |
|---|---|---|---|
| KPI-97 | User Adoption Rate | Percentage of eligible employees active on platform within 90 days | ≥ 80% of 10,000+ employees have submitted at least one request |
| KPI-98 | Paper/Email Process Elimination Rate | Reduction in travel requests processed via legacy channels | ≤ 5% requests handled outside the platform by Month 3 |
| KPI-99 | Employee Satisfaction Score | Post-adoption survey satisfaction with travel/expense process | ≥ 4.0 / 5.0 average score at 90-day survey |
| KPI-100 | Finance Processing Efficiency | Reduction in average Finance team time spent per expense claim | ≥ 40% reduction in manual processing time vs. pre-launch baseline |
| KPI-101 | Expense Leakage Reduction | Reduction in unapproved/non-compliant expense amounts processed | ≥ 30% reduction in non-compliant reimbursements by Month 6 |

---

# Development Timeline

| Sprint | Focus Area | Deliverables |
|---|---|---|
| Sprint 0 (Week 1–2) | Project Setup & Architecture | Repo scaffolding, NestJS boilerplate, Docker Compose, PostgreSQL schema design, Prisma setup, CI/CD pipeline (GitHub Actions), AWS S3 + SES configuration |
| Sprint 1 (Week 3–4) | Auth & User Management | JWT + Passport.js auth, user CRUD, RBAC middleware, bulk CSV import, login/logout/refresh APIs, role assignment |
| Sprint 2 (Week 5–6) | Travel Request Module | Travel request CRUD APIs, mandatory field validation, duplicate detection, attachment upload (S3 pre-signed URLs), status machine, audit logging |
| Sprint 3 (Week 7–8) | Approval Workflow | Multi-level approval routing, SLA timer (BullMQ scheduled jobs), auto-escalation, concurrent approval conflict prevention, approval audit trail |
| Sprint 4 (Week 9–10) | Policy Compliance Engine | Policy configuration APIs, real-time validation engine, per-diem/hotel/flight rule enforcement, Finance override workflow, policy audit logging |
| Sprint 5 (Week 11–12) | Expense Claim & Advance | Expense claim CRUD APIs, receipt validation, per-diem auto-calculation, advance request/settlement, unsettled advance block, claim-to-request linkage |
| Sprint 6 (Week 13–14) | Reimbursement & Notifications | Finance reimbursement processing APIs, payment confirmation flow, reimbursement ledger, notification engine (push + email + in-app via BullMQ + AWS SES) |
| Sprint 7 (Week 15–16) | Audit Trail & Reporting | Immutable audit log infrastructure, report generation APIs (JSON/CSV/PDF), dashboard data aggregation, async export jobs, data retention configuration |
| Sprint 8 (Week 17–18) | Admin Panel & Security Hardening | Admin CRUD for policies, hierarchy, cost centers, rate limiting (Redis), encryption verification, DPDP compliance checks, security audit |
| Sprint 9 (Week 19–20) | Performance Testing & UAT | Load testing (500 concurrent users), P95 latency validation, bug fixes, UAT with Finance/HR/Manager cohorts, acceptance criteria sign-off |
| Sprint 10 (Week 21–22) | Flutter Mobile App — Core Flows | Employee: travel request, expense submission; Manager: approval queue; Finance: claims queue; push notification integration |
| Sprint 11 (Week 23–24) | Flutter Mobile App — Polish & Go-Live | Audit dashboard, report viewer, onboarding flow, phased rollout, production deployment, monitoring setup (alerts, dashboards) |

---

# Success Criteria

| Category | Success Metric | Target |
|---|---|---|
| Functional Completeness | All 13 modules delivered with ≥ 95% acceptance criteria passing | ≥ 95% AC pass rate at UAT sign-off |
| Performance | P95 API latency under 500 concurrent users | < 500ms |
| Availability | System uptime during business hours | ≥ 99.5% |
| Security | Zero critical/high vulnerabilities at go-live | 0 critical/high CVEs post security audit |
| User Adoption | Active employees on platform within 90 days of launch | ≥ 80% of 10,000+ employees |
| Policy Compliance | Expense claims validated against policy in real-time | ≥ 95% real-time validation with 0% blocking error |
| Reimbursement Speed | End-to-end reimbursement cycle | ≤ 7 business days |
| Audit Integrity | State-change events captured in audit trail | 100% completeness |
| Process Digitization | Travel requests handled outside the platform | ≤ 5% by Month 3 |
| Employee Satisfaction | Post-adoption satisfaction survey | ≥ 4.0 / 5.0 |
| Finance Efficiency | Reduction in manual processing time per claim | ≥ 40% reduction vs. baseline |
| Expense Leakage Control | Reduction in non-compliant reimbursement amounts | ≥ 30% reduction by Month 6 |
