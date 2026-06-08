# Test Specification Document (Flutter)

## Enterprise Employee Travel & Expense Management System

**Version:** 2.0  
**Target Platform:** Flutter (iOS · Android · Web)  
**Reference Documents:** kpi.md · prd.md · project_scope.md  
**Test Frameworks:** flutter_test · mocktail · integration_test  

---

# 1. Overview & Objectives

This document defines the test specification for the Flutter client application. Test cases are structured to be proper, crisp, and directly traceable to the functional requirements (FR), business rules (BR), and KPI constraints.

## 1.1 Test Type Definitions
* **Unit Tests (U):** Business logic validation, use cases, models serialization, local state managers (Riverpod), and utility validation functions.
* **Widget Tests (W):** UI layout verification, input fields error states, navigation triggers, and interactive elements.
* **Integration Tests (I):** End-to-end user flows, secure storage adapters, state synchronizations, and API mock interceptors.

## 1.2 Test Case Notation
* **TC-POS:** Positive path (valid inputs, expected happy-path outcomes).
* **TC-NEG:** Negative path (invalid inputs, validation blocks, error messages).
* **TC-EDGE:** Boundary or system limit conditions (max limits, offline handling, concurrency).

---

# 2. Coverage Targets & Definition of Done

* **Coverage Goals:**
  * Business logic (Providers / Use Cases): **≥ 90%**
  * Input validators: **100%**
  * Widget / UI components: **≥ 80%**
  * Integration workflows: **100%** of MVP release paths (FR-001 to FR-012)
* **Definition of Done (DoD):**
  * No linting issues or analysis warnings (`flutter analyze`).
  * All unit, widget, and integration tests execute successfully.
  * Security standards (HTTPS, Secure storage logic) are verified.

---

# 3. Test Cases by Feature Module

## 3.1 Authentication & SSO (FR-001)
* **KPI Mapping:** System Adoption Rate (≥ 90%), Employee Satisfaction (≥ 4.5/5)
* **Constraints:** Role-Based Access Control (RBAC) mapping; 30-minute inactivity auto-logout.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-001** | Unit | Correct Role assignment from JWT token payload | None | Input JWT claim with role: `EMPLOYEE` / `FINANCE` / `MANAGER` | `UserModel` role translates to `UserRole.employee` / `finance` / `manager` | ⚠️ **Pass (Deviation)**: Uses `String` instead of Enum. |
| **TC-AUTH-002** | Widget | Renders Single Sign-On (SSO) login option | App is on Login Screen | Open login screen | "Login with SSO" button is present and active | ✅ **Pass**: SSO buttons present. |
| **TC-AUTH-003** | Integration | SSO Login flow with valid token | User is not logged in | Tap SSO button, supply valid mocked token | Secure token is saved, user redirects to respective dashboard | ✅ **Pass**: Full flow implemented. |
| **TC-AUTH-004** | Integration | SSO Login flow with expired token | User is not logged in | Tap SSO button, supply expired token | Error message "Token expired" is shown; user remains on login screen | ✅ **Pass**: 401s handled by Dio interceptors. |
| **TC-AUTH-005** | Unit / Edge | Inactivity session timeout | User session is active | Simulate 30 minutes of app inactivity | `AuthRepository.logout` is called; redirects to login screen | ❌ **Fail**: Not yet implemented. |
| **TC-AUTH-006** | Unit / Edge | Idempotency on concurrent logins | User session is initializing | Trigger SSO call concurrently 3 times | API client initiates exactly 1 token exchange request | ❌ **Fail**: Not yet implemented. |

---

## 3.2 Travel Request Submission (FR-002)
* **KPI Mapping:** Travel Approval Time (< 1 Day), Processing Time (≤ 2 Days)
* **Constraints:** Must submit domestic travel requests at least 7 days in advance. Trip duration must not exceed 90 days.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TR-001** | Unit / POS | Validate valid travel details | Valid user session | Destination: `Mumbai`, Start: `Date + 8 Days`, End: `Date + 10 Days`, Cost Center: `CC-101` | Validator returns `Right(true)` |
| **TC-TR-002** | Unit / NEG | Reject start date less than 7 days in advance | Valid user session | Start Date: `Date + 3 Days` | Validator returns `ValidationFailure` (Domestic travel requires 7 days advance notice) |
| **TC-TR-003** | Unit / NEG | Reject end date preceding start date | Valid user session | Start Date: `Date + 8 Days`, End Date: `Date + 5 Days` | Validator returns `ValidationFailure` (End date must be after start date) |
| **TC-TR-004** | Unit / NEG | Reject missing cost center or destination | Valid user session | Destination: `""` or Cost Center: `null` | Validator returns `ValidationFailure` |
| **TC-TR-005** | Unit / EDGE | Trip duration exceeds 90 days limit | Valid user session | Start: `Date + 8 Days`, End: `Date + 105 Days` | Validator returns `ValidationFailure` (Trip duration cannot exceed 90 days) |
| **TC-TR-006** | Unit / EDGE | Duplicate travel request submission | Valid user session | Submit request for same destination and date range | Repo rejects submission with `DuplicateRequestFailure` |
| **TC-TR-007** | Widget | Display inline error messages on form | Form page open | Leave fields blank and tap "Submit" | UI displays validation errors next to empty inputs |

---

## 3.3 Multi-Level Approval Workflow (FR-003)
* **KPI Mapping:** First-Level Approval SLA Compliance (≥ 95%), Turnaround Time (< 1 Day)
* **Constraints:** Escalation triggers after 8 hours of primary inactivity. Self-approval is blocked.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-APP-001** | Unit / POS | Advance workflow status upon approval | Pending L1 request | Approver triggers "Approve" action | Request state transitions from `pendingL1` to `pendingL2` |
| **TC-APP-002** | Unit / POS | Final approval changes status to fully approved | Pending L3 request | Finance approver triggers "Approve" action | Request state transitions to `fullyApproved` |
| **TC-APP-003** | Unit / NEG | Block rejection without comments | Pending request | Trigger "Reject" with empty reason | System blocks rejection; returns `ValidationFailure` |
| **TC-APP-004** | Unit / NEG | Block self-approval attempt | User is author of request | Attempt to approve own travel request | System blocks action; returns `SelfApprovalBlockFailure` |
| **TC-APP-005** | Unit / EDGE | SLA Escalation timer triggers | Approval is pending | Inactivity timer exceeds 8 hours | Request is escalated; notification sent to secondary approver |
| **TC-APP-006** | Integration | Concurrency check on approval action | Pending request | Two managers attempt to approve at the same time | Only the first action completes successfully; second receives conflict response |

---

## 3.4 Expense Submission (FR-004) & Policy Engine (FR-006)
* **KPI Mapping:** Expense Accuracy Rate (≥ 98%), Policy Compliance Rate (≥ 98%)
* **Constraints:** Claims above ₹500 require receipts. Must submit claim within 30 days of trip completion. Zero/negative amounts block submission.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-EXP-001** | Unit / POS | Claims under ₹500 do not require receipts | Valid travel request | Amount: ₹450, Receipt: `null` | Validator returns `Right(true)` |
| **TC-EXP-002** | Unit / NEG | Claims above ₹500 require receipts | Valid travel request | Amount: ₹600, Receipt: `null` | Validator returns `ValidationFailure` (Receipt mandatory above ₹500) |
| **TC-EXP-003** | Unit / NEG | Block zero or negative expense amounts | Valid travel request | Amount: `0` or `-150` | Validator returns `ValidationFailure` (Amount must be greater than zero) |
| **TC-EXP-004** | Unit / NEG | Block submissions older than 30 days | Trip completed 35 days ago | Attempt to submit expense claim | System blocks submission; returns `SubmissionWindowExpired` |
| **TC-EXP-005** | Unit / NEG | Enforce category budget limits | Valid travel request | Category: `Meals`, Amount: ₹6,000 (Limit: ₹1,500) | Policy Engine blocks submission; returns `PolicyLimitViolation` |
| **TC-EXP-006** | Unit / EDGE | Claim exactly at the policy limit | Valid travel request | Category: `Meals`, Amount: ₹1,500 | Validator returns success (`Right(true)`) |
| **TC-EXP-007** | Unit / EDGE | Detect duplicate receipts | Valid travel request | Upload same receipt file hash as previous claim | System returns `DuplicateReceiptViolation` |

---

## 3.5 Receipt Upload & Storage (FR-005)
* **KPI Mapping:** Audit Readiness Score (≥ 95%)
* **Constraints:** Supported formats: JPEG, PNG, PDF. File size ≤ 10MB.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-RCP-001** | Unit / POS | Upload valid receipt file | Valid session | File type: `PDF`, Size: `3MB` | File uploads successfully; returns secure storage URL |
| **TC-RCP-002** | Unit / NEG | Reject unsupported file formats | Valid session | File type: `EXE` or `DOCX` | Upload blocked; returns `InvalidFormatFailure` |
| **TC-RCP-003** | Unit / NEG | Reject files exceeding size limit | Valid session | File type: `JPEG`, Size: `12MB` | Upload blocked; returns `FileSizeLimitExceeded` |
| **TC-RCP-004** | Widget / EDGE | Handle network disconnection mid-upload | File upload started | Drop network connection | App shows failure indicator with a "Retry Upload" option |

---

## 3.6 Reimbursement Status Tracking (FR-007)
* **KPI Mapping:** Average Reimbursement Time (< 3 Days)
* **Constraints:** Payment initiation must occur within 1 business day of Finance approval.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-REIM-001** | Widget / POS | Display correct status timeline | Claim submitted | Navigate to reimbursement tracking | Timeline correctly visualizes: `Approved` → `ERP Sent` → `Paid` |
| **TC-REIM-002** | Integration | ERP payment confirmation updates app state | ERP updates state to Paid | Trigger sync check | App switches status to `Reimbursed` and displays payment reference |
| **TC-REIM-003** | Unit / EDGE | ERP integration failure recovery | Finance approves claim | ERP API is offline | Status is set to `ERP Queue Pending`; retries trigger automatically |

---

## 3.7 Push Notifications & Alerts (FR-008)
* **KPI Mapping:** First-Level Approval SLA Compliance (≥ 95%)
* **Constraints:** SLA warnings fire within 2 hours of threshold breach.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-NTF-001** | Integration | Direct notification on status change | App in background | API reports request status changed | System tray displays status alert notification |
| **TC-NTF-002** | Integration | SLA Warning trigger alert | Request pending > 6 hours | Simulate SLA warning time | Manager receives high-priority alert regarding pending approval |
| **TC-NTF-003** | Widget | Toggle notification settings | Settings page open | Switch off "Approval Notifications" | Notification config updates; alerts are suppressed |

---

## 3.8 Dashboard & Console Interfaces (FR-009, FR-010, FR-011)
* **KPI Mapping:** System Adoption Rate (≥ 90%), Employee Satisfaction (≥ 4.5/5)
* **Constraints:** App launch < 3s, dashboard load < 5s. WCAG AA compliant.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DSB-001** | Widget | Dashboard renders personal shortcuts | User is Employee | Load Home Page | Displays active travel requests, pending claims, and quick submit buttons |
| **TC-DSB-002** | Widget | Manager Console displays queue | User is Manager | Load Manager Console | Displays pending team approvals with 1-tap Approve/Reject action buttons |
| **TC-DSB-003** | Widget | Finance Module validations queue | User is Finance | Load Finance Queue | Displays verification tasks, receipt review panes, and ERP export buttons |
| **TC-DSB-004** | Widget / EDGE | Font accessibility scaling | System font size is set to large | Render any dashboard page | UI text and buttons scale gracefully without truncating or overlapping |

---

## 3.9 Audit Log & Trail (FR-012)
* **KPI Mapping:** Audit Readiness Score (≥ 95%)
* **Constraints:** Write-once, read-many (WORM) immutability. Full timestamps.

| Test ID | Test Type | Scenario Description | Preconditions | Steps / Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUD-001** | Unit / POS | Log generation on transaction | User triggers action | Submit travel request or approve claim | System creates immutable log entry with: `UserId`, `Timestamp`, `Action` |
| **TC-AUD-002** | Integration / NEG | Prevent client modification of audit trail | Log exists | Send API request to modify/delete audit log entry | Server rejects request with `403 Forbidden` / action blocked |

---

# 4. Non-Functional Requirement (NFR) Verification

| Test ID | NFR Category | Verification Objective | Method / Tool | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-NFR-001** | Performance | Verify app launch time | Stopwatch utility / Profile mode | Launch time is `< 3 seconds` under normal 4G network |
| **TC-NFR-002** | Performance | Verify dashboard load time | API logging / Profile mode | Dashboard loads and caches data in `< 5 seconds` |
| **TC-NFR-003** | Performance | File upload performance | Network Profiler | 10MB receipt uploads in `< 5 seconds` over WiFi |
| **TC-NFR-004** | Security | Verify local secure storage | Flutter secure storage inspection | OAuth tokens, user roles, and active session keys are encrypted |
| **TC-NFR-005** | Accessibility | Verify dynamic text scaling | Accessibility settings emulator | Text remains readable and elements adjust without breaking UI flow |
| **TC-NFR-006** | Accessibility | Contrast ratio verification | WCAG validator | All text-to-background combinations maintain a contrast ratio of `≥ 4.5:1` |
