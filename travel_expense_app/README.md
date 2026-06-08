# Travel & Expense Tracker App

A modern, scalable Flutter application designed to handle end-to-end travel requests and expense reimbursements for corporate employees. 

## 🚀 Current Status: Employee to Manager Flow

The core approval hierarchy has been thoroughly tested and is functioning perfectly. The current implemented flow represents the standard **Employee -> Manager** relationship:

1. **Travel Request Creation**: 
   - An `EMPLOYEE` submits a new Travel Request detailing the destination, dates, and estimated costs.
   - The system automatically enforces business rules (e.g., travel must be booked at least 7 days in advance).
2. **Manager Travel Approval**:
   - The Travel Request is placed into the `PENDING` queue for the `MANAGER`.
   - The Manager logs in, navigates to the **Approvals Queue** (Travel Requests tab), and can either Approve or Reject the request.
3. **Expense Claim Submission**:
   - Once the Travel Request is approved, the Employee can submit an **Expense Claim** against it.
   - The system validates that expenses are submitted within 30 days of the trip's end date.
   - The Expense Claim is routed to `PENDING_MANAGER` status.
4. **Manager Expense Approval**:
   - The Manager logs in and views the **Expense Claims** tab in the Approvals Queue.
   - The Manager reviews the total amounts and associated trips, and clicks **Approve & Forward to Finance**.

## 🔐 Authentication & Security Flow

This app uses a robust JSON Web Token (JWT) based authentication system, designed to seamlessly integrate with enterprise SSO providers.

**Authentication Flow:**
1. **Login Page**: Users are presented with Single Sign-On (SSO) options (e.g., Okta, Azure AD).
2. **Developer Sandbox**: For testing purposes, there is a built-in sandbox at the bottom of the login screen. Tapping a specific role (`Login as Employee`, `Login as Manager`) bypasses the SSO gateway and requests a mock JWT token directly from the backend.
3. **Token Storage**: Upon a successful response, the JWT token is securely stored on the device using `flutter_secure_storage`.
4. **API Interception**: All subsequent API requests made through `Dio` are intercepted, and the stored JWT is attached to the `Authorization: Bearer <token>` header.
5. **Backend Verification**: The NestJS backend verifies the JWT using passport-jwt, extracts the User ID and Role, and uses `RolesGuard` decorators to authorize access to specific endpoints.

## 👥 Roles & Future Features

The system architecture is designed around Role-Based Access Control (RBAC). While the Employee and Manager roles are currently implemented, the backend models are already configured for the following roles to unlock future features:

- **`EMPLOYEE`**: Can create travel requests, submit expense claims, and view their own history.
- **`MANAGER`**: Can approve Level-1 travel requests and expense claims submitted by their direct reports.
- **`DEPT_HEAD` (Future)**: Will approve Level-2 travel requests (e.g., International travel) and expense claims submitted by Managers.
- **`FINANCE` (Future Integration)**: 
  - Will manage the final queue of approved expense claims.
  - Will be responsible for changing the status from `PENDING_FINANCE` to `APPROVED` and finally to `PAID`.
  - Will have access to detailed reporting and payout exports.
- **`ADMIN` (Future Integration)**:
  - Will have access to the Audit Logs to track system anomalies or "Forbidden Resource" attempts.
  - Will manage user provisioning, role assignments, and global policy configurations (e.g., changing the 7-day advance booking rule).

## 🛠 Tech Stack

- **Frontend**: Flutter (Riverpod for state management, Dio for networking, clean architecture).
- **Backend**: NestJS (TypeScript, TypeORM, SQLite/Postgres).
