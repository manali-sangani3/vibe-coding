# PROJECT SCOPE & ARCHITECTURE

**Project:** Enterprise Employee Travel & Expense Management System
**Version:** 1.0
**Date:** 2026-06-09
**Author:** Senior Product Manager
**Status:** Draft

---

## 1. Goal & Problem Statement

* **The Problem:** A 10,000+ employee organization manages all travel requests, approvals, expense claims, and reimbursements through email, Excel, and paper — resulting in zero real-time visibility, policy non-compliance, delayed reimbursements, and uncontrolled financial leakage.
* **The Solution:** A centralized, mobile-first digital platform built on Flutter (mobile) and NestJS (backend) that automates the full travel and expense lifecycle — from request submission and multi-level approval to expense claim, reimbursement, audit, and financial reporting — with real-time policy enforcement and role-based access control.

---

## 2. Tech Stack

* **Frontend:** Flutter (Mobile — iOS & Android; Material 3)
* **Backend & API:** Node.js, TypeScript, NestJS (modular monolith, REST API, v1)
* **Database & Caching:** PostgreSQL + Prisma ORM, Redis (Cache, Rate Limiting, Queues via BullMQ)
* **Auth/Infra:** JWT + Passport.js, Docker + Docker Compose, AWS (S3 for receipt storage, SES for email), GitHub Actions (CI/CD)

---

## 3. Core Features & Acceptance Criteria

| Feature Number | Feature Name | Description | Acceptance Criteria |
|---|---|---|---|
| F-01 | User Authentication & RBAC | JWT-based login, logout, refresh, and role-based access control for Employee, Manager, Finance, HR Admin, Auditor, and Super Admin roles | Users can log in with valid credentials; invalid credentials return `401`; role-restricted endpoints return `403` for unauthorized roles; accounts lock after 5 failed attempts |
| F-02 | User & Organization Management | Admin creates/deactivates users, assigns roles, maps to departments and cost centers; bulk CSV import for initial onboarding | Admin can create, update, deactivate users; deactivated users lose all active sessions immediately; CSV import of 10,000 records completes within 5 minutes with an error report |
| F-03 | Travel Request Submission | Employees raise structured travel requests with purpose, dates, origin, destination, transport mode, estimated budget, and document attachments | Submitted requests are persisted with status `PENDING_MANAGER_APPROVAL`; mandatory fields enforced; real-time policy limit warning shown; duplicate requests within 60s blocked |
| F-04 | Travel Advance Request | Employees attach advance requests to approved or pending travel requests; Finance approves/rejects | Advance created with status `PENDING_FINANCE_APPROVAL`; new advance blocked if outstanding balance > ₹0; settlement updates ledger accurately |
| F-05 | Multi-Level Approval Workflow | Configurable approval chains (Manager → Dept Head → Finance) with SLA-based escalation and concurrent-access conflict prevention | Requests route to correct approver; SLA breach triggers auto-escalation; concurrent approval attempts return `409 Conflict`; rejection requires mandatory reason |
| F-06 | Expense Claim Submission | Post-travel expense logging with line items (category, amount, date, vendor, receipt upload), per-diem auto-calculation, and policy validation | Claims linked to travel requests; policy-violating items flagged `POLICY_VIOLATION` without blocking submission; unsupported file types rejected; claims blocked after 30-day submission window |
| F-07 | Policy Compliance Engine | Admin-configurable rules by grade/city for per-diem limits, hotel caps, and flight class; real-time validation on submission; Finance override with mandatory justification | All active grade/city combinations have policy rules at go-live; 100% of breaching items flagged; Finance override blocked without justification; policy changes propagate within 60s |
| F-08 | Reimbursement Processing | Finance reviews approved claims, adjusts amounts, confirms payment mode/date, marks as `PROCESSED` | Finance can approve, reject, or adjust claims; employee notified on payment; reimbursement ledger updated; concurrent processing blocked with `409 Conflict` |
| F-09 | Notification & Alerts Engine | Push (FCM), email (AWS SES), and in-app notifications for every state transition; SLA breach alerts; BullMQ-backed async delivery | ≥ 98% push/in-app and ≥ 99% email delivery; SLA breach notifications delivered within 60s; unread count accurate across sessions |
| F-10 | Audit Trail | Immutable, append-only log of all system state changes with actor ID, action, timestamp, IP, and before/after state | 100% of state changes captured; audit log entries cannot be modified or deleted via API; audit trail queryable by entity type, entity ID, date range, and actor |
| F-11 | Reporting & Analytics Dashboard | Role-based dashboards with travel spend, budget utilization, department-wise reports; async CSV/PDF export | JSON reports return within 2s for 10,000 records; CSV/PDF exports delivered within 30s for 50,000 records; all filters return consistent, accurate data |
| F-12 | Admin Configuration Panel | Policy CRUD, approval hierarchy configuration, cost center mapping, user management, and SLA configuration | All admin actions logged in audit trail; configuration changes propagate within 60s; all CRUD operations return appropriate success/error responses |
| F-13 | Receipt Storage & Management | S3-backed receipt storage via time-limited pre-signed URLs; format and size validation | ≥ 98% upload success rate; unsupported formats/oversized files rejected with clear errors; no publicly accessible receipt objects; pre-signed URL TTL ≤ 15 minutes |

---

## 4. UI/UX Standards

* **Theme & Style:** Material 3 (Flutter Material You) — adaptive color schemes, dynamic theming, elevated surfaces, and consistent component library.
* **Layout:** Mobile-first, responsive grid, micro-animations (state transitions, loading skeletons, swipe actions), role-specific home dashboards, bottom navigation with contextual FABs.
* **Accessibility:** WCAG 2.1 AA compliance — adequate contrast ratios, semantic labels, and screen reader support.
* **Form UX:** Inline field-level validation, real-time policy warnings, draft auto-save on session interruption, step-by-step multi-step form for travel request submission.
* **Data Display:** Paginated lists with filter/sort controls, status chips with color-coded states, empty-state illustrations, pull-to-refresh on all list views.

---

## 5. Out of Scope

* **V1 Exclusions:**
  * Direct hotel/flight booking integration with third-party travel portals (MakeMyTrip, Yatra, Cleartrip, Concur).
  * Live forex/multi-currency conversion via external exchange rate APIs (admin-configured static rates only in V1).
  * Payroll system deep integration for automatic reimbursement disbursement (Finance manual confirmation in V1).
  * HRMS/ERP system API sync for employee data (bulk CSV import only in V1).
  * Receipt OCR for auto-extraction of expense line item data (manual entry in V1).
  * AI/ML-based fraud detection (configurable rule-based flagging only in V1).
  * Web browser application (Flutter mobile only in V1; web portal deferred to V2).
  * Vendor/hotel rate management module and vendor portal (V2).
  * Multi-company / subsidiary organization hierarchy beyond single-tenant (V2).
  * Offline-first mobile support beyond basic form draft caching (V2).
  * WhatsApp/SMS notification channel (push + email only in V1).
  * Automated regulatory filing or tax report generation.
