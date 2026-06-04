# Test Specification Document — Flutter

### Given Prompt
kpi.md, prd.md by refering this file genrate proper and crisp test cases file test_specification_flutter.md

### Output

## Enterprise Employee Travel & Expense Management System

**Version:** 1.0
**Document Type:** Test Specification
**Prepared By:** QA Architecture Team
**Platform:** Flutter (iOS · Android · Web)
**Reference:** kpi.md · prd.md
**Test Framework:** flutter_test · mocktail · integration_test

---

## Legend

| Symbol | Meaning           |
| ------ | ----------------- |
| ✅ POS  | Positive Test      |
| ❌ NEG  | Negative Test      |
| ⚠️ EDGE | Edge / Boundary    |
| 🔴 P1   | Critical Priority  |
| 🟠 P2   | High Priority      |
| 🟡 P3   | Medium Priority    |

---

## KPI → Test Coverage Map

| KPI                        | Target    | Covered By Module                |
| -------------------------- | --------- | -------------------------------- |
| Travel Approval Time       | < 1 Day   | AUTH, TRAVEL REQUEST, APPROVAL   |
| SLA Compliance             | ≥ 95%     | APPROVAL, NOTIFICATIONS          |
| Expense Processing Time    | ≤ 2 Days  | EXPENSE, FINANCE                 |
| Reimbursement Time         | < 3 Days  | REIMBURSEMENT                    |
| Policy Compliance Rate     | ≥ 98%     | POLICY VALIDATION                |
| System Adoption Rate       | ≥ 90%     | AUTH, DASHBOARD                  |
| Employee Satisfaction      | ≥ 4.5/5   | DASHBOARD, NOTIFICATIONS         |
| Manual Intervention Rate   | < 10%     | WORKFLOW (ALL MODULES)           |
| Audit Readiness Score      | ≥ 95%     | AUDIT LOG                        |
| Cost Per Claim             | ≤ ₹40     | EXPENSE, FINANCE                 |

---

# Module 1 — Authentication (FR-001)

**KPI Link:** System Adoption Rate ≥ 90%
**Priority:** 🔴 P1

| TC ID       | Test Name                                  | Type    | Precondition                              | Steps                                                                 | Expected Result                                              |
| ----------- | ------------------------------------------ | ------- | ----------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| TC-AUTH-001 | Valid SSO login — Employee role            | ✅ POS   | Valid SSO token; role = EMPLOYEE          | 1. Launch app 2. Tap SSO Login 3. Authenticate via SSO                | Redirected to Employee Dashboard; role = Employee assigned   |
| TC-AUTH-002 | Valid SSO login — Manager role             | ✅ POS   | Valid SSO token; role = MANAGER           | 1. Launch app 2. Tap SSO Login 3. Authenticate via SSO                | Redirected to Manager Approval Console                       |
| TC-AUTH-003 | Valid SSO login — Finance role             | ✅ POS   | Valid SSO token; role = FINANCE           | 1. Launch app 2. Tap SSO Login 3. Authenticate via SSO                | Redirected to Finance Review Module                          |
| TC-AUTH-004 | Valid SSO login — Admin role               | ✅ POS   | Valid SSO token; role = ADMIN             | 1. Launch app 2. Tap SSO Login 3. Authenticate via SSO                | Redirected to Admin Configuration Panel                      |
| TC-AUTH-005 | Expired SSO token                          | ❌ NEG   | Expired SSO token                         | 1. Launch app 2. Tap SSO Login 3. Submit expired token                | Error: "Session expired. Please login again"                 |
| TC-AUTH-006 | Invalid / malformed SSO token              | ❌ NEG   | Invalid token string                      | 1. Launch app 2. Tap SSO Login 3. Submit invalid token                | Error: "Authentication failed"                               |
| TC-AUTH-007 | Login attempt with no internet             | ❌ NEG   | Device offline                            | 1. Disable network 2. Tap SSO Login                                   | Error: "No internet connection. Please try again"            |
| TC-AUTH-008 | Unauthorized role accessing Finance module | ❌ NEG  | Logged in as Employee                     | 1. Login as Employee 2. Navigate manually to /finance                 | Redirect to Dashboard; access denied                         |
| TC-AUTH-009 | Unauthorized role accessing Admin panel    | ❌ NEG  | Logged in as Manager                      | 1. Login as Manager 2. Navigate manually to /admin                    | Access denied; error shown                                   |
| TC-AUTH-010 | Session auto-logout after 30 min inactivity | ⚠️ EDGE | Logged in; no action for 30 minutes      | 1. Login 2. Leave app idle for 30 minutes                             | App logs out; redirected to Login page                       |
| TC-AUTH-011 | Re-login after session expiry              | ⚠️ EDGE | Session expired mid-use                   | 1. Let session expire 2. Attempt action 3. Login again                | Seamless re-login; user lands on previous context            |
| TC-AUTH-012 | Concurrent login with same account         | ⚠️ EDGE | Same credentials on two devices           | 1. Login on Device A 2. Login on Device B with same account           | Both sessions valid OR Device A session invalidated (per policy) |
| TC-AUTH-013 | Logout clears all local session data       | ✅ POS   | User is logged in                         | 1. Tap Logout                                                         | Token, user data, and cache cleared; Login screen shown      |

---

# Module 2 — Travel Request Submission (FR-002)

**KPI Link:** Travel Approval Time < 1 Day; SLA Compliance ≥ 95%
**Priority:** 🔴 P1

| TC ID      | Test Name                                   | Type    | Precondition                        | Steps                                                                           | Expected Result                                               |
| ---------- | ------------------------------------------- | ------- | ----------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| TC-TR-001  | Submit valid travel request                 | ✅ POS   | Logged in as Employee               | 1. Open Travel Request form 2. Fill all fields 3. Tap Submit                   | Request submitted; status = Pending L1 Approval               |
| TC-TR-002  | Submit request and verify approver routing  | ✅ POS   | Logged in as Employee               | 1. Submit request 2. Login as Manager                                           | Request appears in Manager's approval queue                   |
| TC-TR-003  | View travel request history                 | ✅ POS   | Employee has past requests          | 1. Open Travel Request List                                                     | All past requests shown with correct status                   |
| TC-TR-004  | Cancel a pending travel request             | ✅ POS   | Request is in Pending Approval state | 1. Open request 2. Tap Cancel                                                  | Request status changes to Cancelled                           |
| TC-TR-005  | Submit with empty destination               | ❌ NEG   | Travel form open                    | 1. Leave destination blank 2. Tap Submit                                        | Error: "Destination is required"                              |
| TC-TR-006  | Submit with past start date                 | ❌ NEG   | Travel form open                    | 1. Select yesterday as start date 2. Tap Submit                                 | Error: "Start date cannot be in the past"                     |
| TC-TR-007  | Submit with end date before start date      | ❌ NEG   | Travel form open                    | 1. Start date = June 10 2. End date = June 5 3. Tap Submit                      | Error: "End date must be after start date"                    |
| TC-TR-008  | Submit without cost center                  | ❌ NEG   | Travel form open                    | 1. Fill all fields except cost center 2. Tap Submit                             | Error: "Cost center is required"                              |
| TC-TR-009  | Submit without trip purpose                 | ❌ NEG   | Travel form open                    | 1. Leave purpose field empty 2. Tap Submit                                      | Error: "Trip purpose is required"                             |
| TC-TR-010  | Trip duration exactly 90 days              | ⚠️ EDGE  | Travel form open                    | 1. Start = July 1 2. End = Sep 29 (90 days) 3. Tap Submit                      | Request accepted                                              |
| TC-TR-011  | Trip duration exceeding 90 days            | ⚠️ EDGE  | Travel form open                    | 1. Start = July 1 2. End = Oct 15 (>90 days) 3. Tap Submit                     | Error: "Trip duration cannot exceed 90 days"                  |
| TC-TR-012  | Duplicate request same date and destination | ⚠️ EDGE | Employee has existing active request | 1. Submit request 2. Submit identical request                                  | Error: "Duplicate travel request detected"                    |
| TC-TR-013  | Request submitted after business hours     | ⚠️ EDGE  | Submit at 9 PM                      | 1. Submit valid request after 6 PM                                              | Request queued; SLA timer starts next business day            |
| TC-TR-014  | Network failure during submission           | ⚠️ EDGE  | Form filled; network drops mid-submit | 1. Fill form 2. Simulate network drop 3. Tap Submit                           | Error: "Submission failed. Please retry"; form data preserved |

---

# Module 3 — Multi-Level Approval Workflow (FR-003)

**KPI Link:** Approval Time < 1 Day; SLA Compliance ≥ 95%
**Priority:** 🔴 P1

| TC ID       | Test Name                                       | Type    | Precondition                              | Steps                                                              | Expected Result                                             |
| ----------- | ----------------------------------------------- | ------- | ----------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| TC-APR-001  | L1 Manager approves travel request              | ✅ POS   | Request pending L1 approval               | 1. Login as Manager 2. Open request 3. Tap Approve                | Status = Pending L2 Approval; L2 notified                   |
| TC-APR-002  | L2 Department Head approves                     | ✅ POS   | Request pending L2 approval               | 1. Login as Dept Head 2. Open request 3. Tap Approve              | Status = Pending Finance Approval; Finance notified          |
| TC-APR-003  | L3 Finance approves — final approval            | ✅ POS   | Request pending Finance approval          | 1. Login as Finance 2. Open request 3. Tap Approve                | Status = Fully Approved; Employee notified                   |
| TC-APR-004  | L1 Manager rejects with reason                  | ✅ POS   | Request pending L1 approval               | 1. Login as Manager 2. Tap Reject 3. Enter reason 4. Confirm      | Status = Rejected; Employee notified with reason             |
| TC-APR-005  | Reject without entering reason                  | ❌ NEG   | Reject dialog open                        | 1. Tap Reject 2. Leave reason empty 3. Tap Confirm                | Error: "Rejection reason is required"                        |
| TC-APR-006  | Approver attempts to approve own request        | ❌ NEG   | Manager submitted a travel request        | 1. Manager opens own request 2. Tap Approve                       | Error: "Self-approval is not permitted"                      |
| TC-APR-007  | Employee role attempts approval action          | ❌ NEG   | Logged in as Employee                     | 1. Open approval queue URL directly                               | Access denied; redirected to Dashboard                       |
| TC-APR-008  | Approve already rejected request               | ❌ NEG   | Request status = Rejected                 | 1. Open rejected request 2. Attempt approval                      | Error: "Request is already rejected and cannot be approved"  |
| TC-APR-009  | SLA escalation after 8 hours of inactivity     | ⚠️ EDGE  | Request pending L1; approver idle 8 hrs   | 1. Submit request 2. Wait 8 hours without L1 action               | Auto-escalated to secondary approver; escalation logged      |
| TC-APR-010  | SLA warning notification 2 hours before breach | ⚠️ EDGE  | Request pending approval                  | 1. Submit request 2. Wait 6 hours without action                  | Warning notification sent to L1 approver                     |
| TC-APR-011  | Concurrent approval by two managers            | ⚠️ EDGE  | Two managers have access to same request  | 1. Manager A and B both tap Approve simultaneously                | Only one approval processed; second gets "Already approved"  |
| TC-APR-012  | Approval after request cancellation            | ⚠️ EDGE  | Employee cancels request; manager opens   | 1. Employee cancels request 2. Manager taps Approve               | Error: "Request is no longer available for approval"         |
| TC-APR-013  | Approval queue shows correct request count     | ✅ POS   | Manager has 5 pending requests            | 1. Open Approval Queue                                            | Badge and list show exactly 5 pending items                  |
| TC-APR-014  | Quick-tap approve from queue card              | ✅ POS   | Requests visible in queue                 | 1. Tap quick approve button on card                               | Approved without opening detail page                         |

---

# Module 4 — Expense Submission (FR-004)

**KPI Link:** Expense Accuracy ≥ 98%; Expense Rejection Rate < 5%
**Priority:** 🔴 P1

| TC ID       | Test Name                                    | Type    | Precondition                         | Steps                                                               | Expected Result                                              |
| ----------- | -------------------------------------------- | ------- | ------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| TC-EXP-001  | Submit valid expense claim                   | ✅ POS   | Logged in as Employee; trip approved | 1. Open Expense form 2. Fill all fields 3. Attach receipt 4. Submit | Claim submitted; status = Pending Finance Review             |
| TC-EXP-002  | Submit multiple line items in one claim      | ✅ POS   | Expense form open                    | 1. Add transport + accommodation + meals items 2. Submit            | All items saved; claim total = sum of items                  |
| TC-EXP-003  | View submitted expense claim history         | ✅ POS   | Employee has past claims             | 1. Open Expense List                                                | All claims shown with correct status and amounts             |
| TC-EXP-004  | Re-submit a rejected claim within 7 days    | ✅ POS   | Claim was rejected                   | 1. Open rejected claim 2. Edit 3. Re-submit                         | Claim re-submitted successfully; enters review queue         |
| TC-EXP-005  | Submit claim with amount = 0                 | ❌ NEG   | Expense form open                    | 1. Enter 0 in amount field 2. Tap Add Item                          | Error: "Amount must be greater than zero"                    |
| TC-EXP-006  | Submit claim with negative amount            | ❌ NEG   | Expense form open                    | 1. Enter -500 in amount field 2. Tap Add Item                       | Error: "Amount must be greater than zero"                    |
| TC-EXP-007  | Submit claim without selecting category      | ❌ NEG   | Expense form open                    | 1. Fill amount and date 2. Skip category 3. Tap Submit              | Error: "Expense category is required"                        |
| TC-EXP-008  | Submit claim with future expense date        | ❌ NEG   | Expense form open                    | 1. Select tomorrow's date as expense date 2. Submit                 | Error: "Expense date cannot be in the future"                |
| TC-EXP-009  | Submit duplicate claim (same date, amount, category) | ⚠️ EDGE | Claim already submitted         | 1. Submit identical claim for same date, category, amount           | Error: "Duplicate claim detected"                            |
| TC-EXP-010  | Submit claim at exactly policy limit amount  | ⚠️ EDGE  | Policy limit = ₹500 for meals        | 1. Enter ₹500 for meals 2. Submit                                   | Claim accepted; no policy violation                          |
| TC-EXP-011  | Submit claim 1 rupee above policy limit      | ⚠️ EDGE  | Policy limit = ₹500 for meals        | 1. Enter ₹501 for meals 2. Submit                                   | Policy violation flagged: "Exceeds meal limit of ₹500"       |
| TC-EXP-012  | Claim with 50 line items                     | ⚠️ EDGE  | Expense form open                    | 1. Add 50 expense items 2. Submit                                   | All 50 items saved; claim total calculated correctly         |
| TC-EXP-013  | Re-submit rejected claim after 7 days        | ⚠️ EDGE  | Claim rejected 8 days ago            | 1. Open rejected claim 2. Attempt re-submission                     | Error: "Re-submission window of 7 days has expired"          |
| TC-EXP-014  | Claim amount exceeds ₹10,000 without receipt | ❌ NEG  | Expense form open                    | 1. Enter ₹15,000 2. Do not attach receipt 3. Submit                 | Error: "Receipt required for claims above ₹10,000"           |

---

# Module 5 — Receipt Upload & Storage (FR-005)

**KPI Link:** Audit Readiness Score ≥ 95%; Expense Accuracy ≥ 98%
**Priority:** 🔴 P1

| TC ID       | Test Name                               | Type    | Precondition              | Steps                                                            | Expected Result                                            |
| ----------- | --------------------------------------- | ------- | ------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| TC-RCP-001  | Upload JPEG receipt                     | ✅ POS   | Expense form open         | 1. Tap Upload 2. Select JPEG file < 10MB                         | File uploaded; thumbnail shown; URL stored                 |
| TC-RCP-002  | Upload PNG receipt                      | ✅ POS   | Expense form open         | 1. Tap Upload 2. Select PNG file < 10MB                          | File uploaded successfully                                 |
| TC-RCP-003  | Upload PDF receipt                      | ✅ POS   | Expense form open         | 1. Tap Upload 2. Select PDF file < 10MB                          | File uploaded; PDF preview icon shown                      |
| TC-RCP-004  | Receipt attached to correct expense item | ✅ POS  | Multiple items in claim   | 1. Add two items 2. Attach different receipt to each             | Each item shows its own receipt correctly                  |
| TC-RCP-005  | Upload file exceeding 10MB              | ❌ NEG   | File > 10MB prepared      | 1. Tap Upload 2. Select 12MB file                                | Error: "File must not exceed 10MB"                         |
| TC-RCP-006  | Upload unsupported file type (.docx)    | ❌ NEG   | .docx file prepared       | 1. Tap Upload 2. Select .docx file                               | Error: "Only PDF, JPG, PNG files are supported"            |
| TC-RCP-007  | Upload executable file (.exe)           | ❌ NEG   | .exe file prepared        | 1. Tap Upload 2. Select .exe file                                | Error: "Only PDF, JPG, PNG files are supported"            |
| TC-RCP-008  | Upload fails due to network drop        | ❌ NEG   | Network disconnects mid-upload | 1. Select file 2. Simulate network drop during upload       | Error shown; auto-retry up to 3 times; user informed       |
| TC-RCP-009  | File exactly 10MB is accepted           | ⚠️ EDGE  | File = exactly 10MB       | 1. Tap Upload 2. Select 10MB file                                | File accepted and uploaded successfully                    |
| TC-RCP-010  | Upload same receipt to two items        | ⚠️ EDGE  | Duplicate receipt          | 1. Upload same file to two different expense items               | System warns: "Same receipt attached to multiple items"    |
| TC-RCP-011  | Auto-retry on transient network error   | ⚠️ EDGE  | Network briefly fails      | 1. Upload file 2. Network fails and recovers in 5 seconds        | Upload retries automatically; succeeds on retry            |

---

# Module 6 — Policy Validation Engine (FR-006)

**KPI Link:** Policy Compliance Rate ≥ 98%; Policy Violation Rate < 2%
**Priority:** 🔴 P1

| TC ID       | Test Name                                         | Type    | Precondition                              | Steps                                                                  | Expected Result                                               |
| ----------- | ------------------------------------------------- | ------- | ----------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| TC-POL-001  | Compliant expense passes policy check             | ✅ POS   | Policy: meals ≤ ₹500                      | 1. Submit ₹400 meal expense 2. Trigger validation                      | Validation passes; no violation flagged                       |
| TC-POL-002  | Policy violation blocked at submission            | ❌ NEG   | Policy: meals ≤ ₹500                      | 1. Submit ₹600 meal expense 2. Tap Submit                              | Submission blocked; Error: "Exceeds meal policy limit of ₹500"|
| TC-POL-003  | Policy violation flagged on accommodation         | ❌ NEG   | Policy: accommodation ≤ ₹5,000/night      | 1. Submit ₹7,000 accommodation expense 2. Tap Submit                   | Violation flagged: "Exceeds accommodation limit"              |
| TC-POL-004  | Claim above ₹10,000 without receipt blocked       | ❌ NEG   | Policy requires receipt > ₹10,000         | 1. Submit ₹12,000 claim without receipt                                | Blocked: "Receipt required for claims above ₹10,000"         |
| TC-POL-005  | Multiple violations flagged simultaneously        | ❌ NEG   | Multiple policy rules active              | 1. Submit claim violating both meal and accommodation limits            | Both violations listed before submission is blocked           |
| TC-POL-006  | Unresolved violation blocks submission            | ❌ NEG   | Open violation exists                     | 1. Violation flagged 2. Attempt submit without resolving               | Submission blocked: "Resolve policy violations before submitting" |
| TC-POL-007  | Violation acknowledged + justified — submission allowed | ✅ POS | Violation flagged; justification required | 1. Provide business justification for violation 2. Submit with escalation | Claim submitted for escalated review                     |
| TC-POL-008  | Overlapping policies — stricter rule applies      | ⚠️ EDGE  | Two active policies with different limits | 1. Submit claim that violates stricter policy but not relaxed one       | Stricter rule enforced; violation flagged                     |
| TC-POL-009  | Policy update mid-claim affects new submissions   | ⚠️ EDGE  | Policy limit changed during workflow      | 1. Admin updates policy limit 2. Employee submits new claim             | New limit applied to new submissions; old claims unaffected   |
| TC-POL-010  | Expense at exact policy boundary                  | ⚠️ EDGE  | Policy: meals ≤ ₹500                      | 1. Submit ₹500 meal expense                                            | Accepted; no violation flagged                                |

---

# Module 7 — Reimbursement Tracking (FR-007)

**KPI Link:** Average Reimbursement Time < 3 Days; Employee Satisfaction ≥ 4.5/5
**Priority:** 🔴 P1

| TC ID       | Test Name                                     | Type    | Precondition                       | Steps                                                          | Expected Result                                             |
| ----------- | --------------------------------------------- | ------- | ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| TC-RMB-001  | View reimbursement status after approval      | ✅ POS   | Claim fully approved               | 1. Open Reimbursement Tracker 2. Find approved claim           | Status = Processing Payment                                 |
| TC-RMB-002  | Status updates to Paid after ERP confirmation | ✅ POS   | ERP processes payment              | 1. ERP sends payment confirmation 2. Open tracker              | Status = Paid; payment date displayed                       |
| TC-RMB-003  | View reimbursement timeline steps             | ✅ POS   | Claim in any status                | 1. Open claim detail 2. View timeline                          | All stages shown: Submitted → Approved → Processing → Paid  |
| TC-RMB-004  | Reimbursement status for non-existent claim   | ❌ NEG   | Invalid claim ID entered           | 1. Navigate to tracker with invalid ID                         | Error: "Claim not found"                                    |
| TC-RMB-005  | View reimbursement of rejected claim          | ❌ NEG   | Claim is rejected                  | 1. Open rejected claim tracker                                 | Status = Rejected; rejection reason shown; no payment info  |
| TC-RMB-006  | ERP payment failure — status not marked Paid  | ⚠️ EDGE  | ERP returns error                  | 1. Finance approves 2. ERP API fails                           | Status = Payment Failed; Finance team alerted; not Paid     |
| TC-RMB-007  | Real-time status update without manual refresh | ⚠️ EDGE | Tracker open; ERP confirms payment | 1. Keep tracker open 2. ERP confirms payment in background     | Status updates automatically without page refresh           |
| TC-RMB-008  | Reimbursement tracker accessible offline      | ⚠️ EDGE  | Device offline                     | 1. Open tracker while offline                                  | Last cached status shown with "Offline" indicator           |

---

# Module 8 — Push Notifications & Alerts (FR-008)

**KPI Link:** SLA Compliance ≥ 95%; Employee Satisfaction ≥ 4.5/5
**Priority:** 🟠 P2

| TC ID       | Test Name                                          | Type    | Precondition                              | Steps                                                       | Expected Result                                                |
| ----------- | -------------------------------------------------- | ------- | ----------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| TC-NOT-001  | Push notification on travel request submission     | ✅ POS   | Manager has notifications enabled         | 1. Employee submits request                                 | Manager receives push: "New travel request pending approval"   |
| TC-NOT-002  | Push notification on approval                      | ✅ POS   | Employee has notifications enabled        | 1. Manager approves request                                 | Employee receives: "Your travel request was approved"          |
| TC-NOT-003  | Push notification on rejection                     | ✅ POS   | Employee has notifications enabled        | 1. Manager rejects request with reason                      | Employee receives: "Your travel request was rejected: [reason]"|
| TC-NOT-004  | Push notification on payment processed             | ✅ POS   | Employee has notifications enabled        | 1. ERP confirms payment                                     | Employee receives: "Your reimbursement of ₹X has been processed"|
| TC-NOT-005  | SLA warning to approver 2 hours before breach      | ✅ POS   | Request pending; 6 hours elapsed          | 1. SLA timer triggers at 6-hour mark                        | Approver receives: "Action required: Approval due in 2 hours"  |
| TC-NOT-006  | Notification not sent when user opts out           | ❌ NEG   | User disabled approval notifications      | 1. Employee submits request                                 | No notification sent to opted-out manager                      |
| TC-NOT-007  | Notification failure does not block workflow       | ⚠️ EDGE  | Notification service unavailable          | 1. Submit request 2. Notification service down              | Workflow completes; notification failure logged silently        |
| TC-NOT-008  | Notification center shows all unread alerts        | ✅ POS   | 5 unread notifications exist              | 1. Open Notification Center                                 | All 5 unread notifications shown; badge count = 5              |
| TC-NOT-009  | Mark notification as read                          | ✅ POS   | Unread notification exists                | 1. Tap notification                                         | Notification marked read; badge count decreases by 1           |
| TC-NOT-010  | No duplicate notifications for same event          | ⚠️ EDGE  | Event fires twice (retry scenario)        | 1. Approval event sent twice due to retry                   | Only one notification delivered; duplicates deduplicated       |

---

# Module 9 — Employee Dashboard (FR-009)

**KPI Link:** System Adoption Rate ≥ 90%; Satisfaction Score ≥ 4.5/5
**Priority:** 🔴 P1

| TC ID       | Test Name                                     | Type    | Precondition                          | Steps                                           | Expected Result                                            |
| ----------- | --------------------------------------------- | ------- | ------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| TC-DSH-001  | Dashboard loads with correct summary data     | ✅ POS   | Employee has requests and claims      | 1. Login as Employee 2. View dashboard          | Pending requests, active claims, reimbursement cards shown |
| TC-DSH-002  | Tap pending request card navigates to detail  | ✅ POS   | Pending request exists                | 1. Tap pending request card                     | Opens travel request detail page                           |
| TC-DSH-003  | Quick action — New Travel Request navigates to form | ✅ POS | Dashboard loaded                 | 1. Tap New Travel Request button                | Travel request form opens                                  |
| TC-DSH-004  | Quick action — Submit Expense navigates to form | ✅ POS | Dashboard loaded                   | 1. Tap Submit Expense button                    | Expense submission form opens                              |
| TC-DSH-005  | Dashboard shows empty state when no activity  | ✅ POS   | New employee with no history          | 1. Login as new employee 2. View dashboard      | Empty state with prompt to submit first travel request     |
| TC-DSH-006  | Dashboard shows API error state gracefully    | ❌ NEG   | Backend API unavailable               | 1. Login 2. Dashboard data fetch fails          | Error card: "Unable to load data. Tap to retry"            |
| TC-DSH-007  | Dashboard data refreshes on pull-to-refresh   | ✅ POS   | Dashboard loaded with stale data      | 1. Pull down to refresh                         | Data refreshes; updated counts shown                       |
| TC-DSH-008  | Role-based dashboard — Manager sees team view | ✅ POS   | Logged in as Manager                  | 1. Login as Manager 2. View dashboard           | Manager dashboard shows team travel summary + approval queue|
| TC-DSH-009  | Dashboard renders correctly at 2x text scale  | ⚠️ EDGE  | Device accessibility font size = 2x   | 1. Set font scale to 2x 2. Open dashboard       | No overflow or clipped elements; all content readable      |

---

# Module 10 — Manager Approval Console (FR-010)

**KPI Link:** SLA Compliance ≥ 95%; Approval Time < 1 Day
**Priority:** 🔴 P1

| TC ID       | Test Name                                         | Type    | Precondition                       | Steps                                                     | Expected Result                                              |
| ----------- | ------------------------------------------------- | ------- | ---------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| TC-MGR-001  | Approval queue shows all pending items            | ✅ POS   | 5 requests pending for Manager     | 1. Login as Manager 2. Open Approval Queue                | 5 pending cards displayed                                    |
| TC-MGR-002  | View request context before approving             | ✅ POS   | Pending request in queue           | 1. Tap request card 2. View detail                        | Full request context shown: purpose, dates, amount, history  |
| TC-MGR-003  | One-tap approval from queue                       | ✅ POS   | Pending request in queue           | 1. Tap Quick Approve button on card                       | Approved immediately; card removed from queue                |
| TC-MGR-004  | Filter queue by status                            | ✅ POS   | Multiple statuses in queue         | 1. Apply filter: Pending L1 only                          | Only L1 pending items shown                                  |
| TC-MGR-005  | Empty approval queue shows zero-state             | ✅ POS   | No pending approvals               | 1. Login as Manager 2. Open queue                         | Empty state: "No pending approvals"                          |
| TC-MGR-006  | Approve expired / cancelled request               | ❌ NEG   | Request was cancelled by employee  | 1. Manager opens cancelled request 2. Taps Approve        | Error: "This request is no longer pending approval"          |
| TC-MGR-007  | Queue badge shows correct unread count            | ✅ POS   | Manager has 3 new requests         | 1. Login as Manager                                       | Badge on Approval Queue tab shows "3"                        |
| TC-MGR-008  | Queue updates in real-time when new request comes | ⚠️ EDGE | Manager has queue open             | 1. Employee submits new request while manager views queue | New card appears in queue without manual refresh             |

---

# Module 11 — Finance Review Module (FR-011)

**KPI Link:** Expense Processing Time ≤ 2 Days; Cost Per Claim ≤ ₹40
**Priority:** 🔴 P1

| TC ID       | Test Name                                       | Type    | Precondition                        | Steps                                                          | Expected Result                                               |
| ----------- | ----------------------------------------------- | ------- | ----------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| TC-FIN-001  | Finance approves expense claim                  | ✅ POS   | Claim pending Finance review        | 1. Login as Finance 2. Open claim 3. Tap Approve               | Status = Approved for Payment; ERP initiation triggered       |
| TC-FIN-002  | Finance rejects claim with reason               | ✅ POS   | Claim pending Finance review        | 1. Login as Finance 2. Tap Reject 3. Enter reason 4. Confirm   | Status = Rejected; Employee notified with reason              |
| TC-FIN-003  | ERP payment initiation after finance approval   | ✅ POS   | Finance approves claim              | 1. Approve claim                                               | ERP API called; payment initiated; audit log entry created    |
| TC-FIN-004  | Finance queue shows all pending claims          | ✅ POS   | 10 claims pending                   | 1. Login as Finance 2. Open queue                              | All 10 claims shown with claim amount and submitter details   |
| TC-FIN-005  | Finance rejects without entering reason         | ❌ NEG   | Rejection dialog open               | 1. Tap Reject 2. Leave reason empty 3. Confirm                 | Error: "Reason for rejection is required"                     |
| TC-FIN-006  | Employee role accesses Finance module           | ❌ NEG   | Logged in as Employee               | 1. Navigate to /finance URL directly                           | Access denied; redirected to Employee Dashboard               |
| TC-FIN-007  | ERP API failure — claim not marked Paid         | ⚠️ EDGE  | ERP returns 500 error               | 1. Finance approves 2. ERP call fails                          | Status = Payment Pending; Finance alerted; not marked as Paid |
| TC-FIN-008  | Batch approval of multiple claims               | ⚠️ EDGE  | 20 claims pending                   | 1. Select all claims 2. Tap Batch Approve                      | All 20 claims approved; ERP initiated for each                |
| TC-FIN-009  | Finance views claim receipt                     | ✅ POS   | Claim has receipt attached          | 1. Open claim detail 2. Tap View Receipt                       | Receipt opens in full-screen viewer                           |

---

# Module 12 — Audit Log & Trail (FR-012)

**KPI Link:** Audit Readiness Score ≥ 95%
**Priority:** 🔴 P1

| TC ID       | Test Name                                          | Type    | Precondition                      | Steps                                                        | Expected Result                                                |
| ----------- | -------------------------------------------------- | ------- | --------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| TC-AUD-001  | Audit log entry created on travel request submission | ✅ POS  | Employee submits request          | 1. Submit request 2. Open audit log for request              | Entry: Submitted · Actor: Employee · Timestamp: [accurate]     |
| TC-AUD-002  | Audit log entry on approval action                 | ✅ POS   | Manager approves request          | 1. Approve request 2. View audit log                         | Entry: Approved · Actor: Manager · Timestamp shown             |
| TC-AUD-003  | Audit log entry on rejection with reason           | ✅ POS   | Finance rejects claim             | 1. Reject claim with reason 2. View audit log                | Entry: Rejected · Reason: [text] · Actor: Finance · Timestamp  |
| TC-AUD-004  | Audit log entry on reimbursement payment           | ✅ POS   | ERP confirms payment              | 1. Payment confirmed 2. View audit log                       | Entry: Payment Processed · Amount · Timestamp · ERP Reference  |
| TC-AUD-005  | Audit log entry cannot be modified                 | ❌ NEG   | Audit entry exists                | 1. Attempt to edit audit log entry via API                   | Operation blocked; error: "Audit records are immutable"        |
| TC-AUD-006  | Audit log entry cannot be deleted                  | ❌ NEG   | Audit entry exists                | 1. Attempt to delete audit log entry via API                 | Operation blocked; error: "Audit records cannot be deleted"    |
| TC-AUD-007  | Audit log shows complete chronological trail       | ✅ POS   | Request went through full workflow| 1. Open request 2. View full audit trail                     | All stages shown in correct chronological order                |
| TC-AUD-008  | Audit log export for compliance                    | ✅ POS   | Compliance Officer logged in      | 1. Open audit log 2. Tap Export 3. Select PDF                | PDF generated with complete audit trail                        |
| TC-AUD-009  | Audit log records impersonation actions            | ⚠️ EDGE  | Admin acts on behalf of Manager   | 1. Admin impersonates Manager 2. Approves request            | Log entry shows: Actor = Admin · On Behalf Of = Manager        |
| TC-AUD-010  | Audit log retained for 7 years                     | ⚠️ EDGE  | Record is 6.9 years old           | 1. Query record created 6.9 years ago                        | Record found and accessible                                    |
| TC-AUD-011  | Audit log purged after 7 years + 1 day             | ⚠️ EDGE  | Record is exactly 7 years + 1 day old | 1. Query record older than 7 years                       | Record not found or archived per retention policy              |

---

# Non-Functional Test Cases

## NFR-1 — Performance

| TC ID        | Test Name                              | Type    | Threshold      | Test Method                                    |
| ------------ | -------------------------------------- | ------- | -------------- | ---------------------------------------------- |
| TC-NFR-P-001 | App launch completes within 3 seconds  | ⚠️ EDGE  | ≤ 3,000 ms     | Stopwatch from cold launch to first frame      |
| TC-NFR-P-002 | API response under 2 seconds           | ⚠️ EDGE  | P95 ≤ 2,000 ms | Measure API call duration under normal load    |
| TC-NFR-P-003 | Analytics dashboard loads within 5s    | ⚠️ EDGE  | ≤ 5,000 ms     | Widget test with mocked analytics fetch        |
| TC-NFR-P-004 | Receipt upload completes within 5s     | ⚠️ EDGE  | ≤ 5,000 ms     | Integration test with 10MB file upload         |

## NFR-2 — Scalability

| TC ID        | Test Name                               | Type    | Threshold                  | Test Method                                   |
| ------------ | --------------------------------------- | ------- | -------------------------- | --------------------------------------------- |
| TC-NFR-S-001 | System supports 10,000 concurrent users | ⚠️ EDGE  | No degradation             | Load test at 150% projected peak              |
| TC-NFR-S-002 | 100,000 transactions processed per month| ⚠️ EDGE  | No data loss or slowdown   | Batch test simulation                         |
| TC-NFR-S-003 | List renders 10,000 items without jank  | ⚠️ EDGE  | Smooth scroll; 60 FPS      | Widget test with 10,000 mock records          |

## NFR-3 — Security

| TC ID        | Test Name                                  | Type    | Expected Result                                          |
| ------------ | ------------------------------------------ | ------- | -------------------------------------------------------- |
| TC-NFR-SEC-001 | Auth token stored in secure storage       | ✅ POS   | Token in FlutterSecureStorage; NOT in SharedPreferences  |
| TC-NFR-SEC-002 | Unauthorized route access blocked by RBAC | ❌ NEG   | Route guard redirects unauthorized roles                 |
| TC-NFR-SEC-003 | Session expires after 30 min idle         | ⚠️ EDGE  | Auto-logout triggers; user redirected to login           |
| TC-NFR-SEC-004 | No PII or token visible in application logs | ❌ NEG  | Log scan returns no sensitive data                       |
| TC-NFR-SEC-005 | API calls use TLS 1.3 encryption           | ✅ POS   | Network inspection confirms HTTPS; no plain HTTP calls   |

## NFR-4 — Accessibility

| TC ID        | Test Name                                     | Type    | Expected Result                                         |
| ------------ | --------------------------------------------- | ------- | ------------------------------------------------------- |
| TC-NFR-A-001 | All buttons have semantic labels              | ✅ POS   | `find.bySemanticsLabel` matches every interactive button|
| TC-NFR-A-002 | UI renders correctly at 2x font scale         | ⚠️ EDGE  | No overflow, clipping, or illegible text                |
| TC-NFR-A-003 | Color contrast ratio ≥ 4.5:1 on all text      | ✅ POS   | WCAG 2.1 AA compliant; verified via audit               |
| TC-NFR-A-004 | VoiceOver / TalkBack reads form fields        | ✅ POS   | Screen reader announces field labels and error messages |

## NFR-5 — Reliability

| TC ID        | Test Name                                      | Type    | Expected Result                                         |
| ------------ | ---------------------------------------------- | ------- | ------------------------------------------------------- |
| TC-NFR-R-001 | System achieves 99.9% uptime                   | ✅ POS   | Monitoring confirms ≤ 8.7 hours downtime per year       |
| TC-NFR-R-002 | Auto-retry handles transient API failures      | ⚠️ EDGE  | Workflow completes after transient failure + retry      |
| TC-NFR-R-003 | App recovers gracefully from crash             | ⚠️ EDGE  | No data loss; user redirected to last stable state      |

---

# Validation Rules Summary

| Rule ID | Field            | Rule                                    | Error Message                                    | TC Reference   |
| ------- | ---------------- | --------------------------------------- | ------------------------------------------------ | -------------- |
| VR-001  | Destination      | Required; non-empty                     | "Destination is required"                        | TC-TR-005      |
| VR-002  | Start Date       | Required; ≥ today                       | "Start date cannot be in the past"               | TC-TR-006      |
| VR-003  | End Date         | Required; > start date                  | "End date must be after start date"              | TC-TR-007      |
| VR-004  | Trip Duration    | ≤ 90 days                               | "Trip duration cannot exceed 90 days"            | TC-TR-011      |
| VR-005  | Cost Center      | Required; valid HRMS code               | "Cost center is required"                        | TC-TR-008      |
| VR-006  | Expense Amount   | Required; > 0                           | "Amount must be greater than zero"               | TC-EXP-005     |
| VR-007  | Expense Category | Required; from predefined list          | "Expense category is required"                   | TC-EXP-007     |
| VR-008  | Expense Date     | Required; ≤ today                       | "Expense date cannot be in the future"           | TC-EXP-008     |
| VR-009  | Receipt          | Required when amount > ₹10,000          | "Receipt required for claims above ₹10,000"     | TC-EXP-014     |
| VR-010  | Receipt Size     | ≤ 10MB                                  | "File must not exceed 10MB"                      | TC-RCP-005     |
| VR-011  | Receipt Type     | PDF, JPG, PNG only                      | "Only PDF, JPG, PNG files are supported"         | TC-RCP-006     |
| VR-012  | Rejection Reason | Required on reject action               | "Rejection reason is required"                   | TC-APR-005     |
| VR-013  | Policy Limit     | Amount ≤ category policy limit          | "Amount exceeds policy limit for [category]"     | TC-POL-002     |
| VR-014  | Duplicate Claim  | No identical claim (date + cat + amount)| "Duplicate claim detected"                       | TC-EXP-009     |
| VR-015  | SSO Token        | Present and non-expired                 | "Session expired. Please login again"            | TC-AUTH-005    |
| VR-016  | Self-Approval    | Approver ≠ Requester                    | "Self-approval is not permitted"                 | TC-APR-006     |
| VR-017  | Re-submission    | Within 7 days of rejection              | "Re-submission window of 7 days has expired"     | TC-EXP-013     |

---

# Coverage Goals

| Module                  | Unit  | Widget | Integration | Target   |
| ----------------------- | ----- | ------ | ----------- | -------- |
| Authentication          | 95%   | 85%    | ✅ Required  | 90%+     |
| Travel Request          | 90%   | 80%    | ✅ Required  | 85%+     |
| Approval Workflow       | 90%   | 80%    | ✅ Required  | 85%+     |
| Expense Submission      | 95%   | 85%    | ✅ Required  | 90%+     |
| Receipt Upload          | 90%   | 80%    | ✅ Required  | 85%+     |
| Policy Validation       | 100%  | 75%    | ✅ Required  | 90%+     |
| Reimbursement Tracking  | 90%   | 80%    | ✅ Required  | 85%+     |
| Notifications           | 85%   | 75%    | ✅ Required  | 80%+     |
| Dashboard               | 80%   | 85%    | ✅ Required  | 80%+     |
| Manager Console         | 85%   | 85%    | ✅ Required  | 85%+     |
| Finance Module          | 90%   | 80%    | ✅ Required  | 85%+     |
| Audit Log               | 95%   | 75%    | ✅ Required  | 85%+     |
| **Overall**             | **90%** | **80%** | **100% flows** | **≥ 85%** |

---

# Definition of Done

## Test Case Level

- [ ] Test case ID and name follow convention: `TC-[MODULE]-[###]`
- [ ] Precondition clearly defined and reproducible
- [ ] Steps are atomic and unambiguous
- [ ] Expected result is measurable and verifiable
- [ ] Linked to at least one FR, KPI, or validation rule
- [ ] Reviewed and signed off by QA Lead

## Feature Level

- [ ] All positive, negative, and edge cases for the feature are documented and executed
- [ ] All validation rules for the feature pass with zero failures
- [ ] Unit coverage ≥ 85%; widget coverage ≥ 80%
- [ ] Integration test for end-to-end flow passes
- [ ] Zero open P1 / P2 defects
- [ ] UAT sign-off received from Product Owner

## Project Level

- [ ] All 12 FR modules fully tested (TC-AUTH through TC-AUD)
- [ ] All 17 validation rules verified
- [ ] All NFR thresholds met (performance, security, accessibility, reliability)
- [ ] Overall code coverage ≥ 85%
- [ ] CI/CD pipeline runs all tests in ≤ 10 minutes
- [ ] Test results reviewed and signed off by QA Architect
- [ ] Zero open critical or high defects

---

*All test cases in this document are derived directly from `kpi.md` (KPI targets, baselines, and compliance thresholds) and `prd.md` (functional requirements FR-001 to FR-012, acceptance criteria, non-functional requirements, and validation rules). No assumptions have been made.*
