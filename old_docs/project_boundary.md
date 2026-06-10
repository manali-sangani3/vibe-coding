# Project Boundary Document

### Given Prompt
kpi.md, prd.md and project_scope.md by refering this create project_boundary.md which consists the overall summary of my project with directory/folder structure.
 
### Output

## Enterprise Employee Travel & Expense Management System

**Version:** 1.0
**Document Owner:** Product Management Team
**Target Platform:** Flutter (iOS, Android, Web)
**Organization Size:** 10,000+ Employees
**Document Date:** June 2026
**Reference Documents:** kpi.md · prd.md · project_scope.md

---

# 1. Project Summary

## 1.1 One-Line Definition

A **cross-platform Flutter application** that digitizes and automates the complete employee travel request, expense submission, multi-level approval, policy compliance, and reimbursement lifecycle for an enterprise of 10,000+ employees.

---

## 1.2 What This Project Is

| Dimension       | Description                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Product Type**| B2E (Business-to-Employee) Mobile & Web Application                                             |
| **Platform**    | Flutter — iOS · Android · Web                                                                    |
| **Audience**    | Employees, Managers, Finance Team, Compliance Team, Admin                                        |
| **Core Purpose**| Replace manual email/Excel-based travel & expense workflows with a fully automated digital system |
| **Architecture**| Clean Architecture · Feature-first Modularization · Repository Pattern                          |
| **State Mgmt**  | Riverpod                                                                                         |
| **DI**          | GetIt                                                                                            |
| **Backend**     | REST APIs · OAuth2 · ERP Integration · HRMS Integration                                         |

---

## 1.3 Business Problem Being Solved

The organization of 10,000+ employees currently manages all travel and expense operations through **emails, Excel sheets, phone calls, and paper forms**. This results in:

- Average travel approval time of **5 days** (target: < 1 day)
- Average reimbursement cycle of **15 days** (target: < 3 days)
- Policy compliance rate of only **70%** (target: ≥ 98%)
- Manual intervention required in **75% of cases** (target: < 10%)
- Employee satisfaction score of **3.1 / 5** (target: ≥ 4.5 / 5)

---

## 1.4 Key Outcomes Expected

| Outcome Area          | Before   | After Target  |
| --------------------- | -------- | ------------- |
| Approval Time         | 5 Days   | < 1 Day       |
| Reimbursement Time    | 15 Days  | < 3 Days      |
| Policy Compliance     | 70%      | ≥ 98%         |
| Manual Intervention   | 75%      | < 10%         |
| System Adoption       | 0%       | ≥ 90%         |
| Employee Satisfaction | 3.1 / 5  | ≥ 4.5 / 5     |
| Cost Per Claim        | ₹ 150    | ≤ ₹ 40        |
| Automation Rate       | 10%      | ≥ 95%         |

---

## 1.5 Release Phases

| Phase    | Scope                                                              | Status         |
| -------- | ------------------------------------------------------------------ | -------------- |
| MVP      | Auth, Travel Request, Approval Workflow, Expense, Reimbursement    | In Scope       |
| Phase 2  | Analytics, OCR, Booking Integration, Budget Controls, Offline Mode | Planned        |
| Future   | AI Categorization, Fraud Detection, Chatbot, Predictive Analytics  | Out of Scope   |

---

# 2. Project Boundary

## 2.1 System Boundary Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  ENTERPRISE T&E MANAGEMENT SYSTEM (IN SCOPE)                │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Employee   │  │   Manager   │  │   Finance    │  │   Compliance /   │  │
│  │   Module    │  │   Console   │  │   Module     │  │   Admin Module   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                │                │                    │            │
│  ┌──────▼────────────────▼────────────────▼────────────────────▼──────────┐ │
│  │                    Core Application Layer                               │ │
│  │   Travel Request · Approval Workflow · Expense · Policy Validation     │ │
│  │   Reimbursement Tracking · Notifications · Audit Logs · Dashboard      │ │
│  └──────────────────────────────────┬──────────────────────────────────────┘ │
│                                     │ REST APIs / OAuth2                     │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
  ┌──────▼──────┐            ┌────────▼───────┐           ┌───────▼────────┐
  │    HRMS     │            │   ERP/Finance  │           │  SSO Provider  │
  │ (Existing)  │            │   (Existing)   │           │  (Existing)    │
  └─────────────┘            └────────────────┘           └────────────────┘
      [API Consume Only]        [API Consume Only]           [API Consume Only]
```

---

## 2.2 In-Boundary (What Is Built)

| Area                        | Included Components                                                          |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Authentication**          | SSO login, RBAC, session management                                          |
| **Travel Request**          | Submission, history, status tracking                                         |
| **Approval Workflow**       | Multi-level routing, SLA timers, escalation, approve/reject                 |
| **Expense Submission**      | Itemized claims, category-based entry, policy pre-check                      |
| **Receipt Management**      | Upload, storage, attachment per claim line item                              |
| **Policy Validation Engine**| Rule-based auto-check, violation flagging, submission blocking               |
| **Reimbursement Tracking**  | Real-time status from approval → ERP → payment confirmation                  |
| **Notification System**     | Push, email, and in-app alerts for all workflow events                       |
| **Employee Dashboard**      | My requests, claims, reimbursements, quick actions                           |
| **Manager Console**         | Approval queue, team travel view, 1-tap actions                              |
| **Finance Module**          | Claim validation, ERP payment initiation, rejection with reason              |
| **Audit Log**               | Immutable timestamped trail for every action                                 |
| **Admin Panel**             | Policy config, approval hierarchy, roles, notification settings              |

---

## 2.3 Out-of-Boundary (What Is NOT Built)

| Item                                 | Reason                                                   |
| ------------------------------------ | -------------------------------------------------------- |
| ERP / Finance System                 | Existing system; integration only via APIs               |
| HRMS System                          | Existing system; employee data consumed via APIs         |
| SSO / Identity Provider              | Existing infra; integrated via OAuth2 / SAML             |
| Payroll Processing                   | Ends at ERP payment confirmation                         |
| International Travel Policies        | Domestic scope only for all phases                       |
| Contractor / Vendor Expense Submission| Full-time employees only in MVP                         |
| Corporate Credit Card Reconciliation | Post-MVP evaluation                                      |
| Visa / Travel Document Management    | Not in any committed phase                               |
| AI / ML Features (Chatbot, Fraud)    | Future enhancement only                                  |
| Booking Vendor Backend               | Phase 2 integration only; vendor system is external      |

---

# 3. User Roles & Access Boundary

| Role                 | Module Access                                                        | Can Approve | Decision Maker |
| -------------------- | -------------------------------------------------------------------- | ----------- | -------------- |
| **Employee**         | Dashboard · Travel Request · Expense Submission · Reimbursement View | No          | No             |
| **Manager**          | Manager Console · Employee travel visibility · Approval actions      | Yes (L1)    | Yes            |
| **Department Head**  | Team-level view · Approval actions                                   | Yes (L2)    | Yes            |
| **Finance Executive**| Finance Module · Claim review · ERP initiation                       | Yes (L3)    | Yes            |
| **Compliance Officer**| Policy Engine config · Compliance reports · Audit logs              | No          | Yes            |
| **Admin**            | Full system config · User roles · Policy rules · Notification setup  | No          | Yes            |
| **Executive/Leadership**| Analytics dashboard · KPI reports · Read-only                   | No          | Yes            |

---

# 4. Integration Boundary

| External System       | Integration Type    | Data Exchanged                              | Owner               |
| --------------------- | ------------------- | ------------------------------------------- | ------------------- |
| **HRMS**              | REST API (consume)  | Employee profiles, hierarchy, org structure | HR Team             |
| **ERP / Finance**     | REST API (consume)  | Payment initiation, reimbursement status    | Finance Team        |
| **SSO Provider**      | OAuth2 / SAML 2.0   | Authentication tokens, user identity        | IT Team             |
| **Push Notification** | FCM / APNs          | Notification delivery                       | Infrastructure Team |
| **Email Service**     | SMTP / API          | Email alerts and digests                    | Infrastructure Team |
| **Analytics Platform**| SDK / API           | Funnel metrics, adoption, SLA data          | Product / IT Team   |
| **File Storage**      | Cloud Storage API   | Receipt uploads, document storage           | IT Team             |
| **OCR Service** *(P2)*| REST API (consume)  | Receipt data extraction                     | Product Team        |
| **Booking Vendor** *(P2)*| REST API (consume)| Flight/hotel booking tied to travel requests| Product Team       |

---

# 5. Project Folder / Directory Structure

```
travel_expense_app/
│
├── android/                          # Android native project files
├── ios/                              # iOS native project files
├── web/                              # Web platform entry files
│
├── lib/
│   │
│   ├── main.dart                     # App entry point
│   ├── app.dart                      # Root widget, router init, DI setup
│   │
│   ├── core/                         # Shared core utilities (no feature logic)
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   ├── api_endpoints.dart
│   │   │   └── app_strings.dart
│   │   ├── errors/
│   │   │   ├── failures.dart
│   │   │   └── exceptions.dart
│   │   ├── network/
│   │   │   ├── api_client.dart       # Dio/HTTP client setup
│   │   │   ├── network_info.dart
│   │   │   └── interceptors/
│   │   │       ├── auth_interceptor.dart
│   │   │       └── logging_interceptor.dart
│   │   ├── storage/
│   │   │   ├── local_storage.dart    # SharedPrefs / Hive wrapper
│   │   │   └── secure_storage.dart   # FlutterSecureStorage wrapper
│   │   ├── theme/
│   │   │   ├── app_theme.dart
│   │   │   ├── app_colors.dart
│   │   │   ├── app_typography.dart
│   │   │   └── app_spacing.dart
│   │   ├── router/
│   │   │   ├── app_router.dart       # GoRouter / AutoRoute config
│   │   │   └── route_guards.dart     # Auth & role-based route guards
│   │   ├── di/
│   │   │   └── injection_container.dart  # GetIt service locator setup
│   │   └── utils/
│   │       ├── date_utils.dart
│   │       ├── currency_utils.dart
│   │       ├── validators.dart
│   │       └── extensions.dart
│   │
│   ├── features/                     # Feature-first modular structure
│   │   │
│   │   ├── auth/                     # FR-001 — Authentication & SSO
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── auth_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── user_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── auth_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── user_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── auth_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── login_usecase.dart
│   │   │   │       ├── logout_usecase.dart
│   │   │   │       └── get_current_user_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── auth_provider.dart
│   │   │       ├── pages/
│   │   │       │   └── login_page.dart
│   │   │       └── widgets/
│   │   │           └── sso_button_widget.dart
│   │   │
│   │   ├── dashboard/                # FR-009 — Employee Dashboard
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── dashboard_provider.dart
│   │   │       ├── pages/
│   │   │       │   └── dashboard_page.dart
│   │   │       └── widgets/
│   │   │           ├── summary_card_widget.dart
│   │   │           ├── pending_actions_widget.dart
│   │   │           └── recent_activity_widget.dart
│   │   │
│   │   ├── travel_request/           # FR-002 — Travel Request Submission
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── travel_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── travel_request_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── travel_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── travel_request_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── travel_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── submit_travel_request_usecase.dart
│   │   │   │       ├── get_travel_requests_usecase.dart
│   │   │   │       └── cancel_travel_request_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── travel_request_provider.dart
│   │   │       ├── pages/
│   │   │       │   ├── travel_request_list_page.dart
│   │   │       │   ├── travel_request_form_page.dart
│   │   │       │   └── travel_request_detail_page.dart
│   │   │       └── widgets/
│   │   │           ├── travel_request_card.dart
│   │   │           └── travel_status_badge.dart
│   │   │
│   │   ├── approval/                 # FR-003 — Multi-Level Approval Workflow
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── approval_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── approval_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── approval_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── approval_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── approval_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── approve_request_usecase.dart
│   │   │   │       ├── reject_request_usecase.dart
│   │   │   │       └── get_pending_approvals_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── approval_provider.dart
│   │   │       ├── pages/
│   │   │       │   ├── approval_queue_page.dart
│   │   │       │   └── approval_detail_page.dart
│   │   │       └── widgets/
│   │   │           ├── approval_card_widget.dart
│   │   │           ├── approval_action_sheet.dart
│   │   │           └── sla_timer_widget.dart
│   │   │
│   │   ├── expense/                  # FR-004, FR-005 — Expense Submission & Receipts
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   ├── expense_remote_datasource.dart
│   │   │   │   │   └── receipt_upload_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   ├── expense_claim_model.dart
│   │   │   │   │   └── expense_item_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── expense_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── expense_claim_entity.dart
│   │   │   │   │   └── expense_item_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── expense_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── submit_expense_claim_usecase.dart
│   │   │   │       ├── upload_receipt_usecase.dart
│   │   │   │       ├── get_expense_claims_usecase.dart
│   │   │   │       └── edit_expense_claim_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── expense_provider.dart
│   │   │       ├── pages/
│   │   │       │   ├── expense_list_page.dart
│   │   │       │   ├── expense_form_page.dart
│   │   │       │   └── expense_detail_page.dart
│   │   │       └── widgets/
│   │   │           ├── expense_item_card.dart
│   │   │           ├── receipt_picker_widget.dart
│   │   │           └── expense_category_selector.dart
│   │   │
│   │   ├── policy/                   # FR-006 — Policy Validation Engine
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── policy_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── policy_rule_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── policy_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── policy_rule_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── policy_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── validate_expense_policy_usecase.dart
│   │   │   │       └── get_active_policies_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── policy_provider.dart
│   │   │       └── widgets/
│   │   │           ├── policy_violation_banner.dart
│   │   │           └── policy_check_indicator.dart
│   │   │
│   │   ├── reimbursement/            # FR-007 — Reimbursement Status Tracking
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── reimbursement_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── reimbursement_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── reimbursement_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── reimbursement_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── reimbursement_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       └── get_reimbursement_status_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── reimbursement_provider.dart
│   │   │       ├── pages/
│   │   │       │   └── reimbursement_tracker_page.dart
│   │   │       └── widgets/
│   │   │           ├── reimbursement_timeline_widget.dart
│   │   │           └── payment_status_badge.dart
│   │   │
│   │   ├── notifications/            # FR-008 — Push & In-App Notifications
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── notification_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── notification_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── notification_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── notification_entity.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── notification_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── get_notifications_usecase.dart
│   │   │   │       └── mark_notification_read_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── notification_provider.dart
│   │   │       ├── pages/
│   │   │       │   └── notification_center_page.dart
│   │   │       └── widgets/
│   │   │           └── notification_tile_widget.dart
│   │   │
│   │   ├── finance/                  # FR-011 — Finance Review Module
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── finance_provider.dart
│   │   │       ├── pages/
│   │   │       │   ├── finance_queue_page.dart
│   │   │       │   └── finance_claim_detail_page.dart
│   │   │       └── widgets/
│   │   │           └── erp_payment_action_widget.dart
│   │   │
│   │   ├── audit/                    # FR-012 — Audit Log & Trail
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── audit_provider.dart
│   │   │       ├── pages/
│   │   │       │   └── audit_log_page.dart
│   │   │       └── widgets/
│   │   │           └── audit_entry_tile.dart
│   │   │
│   │   └── admin/                    # Admin Configuration Panel
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   │           ├── providers/
│   │           │   └── admin_provider.dart
│   │           ├── pages/
│   │           │   ├── admin_dashboard_page.dart
│   │           │   ├── policy_config_page.dart
│   │           │   ├── approval_hierarchy_page.dart
│   │           │   └── user_role_management_page.dart
│   │           └── widgets/
│   │               └── config_section_widget.dart
│   │
│   └── shared/                       # Shared UI components and utilities
│       ├── widgets/
│       │   ├── app_button.dart
│       │   ├── app_text_field.dart
│       │   ├── app_dropdown.dart
│       │   ├── app_date_picker.dart
│       │   ├── app_loader.dart
│       │   ├── app_snackbar.dart
│       │   ├── app_error_widget.dart
│       │   ├── app_empty_state.dart
│       │   ├── status_chip.dart
│       │   └── confirmation_dialog.dart
│       └── models/
│           ├── pagination_model.dart
│           └── api_response_model.dart
│
├── test/
│   ├── unit/
│   │   ├── auth/
│   │   ├── travel_request/
│   │   ├── approval/
│   │   ├── expense/
│   │   ├── policy/
│   │   └── reimbursement/
│   ├── widget/
│   │   ├── dashboard/
│   │   ├── travel_request/
│   │   └── expense/
│   └── integration/
│       ├── auth_flow_test.dart
│       ├── travel_request_flow_test.dart
│       ├── expense_submission_flow_test.dart
│       └── reimbursement_tracking_flow_test.dart
│
├── assets/
│   ├── images/
│   │   └── logo.png
│   ├── icons/
│   └── fonts/
│
├── pubspec.yaml                      # Flutter dependencies & assets config
├── analysis_options.yaml             # Dart linting rules
├── .env.dev                          # Dev environment config
├── .env.staging                      # Staging environment config
└── .env.prod                         # Production environment config
```

---

# 6. Module-to-Feature Mapping

| Module Folder        | Feature Requirement | KPI Addressed                          | Phase  |
| -------------------- | ------------------- | -------------------------------------- | ------ |
| `auth/`              | FR-001              | System Adoption Rate                   | MVP    |
| `dashboard/`         | FR-009              | Adoption Rate, Satisfaction            | MVP    |
| `travel_request/`    | FR-002              | Approval Time, SLA Compliance          | MVP    |
| `approval/`          | FR-003              | Approval Time, SLA Compliance          | MVP    |
| `expense/`           | FR-004, FR-005      | Expense Accuracy, Processing Time      | MVP    |
| `policy/`            | FR-006              | Policy Compliance, Violation Rate      | MVP    |
| `reimbursement/`     | FR-007              | Reimbursement Time                     | MVP    |
| `notifications/`     | FR-008              | Approval Time, SLA Compliance          | MVP    |
| `finance/`           | FR-011              | Expense Processing Time, Cost Per Claim| MVP    |
| `audit/`             | FR-012              | Audit Readiness Score                  | MVP    |
| `admin/`             | Admin Config        | Policy Compliance, Manual Rate         | MVP    |

---

# 7. Key Technology Decisions

| Concern               | Technology / Pattern                            | Rationale                                        |
| --------------------- | ----------------------------------------------- | ------------------------------------------------ |
| **Architecture**      | Clean Architecture (Data → Domain → Presentation)| Separation of concerns, testability             |
| **Feature Structure** | Feature-first folders                           | Scalability and team parallel development        |
| **State Management**  | Riverpod                                        | Compile-time safe, scalable reactive state       |
| **Dependency Injection**| GetIt                                         | Lightweight service locator; lazy initialization |
| **Navigation**        | GoRouter / AutoRoute                            | Deep linking, web URL support, guard middleware  |
| **API Communication** | Dio with interceptors                           | Auth headers, retry logic, logging built-in      |
| **Local Storage**     | Hive + SharedPreferences + FlutterSecureStorage | Layered: structured data, prefs, and tokens      |
| **Testing**           | flutter_test + mocktail                         | Unit, widget, and integration coverage           |
| **Environment Config**| .env per environment                            | Dev / Staging / Prod separation                  |

---

# 8. Document References

| Document                | Purpose                                           | Location           |
| ----------------------- | ------------------------------------------------- | ------------------ |
| `kpi.md`                | KPI definitions, baselines, targets, owners       | `Agent/kpi.md`     |
| `prd.md`                | Full product requirements, user stories, release  | `Agent/prd.md`     |
| `project_scope.md`      | KPI constraints, FRs, NFRs, stopping points       | `Agent/project_scope.md` |
| `project_boundary.md`   | This document — summary + directory structure     | `Agent/project_boundary.md` |

---

*This document provides the complete project boundary — what is built, what is not, who uses it, how it integrates, and how the codebase is organized. It serves as the primary reference for onboarding developers, architects, QA engineers, and project managers.*
