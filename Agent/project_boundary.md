# Project Boundary Document

## Enterprise Employee Travel & Expense Management System

**Version:** 2.0  
**Target Platform:** Flutter (iOS, Android, Web) & Node.js (NestJS, PostgreSQL, Redis)  
**Organization Size:** 10,000+ Employees  
**Document Date:** June 2026  
**Reference Documents:** kpi.md · prd.md · project_scope.md  

---

# 1. Project Summary

## 1.1 One-Line Definition
A **cross-platform Flutter application** integrated with a **modular Node.js NestJS backend** that digitizes and automates the complete employee travel request, expense submission, multi-level approval, policy compliance validation, and reimbursement lifecycle for an enterprise of 10,000+ employees.

## 1.2 What This Project Is

| Dimension | Description |
| :--- | :--- |
| **Product Type** | B2E (Business-to-Employee) Mobile & Web Application |
| **Frontend Platform**| Flutter — iOS · Android · Web |
| **Backend Platform** | Node.js (NestJS Monolith) — PostgreSQL · Redis · BullMQ |
| **Audience** | Employees, Managers, Finance Team, Compliance Team, Admin |
| **Core Purpose** | Replace manual email/Excel-based travel & expense workflows with a fully automated digital system |
| **Client Architecture**| Clean Architecture · Feature-first Modularization · Repository Pattern |
| **Client State Mgmt** | Riverpod |
| **Client DI Locator** | GetIt |
| **Client Network** | Dio with Interceptors |
| **Integrations** | REST APIs · OAuth2 SSO · ERP System Integration · HRMS Integration |

## 1.3 Business Problem Being Solved
The organization of 10,000+ employees currently manages all travel and expense operations through **emails, Excel sheets, phone calls, and paper forms**. This results in:
- Average travel approval time of **5 days** (target: < 1 day)
- Average reimbursement cycle of **15 days** (target: < 3 days)
- Policy compliance rate of only **70%** (target: ≥ 98%)
- Manual intervention required in **75% of cases** (target: < 10%)
- Employee satisfaction score of **3.1 / 5** (target: ≥ 4.5 / 5)

## 1.4 Key Outcomes Expected

| Outcome Area | Before | After Target |
| :--- | :--- | :--- |
| Approval Time | 5 Days | **< 1 Day** |
| Reimbursement Time | 15 Days | **< 3 Days** |
| Policy Compliance | 70% | **≥ 98%** |
| Manual Intervention | 75% | **< 10%** |
| System Adoption | 0% | **≥ 90%** |
| Employee Satisfaction | 3.1 / 5 | **≥ 4.5 / 5** |
| Cost Per Claim | ₹150 | **≤ ₹40** |
| Automation Rate | 10% | **≥ 95%** |

## 1.5 Release Phases

| Phase | Scope | Status |
| :--- | :--- | :--- |
| **MVP (Phase 1)** | Auth, Travel Request, Approvals Workflow, Expense Submission, Receipt Upload, Reimbursements, Notifications | In Scope |
| **Phase 2** | Spend Analytics dashboards, OCR Receipt Scanning, Travel Booking Integrations, Budget Controls, Offline Mode | Planned |
| **Future** | AI Expense Categorization, Fraud Detection, Chatbot support, Predictive spend analytics | Out of Scope |

---

# 2. System Boundary

The system boundary details what lies inside the core development scope versus what is consumed as an external integration:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                       ENTERPRISE TRAVEL & EXPENSE SYSTEM BOUNDARY                        │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                 Flutter Client                                  │   │
│   │   - SSO Login Portal       - Dashboard Overview      - Travel request forms     │   │
│   │   - Expense submission     - Receipt attachment      - Reimbursement timeline   │   │
│   └────────────────────────────────────────┬────────────────────────────────────────┘   │
│                                            │ REST APIs / HTTPS                          │
│   ┌────────────────────────────────────────▼────────────────────────────────────────┐   │
│   │                               Node.js Backend                                   │   │
│   │   - JWT Auth & RBAC Guard  - Travel Request module   - Approvals Workflow engine│   │
│   │   - Expense Claim module   - Policy Rules check      - Reimbursement sync queue │   │
│   │   - Audit Logs logger      - Notification templates  - Reports compiler         │   │
│   └────────────────────────────────────────┬────────────────────────────────────────┘   │
└────────────────────────────────────────────┼────────────────────────────────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │ REST APIs                     │ REST APIs                     │ OAuth2
     ┌───────▼───────┐               ┌───────▼───────┐               ┌───────▼───────┐
     │  HRMS System  │               │  ERP System   │               │ SSO Provider  │
     │ (Employee DB) │               │  (Payments)   │               │ (Okta/Azure)  │
     └───────────────┘               └───────────────┘               └───────────────┘
```

## 2.1 In-Boundary (What Is Built)
- **SSO Authentication Portal:** Custom login screens supporting SAML/OAuth2 token auth and JWT session cookies.
- **Travel Request Module:** Business trip forms, travel history list, detail view, request cancellation.
- **Approvals Workflow Engine:** Multi-level routing (L1 Manager → L2 Dept Head → L3 Finance), SLA timers, automatic escalations.
- **Expense Claim & Receipt Attachment:** Line-item expense forms, receipt uploads, category configuration.
- **Policy Compliance Engine:** Real-time business rule validation (e.g. advance request duration check, item caps, duplicate detection).
- **Reimbursement Tracker:** Status interface showing transaction history from approval to bank transfer.
- **Audit Logs:** Immutable audit trail logging state transitions and approvals.
- **Reporting Dashboard:** Spend analytics charts.

## 2.2 Out-of-Boundary (What Is NOT Built)
- **Identity Provider (SSO):** The server side of Azure AD/Okta (only integrated via OAuth2 protocol).
- **HR Master Data (HRMS):** The source database of employee hierarchy (consumed only via read-only REST APIs).
- **Payment Processing (ERP):** Direct processing of bank transfers (payment is initiated via API to SAP/Oracle ERP, which handles bank wire transfers).
- **International Policies:** Only domestic travel policies are supported.
- **OCR Receipt Parsing:** Scheduled for Phase 2.
- **Booking Vendor Portals:** Direct booking of flights/hotels is deferred to Phase 2.

---

# 3. User Roles & Access Boundary

Access permissions are mapped via JWT payload roles:

| Role | Module Access | Can Approve | Decision Maker |
| :--- | :--- | :--- | :--- |
| **Employee** | Dashboard · Travel Request · Expense Claims · Reimbursements | No | No |
| **Manager** | Manager Console · Team travel visibility · L1 Approvals | Yes (L1) | Yes |
| **Department Head** | Team-level view · L2 Approvals | Yes (L2) | Yes |
| **Finance Executive**| Finance Module · Claim review · L3 Approvals · ERP trigger | Yes (L3) | Yes |
| **Compliance Officer**| Policy Engine config · Compliance reports · Audit logs | No | Yes |
| **Admin** | Full system config · User roles · Policy rules · System controls | No | Yes |

---

# 4. Integration Boundary

| External System | Integration Type | Data Exchanged | Owner |
| :--- | :--- | :--- | :--- |
| **HRMS** | REST API (consume) | Employee profiles, hierarchy, organizational structure | HR Team |
| **ERP / Finance** | REST API (consume) | Payment initiation, reimbursement status details | Finance Team |
| **SSO Provider** | OAuth2 / SAML 2.0 | Authentication tokens, user identity metadata | IT Team |
| **Push Notification** | FCM / APNs | Notification payload delivery | Infrastructure Team |
| **Email Service** | SMTP / API | Email alerts and digests | Infrastructure Team |
| **Analytics Platform**| SDK / API | Funnel metrics, adoption, SLA data | Product / IT Team |
| **File Storage** | Cloud Storage API | Receipt uploads, document storage | IT Team |
| **OCR Service** *(P2)* | REST API (consume) | Receipt data extraction | Product Team |
| **Booking Vendor** *(P2)*| REST API (consume)| Flight/hotel booking tied to travel requests | Product Team |

---

# 5. Project Folder / Directory Structure

### 5.1 Flutter Frontend Structure (`travel_expense_app/`)
```
travel_expense_app/
│
├── android/                          # Native Android files
├── ios/                              # Native iOS files
├── web/                              # Web platform files
│
├── assets/                           # Asset bundles
│   ├── images/                       # App branding images
│   ├── icons/                        # Custom icons
│   └── fonts/                        # Font files (Outfit, Inter)
│
├── lib/
│   ├── main.dart                     # App setup & platform initializes
│   ├── app.dart                      # MaterialApp config, themes, GoRouter load
│   │
│   ├── core/                         # Shared core utilities (no feature logic)
│   │   ├── constants/
│   │   │   └── app_constants.dart    # Storage keys, endpoints, parameters
│   │   ├── errors/
│   │   │   ├── failures.dart         # Domain failure wrappers
│   │   │   └── exceptions.dart       # Data layer custom exceptions
│   │   ├── network/
│   │   │   └── api_client.dart       # Dio client wrapper with interceptors
│   │   ├── storage/
│   │   │   ├── local_storage.dart    # SharedPreferences cache manager
│   │   │   └── secure_storage.dart   # FlutterSecureStorage secure token locker
│   │   ├── theme/
│   │   │   ├── app_colors.dart       # Custom dark/light colors
│   │   │   ├── app_typography.dart   # Google Fonts config (Outfit & Inter)
│   │   │   └── app_theme.dart        # ThemeData configurations
│   │   ├── router/
│   │   │   └── app_router.dart       # GoRouter routes and redirect guards
│   │   └── di/
│   │       └── injection_container.dart # GetIt dependency injections
│   │
│   ├── features/                     # Feature-First Architecture Modules
│   │   ├── auth/                     # Authentication Module
│   │   │   ├── domain/
│   │   │   │   ├── entities/         # UserEntity
│   │   │   │   ├── repositories/     # AuthRepository contract
│   │   │   │   └── usecases/         # LoginUseCase, GetCurrentUserUseCase
│   │   │   ├── data/
│   │   │   │   ├── models/           # UserModel JSON converters
│   │   │   │   ├── datasources/      # AuthRemoteDataSource
│   │   │   │   └── repositories/     # AuthRepositoryImpl
│   │   │   └── presentation/
│   │   │       ├── providers/        # AuthNotifier state provider
│   │   │       ├── pages/            # LoginPage (Premium SSO page)
│   │   │       └── widgets/          # SsoButtonWidget
│   │   │
│   │   ├── travel_request/           # Travel Request Module
│   │   │   ├── domain/
│   │   │   │   ├── entities/         # TravelRequestEntity
│   │   │   │   ├── repositories/     # TravelRepository contract
│   │   │   │   └── usecases/         # SubmitTravelRequestUseCase, GetTravelRequestsUseCase, CancelTravelRequestUseCase
│   │   │   ├── data/
│   │   │   │   ├── models/           # TravelRequestModel JSON converters
│   │   │   │   ├── datasources/      # TravelRemoteDataSource
│   │   │   │   └── repositories/     # TravelRepositoryImpl
│   │   │   └── presentation/
│   │   │       ├── providers/        # TravelRequestNotifier provider
│   │   │       ├── pages/            # TravelRequestListPage, TravelRequestFormPage, TravelRequestDetailPage
│   │   │       └── widgets/          # TravelStatusBadge, TravelRequestCard
│   │   │
│   │   ├── dashboard/                # Dashboard Module
│   │   │   └── presentation/
│   │   │       └── pages/            # DashboardPage (Workspace Action Portal)
│   │   │
│   │   ├── approval/                 # [Planned] Multi-level approvals
│   │   ├── expense/                  # [Planned] Expense claims submissions
│   │   └── reimbursement/            # [Planned] Reimbursement tracking
│   │
│   └── shared/                       # App-wide reusable UI components
│       └── widgets/                  # AppButtons, AppTextFields, LoadingIndicators
│
└── test/
    ├── unit/                         # Pure Dart Unit tests
    │   ├── auth/                     # auth_notifier_test.dart
    │   └── travel_request/           # travel_request_notifier_test.dart
    └── widget/                       # Flutter Widget/Smoke tests
        └── widget_test.dart          # startup_smoke_test.dart
```

### 5.2 NestJS Backend Structure (`travel_expense_backend/`)
```
travel_expense_backend/
│
├── src/
│   ├── main.ts                       # Application bootstrap
│   ├── app.module.ts                 # Primary root module loading submodules
│   │
│   ├── config/                       # Configuration environments
│   │   ├── database.config.ts        # PostgreSQL TypeORM configurations
│   │   └── redis.config.ts           # Redis caching configurations
│   │
│   ├── middleware/                   # Shared HTTP middlewares
│   │   ├── logging.middleware.ts     # Request audit logger
│   │   └── error.middleware.ts       # Global error filters
│   │
│   ├── modules/                      # Business Modules
│   │   ├── auth/                     # OAuth2 SSO, JWT verify, RBAC Guard
│   │   │   ├── controllers/          # Login, Refresh token endpoints
│   │   │   ├── services/             # Okta/Azure verify logics
│   │   │   └── dto/                  # SSO Token DTO validation
│   │   │
│   │   ├── travel/                   # Travel requests lifecycle
│   │   │   ├── controllers/          # POST /travel, GET /travel endpoints
│   │   │   ├── services/             # Travel DB CRUD operations
│   │   │   ├── entities/             # TravelRequest database entity
│   │   │   └── dto/                  # TravelRequest DTO validation
│   │   │
│   │   ├── approvals/                # Approval workflows & SLA timers
│   │   │   ├── controllers/          # POST /approvals/:id/decision
│   │   │   └── services/             # Hierarchy lookup & transition checks
│   │   │
│   │   ├── expenses/                 # Expense claims & receipt attachment
│   │   │   ├── controllers/          # POST /expenses, POST /expenses/upload
│   │   │   └── services/             # File storage mapping & policy engine validation
│   │   │
│   │   └── reimbursements/           # Reimbursement ERP integrations
│   │       ├── controllers/          # GET /reimbursements/:id
│   │       └── services/             # SAP/Oracle ERP API client & BullMQ jobs
│   │
│   ├── shared/                       # Common domain files
│   │   ├── interceptors/             # Response serializers
│   │   └── decorators/               # Roles metadata decorators
│   │
│   └── jobs/                         # Background BullMQ processors
│       ├── sla_escalation.processor.ts # Automated SLA escalators
│       └── erp_sync.processor.ts     # Failed payment retry scheduler
│
├── test/
│   ├── unit/                         # Unit tests
│   ├── api/                          # Controller API routes tests
│   └── e2e/                          # End-to-End integration tests
│
├── Dockerfile                        # Docker container build script
├── docker-compose.yml                # Multi-container orchestration (DB, Redis)
└── package.json                      # Dependency manifests
```

---

# 6. Module-to-Feature Mapping

| Module Folder | Feature Requirement | KPI Addressed | Phase |
| :--- | :--- | :--- | :--- |
| `auth/` | FR-001 SSO Authentication | System Adoption Rate | MVP |
| `dashboard/` | FR-009 Employee Dashboard | Adoption Rate, Satisfaction | MVP |
| `travel_request/` | FR-002 Travel Request | Approval Time, SLA Compliance | MVP |
| `approval/` | FR-003 Multi-Level Approval | Approval Time, SLA Compliance | MVP |
| `expense/` | FR-004, FR-005 Expense Claims | Expense Accuracy, Processing Cost | MVP |
| `policy/` | FR-006 Policy Validation | Policy Compliance, Rejection Rate | MVP |
| `reimbursement/` | FR-007 Reimbursement Tracking | Reimbursement Time, Satisfaction | MVP |
| `notifications/` | FR-008 Push & In-App Alerts | Approval Time, SLA Compliance | MVP |
| `finance/` | FR-011 Finance Review | Processing Time, Manual Rate | MVP |
| `audit/` | FR-012 Audit Log & Trails | Audit Readiness Score | MVP |
| `admin/` | Admin Configurations | Policy Compliance, Manual Rate | MVP |

---

# 7. Key Technology Decisions

| Concern | Technology / Pattern | Rationale |
| :--- | :--- | :--- |
| **Frontend Architecture**| Clean Architecture (Data → Domain → Presentation) | Strict separation of concerns, decouples core domain logic from framework, increases testability. |
| **Feature Structure** | Feature-first folders | Organizes components by feature area (instead of layer type), supporting scalable and modular development. |
| **State Management** | Riverpod (Code Generation) | Provides compile-time safe, testable, and reactive state trees without the boilerplate of Bloc. |
| **Dependency Injection**| GetIt Service Locator | Lightweight service locator that decouples implementations from interfaces and allows runtime mocks during testing. |
| **Navigation** | GoRouter | Modern declarative router supporting deep linking, path parameters, and redirection guards (auth redirection). |
| **HTTP Communication** | Dio with Interceptors | Standard network client allowing modular request headers injection (JWT auth) and robust logger middleware. |
| **Local Cache** | Hive NoSQL Database | Lightweight, fast key-value storage engine ideal for local database cache and draft claims. |
| **Secure Caching** | FlutterSecureStorage | Platform-specific encrypted keychain/keystore wrapper to secure sensitive OAuth credentials and session tokens. |
| **Testing Stubs** | Mocktail | Elegant mock stubbing for unit testing use cases and notifier state machines without mock generation. |
| **Environment Config** | `.env` files per stage | Separates secrets and endpoints for Dev, QA, UAT, and Production builds. |
| **Backend Architecture**| NestJS Modular Monolith | NestJS provides a scalable, TypeScript-first application framework. Monolith structure minimizes early DevOps overhead. |
| **Database Engine** | PostgreSQL | Robust ACID-compliant relational DB ideal for financial claims and audit logs. |
| **Job Queue** | Redis + BullMQ | Handles heavy asynchronous operations (SSO checks, SLA timer jobs, ERP retries) without blocking HTTP threads. |

---

# 8. Document References

- **`kpi.md`** — Defines baselines, targets, KPI equations, and tracking frameworks. [kpi.md](file:///Users/neosoft/StudioProjects/vibe%20coding/Agent/kpi.md)
- **`prd.md`** — Comprehensive functional specifications, User Stories, Gherkin acceptance cases. [prd.md](file:///Users/neosoft/StudioProjects/vibe%20coding/Agent/prd.md)
- **`project_scope.md`** — Establishes functional/NFR constraints, DoD stopping points, in-scope development. [project_scope.md](file:///Users/neosoft/StudioProjects/vibe%20coding/Agent/project_scope.md)
- **`project_boundary.md`** — This document; details boundary architectures and directory mappings. [project_boundary.md](file:///Users/neosoft/StudioProjects/vibe%20coding/Agent/project_boundary.md)

---

*This document defines the complete architectural boundary of the Enterprise Travel & Expense Management System, bridging strategic KPIs to implementation folder maps for engineers, designers, and testers.*
