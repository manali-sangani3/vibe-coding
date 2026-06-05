# Test Specification Document (Node.js Backend)

## Enterprise Employee Travel & Expense Management System

**Version:** 2.0  
**Target Platform:** Node.js (NestJS, PostgreSQL, Redis, BullMQ)  
**Reference Documents:** kpi.md · prd.md · project_scope.md  
**Test Frameworks:** Jest · Supertest

---

# 1. Overview & Objectives

This document defines the backend test specification for the Node.js API services. All test cases ensure API stability, correct execution of validation rules, security controls (RBAC, JWT), and database integrity.

## 1.1 Test Type Definitions
* **Unit Tests (U):** Testing isolated services, policy validator rules, custom validation decorators, and utility algorithms.
* **API Tests (A):** Endpoint request-response verification using `supertest` mapping to standard success/error structures.
* **Integration Tests (I):** Multilayered test cases involving PostgreSQL database transactions, Redis caches, and HRMS/ERP mock adapters.
* **Queue / Job Tests (Q):** Validating asynchronous queue processing (BullMQ) for SLA escalations, reporting jobs, and notifications.

## 1.2 Test Case Notation
* **TC-BE-POS:** Positive path (200/201 Success status codes, valid payloads).
* **TC-BE-NEG:** Negative path (400 Bad Request, 401 Unauthorized, 403 Forbidden, 409 Conflict).
* **TC-BE-EDGE:** Boundary or system limit conditions (concurrency, queue timeouts, retry executions).

---

# 2. Coverage Targets & Definition of Done

* **Coverage Goals:**
  * Controllers & API Endpoints: **100%**
  * Service business logic: **≥ 85%**
  * Database hooks / Triggers: **100%**
  * BullMQ Job Handlers: **≥ 90%**
* **Definition of Done (DoD):**
  * All tests pass without errors or memory leaks.
  * DB schema migrations are validated against test cases.
  * Immutable database rules (Audit Log WORM structure) are enforced.

---

# 3. Test Cases by Backend Module

## 3.1 Authentication & Auth APIs (SSO, JWT, RBAC)
* **API Endpoints:** `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
* **KPI / Constraints:** OWASP protection, JWT expiration enforcement, RBAC verification.

| Test ID | Test Type | Scenario / Endpoint | Request / Input | Expected Response | KPI / Constraint Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-AUTH-001** | API / POS | Login with valid SSO token | `POST /auth/login` <br> Payload: `{ "ssoToken": "valid_token" }` | `200 OK` <br> Payload: `{ "success": true, "token": "jwt_access_token", "user": { "role": "employee" } }` | SSO Authentication succeeded. |
| **TC-BE-AUTH-002** | API / NEG | Login with expired SSO token | `POST /auth/login` <br> Payload: `{ "ssoToken": "expired_token" }` | `401 Unauthorized` <br> `{ "success": false, "errorCode": "SSO_AUTH_FAILED" }` | Blocks expired session logins. |
| **TC-BE-AUTH-003** | API / NEG | RBAC access restriction | `POST /approvals/1/approve` <br> Headers: `Authorization: Bearer jwt_employee` | `403 Forbidden` <br> `{ "success": false, "errorCode": "FORBIDDEN_RESOURCE" }` | Restricts managers-only action to non-managers. |
| **TC-BE-AUTH-004** | API / EDGE | Session token refresh behavior | `POST /auth/refresh` <br> Payload: `{ "refreshToken": "valid_refresh" }` | `200 OK` <br> Returns new access and refresh JWTs | Keeps active user sessions authenticated. |

---

## 3.2 Travel Request Module
* **API Endpoints:** `POST /travel`, `GET /travel/:id`, `PUT /travel/:id`, `DELETE /travel/:id`
* **KPI / Constraints:** Must submit domestic travel requests ≥ 7 days in advance. Trip duration must not exceed 90 days.

| Test ID | Test Type | Scenario / Endpoint | Request / Input | Expected Response | KPI / Constraint Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-TR-001** | API / POS | Create travel request successfully | `POST /travel` <br> Payload: `{ "destination": "Pune", "startDate": "Date+8Days", "endDate": "Date+10Days", "costCenter": "CC-10" }` | `201 Created` <br> returns request payload with state `submitted` | Enforces 7 days advance rule for happy path. |
| **TC-BE-TR-002** | API / NEG | Reject travel request < 7 days in advance | `POST /travel` <br> Payload: `{ "destination": "Pune", "startDate": "Date+4Days" }` | `400 Bad Request` <br> `{ "success": false, "errorCode": "VALIDATION_FAILED" }` | Blocks policy-violating short notice travel. |
| **TC-BE-TR-003** | API / NEG | Reject invalid date sequence | `POST /travel` <br> Payload: `{ "startDate": "Date+8", "endDate": "Date+6" }` | `400 Bad Request` <br> `{ "success": false, "errorCode": "INVALID_DATE_RANGE" }` | Prevents illogical travel durations. |
| **TC-BE-TR-004** | API / EDGE | Reject request exceeding 90 days | `POST /travel` <br> Payload: `{ "startDate": "Date+8", "endDate": "Date+108" }` | `400 Bad Request` <br> `{ "success": false, "errorCode": "TRIP_DURATION_EXCEEDED" }` | Enforces max 90-day trip length limit. |
| **TC-BE-TR-005** | API / EDGE | Block overlapping travel requests | `POST /travel` <br> Payload: overlapping dates for same user | `409 Conflict` <br> `{ "success": false, "errorCode": "OVERLAPPING_TRIP" }` | Blocks duplicate submissions. |

---

## 3.3 Approval Workflow & Escalation Queue
* **API Endpoints:** `POST /approvals/:id/approve`, `POST /approvals/:id/reject`
* **KPI / Constraints:** Secondary escalation triggers after 8 hours of primary inactivity. Self-approval is blocked.

| Test ID | Test Type | Scenario / Endpoint | Request / Input | Expected Response | KPI / Constraint Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-APP-001** | API / POS | L1 Manager approves request | `POST /approvals/123/approve` <br> Headers: Manager JWT | `200 OK` <br> State transitions to `pendingL2` | Advances request status up the chain. |
| **TC-BE-APP-002** | API / NEG | Block reject without comment | `POST /approvals/123/reject` <br> Payload: `{ "reason": "" }` | `400 Bad Request` <br> `{ "success": false, "errorCode": "REJECTION_REASON_REQUIRED" }` | Forces rejection justification. |
| **TC-BE-APP-003** | API / NEG | Prevent self-approval of request | `POST /approvals/123/approve` <br> Headers: Requester JWT | `400 Bad Request` <br> `{ "success": false, "errorCode": "SELF_APPROVAL_BLOCKED" }` | Blocks internal audit violation attempt. |
| **TC-BE-APP-004** | Queue / EDGE | SLA escalation background job | BullMQ scheduler picks up pending approval > 8 hours | Job executes `ApprovalsService.escalate(123)` | Triggers automatic escalation alert and transfers owner. |
| **TC-BE-APP-005** | Integration | Handle concurrent approval actions | Simultaneous calls to `/approvals/123/approve` | First call succeeds (`200 OK`); second gets `409 Conflict` | Handles race conditions gracefully. |

---

## 3.4 Expense Submission & Policy Engine
* **API Endpoints:** `POST /expenses`, `POST /expenses/upload`
* **KPI / Constraints:** Claims above ₹500 require receipts. Limit constraints per category. Zero/negative amounts block submission.

| Test ID | Test Type | Scenario / Endpoint | Request / Input | Expected Response | KPI / Constraint Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-EXP-001** | API / POS | Expense under ₹500 without receipt | `POST /expenses` <br> Payload: `{ "amount": 400, "category": "Meals" }` | `201 Created` <br> Success status true | Receipts are optional below ₹500. |
| **TC-BE-EXP-002** | API / NEG | Expense above ₹500 without receipt | `POST /expenses` <br> Payload: `{ "amount": 600, "category": "Meals", "receiptUrl": null }` | `400 Bad Request` <br> `{ "success": false, "errorCode": "RECEIPT_REQUIRED" }` | Enforces mandatory receipt compliance threshold. |
| **TC-BE-EXP-003** | API / NEG | Expense violates category cap limit | `POST /expenses` <br> Payload: `{ "amount": 2500, "category": "Meals" }` | `400 Bad Request` <br> `{ "success": false, "errorCode": "POLICY_LIMIT_EXCEEDED" }` | Restricts spend based on compliance rules. |
| **TC-BE-EXP-004** | API / NEG | Claim submitted after 30 days | `POST /expenses` <br> Trip end date: `35 Days Ago` | `400 Bad Request` <br> `{ "success": false, "errorCode": "CLAIM_WINDOW_EXPIRED" }` | Enforces 30-day post-trip submission window. |
| **TC-BE-EXP-005** | API / EDGE | Block duplicate receipt file hash | `POST /expenses` <br> Uploading duplicate file hash | `400 Bad Request` <br> `{ "success": false, "errorCode": "DUPLICATE_RECEIPT" }` | Prevents double claiming of the same receipt. |

---

## 3.5 Reimbursement & ERP Integration
* **API Endpoints:** `GET /reimbursements`, `POST /integrations/erp/payout-callback`
* **KPI / Constraints:** ERP payment confirmation updates app state.

| Test ID | Test Type | Scenario / Endpoint | Request / Input | Expected Response | KPI / Constraint Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-REIM-001**| Integration | ERP payout callback updates state | `POST /integrations/erp/payout-callback` <br> Payload: `{ "claimId": "C-12", "paymentRef": "TXN9901", "status": "PAID" }` | `200 OK` <br> database claim state updates to `paid` | Transitions reimbursement status automatically. |
| **TC-BE-REIM-002**| API / NEG | ERP callback authentication | `/integrations/erp/payout-callback` <br> Missing API auth token | `401 Unauthorized` | Restricts access to ERP webhook. |
| **TC-BE-REIM-003**| Queue / EDGE | ERP API timeout queue retry | BullMQ payment sync job times out | BullMQ worker attempts retry with exponential backoff | Ensures payment queue recovery from ERP down time. |

---

## 3.6 Audit Trail & Log Immutability
* **KPI / Constraints:** Immutable write-once, read-many (WORM) audit database logging. Retained for 7 years.

| Test ID | Test Type | Scenario / Endpoint | Trigger / Action | Expected Result | KPI / Constraint Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-AUD-001** | Unit | Check automatic audit hook | Entity transaction occurs (e.g., Claim created) | Audit listener records `UserId`, `Action`, `Timestamp` | Verifies write on all transaction events. |
| **TC-BE-AUD-002** | Integration / NEG | Prevent SQL update on audit trail | Direct raw SQL UPDATE on `audit_logs` table | Database query throws error: `UPDATE action is denied on table audit_logs` | Confirms database level WORM protection. |
| **TC-BE-AUD-003** | Integration / NEG | Prevent SQL delete on audit trail | Direct raw SQL DELETE on `audit_logs` table | Database query throws error: `DELETE action is denied on table audit_logs` | Confirms database level WORM protection. |
