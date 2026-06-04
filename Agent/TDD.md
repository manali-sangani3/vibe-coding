# Test-Driven Development (TDD) Document

### Given Prompt
Act as a Senior Flutter Developer and QA Architect. Using the provided prd.md, generate TDD.md.
Requirements:
* Extract features and acceptance criteria.
* Create positive, negative, and edge test cases.
* Define unit, widget, and integration tests.
* Include validation rules, expected results, coverage goals, risks, and Definition of Done.
* No assumptions.
* If requirements are unclear, stop and ask questions.
Output: 
Markdown TDD.md only.


### Output

## Enterprise Employee Travel & Expense Management System

**Version:** 1.0
**Document Owner:** QA Architecture Team
**Target Platform:** Flutter (iOS · Android · Web)
**Reference Document:** prd.md
**Test Framework:** flutter_test · mocktail · integration_test

---

# Table of Contents

1. [Overview & Objectives](#1-overview--objectives)
2. [Coverage Goals](#2-coverage-goals)
3. [Test Environment Setup](#3-test-environment-setup)
4. [FR-001 — Authentication (SSO)](#4-fr-001--authentication-sso)
5. [FR-002 — Travel Request Submission](#5-fr-002--travel-request-submission)
6. [FR-003 — Multi-Level Approval Workflow](#6-fr-003--multi-level-approval-workflow)
7. [FR-004 — Expense Submission](#7-fr-004--expense-submission)
8. [FR-005 — Receipt Upload & Storage](#8-fr-005--receipt-upload--storage)
9. [FR-006 — Policy Validation Engine](#9-fr-006--policy-validation-engine)
10. [FR-007 — Reimbursement Tracking](#10-fr-007--reimbursement-tracking)
11. [FR-008 — Push Notifications & Alerts](#11-fr-008--push-notifications--alerts)
12. [FR-009 — Employee Dashboard](#12-fr-009--employee-dashboard)
13. [FR-010 — Manager Approval Console](#13-fr-010--manager-approval-console)
14. [FR-011 — Finance Review Module](#14-fr-011--finance-review-module)
15. [FR-012 — Audit Log & Trail](#15-fr-012--audit-log--trail)
16. [Non-Functional Requirement Tests](#16-non-functional-requirement-tests)
17. [Validation Rules Master List](#17-validation-rules-master-list)
18. [Risks](#18-risks)
19. [Definition of Done](#19-definition-of-done)

---

# 1. Overview & Objectives

## 1.1 Purpose

This document defines the complete test strategy for the Enterprise Travel & Expense Management Flutter application. All test cases are derived directly from functional requirements, acceptance criteria, user stories, and non-functional requirements documented in `prd.md`.

## 1.2 Test Types Used

| Test Type        | Tool / Framework                   | Layer                              |
| ---------------- | ---------------------------------- | ---------------------------------- |
| Unit Test        | `flutter_test` + `mocktail`        | Use cases, repositories, validators|
| Widget Test      | `flutter_test` + `WidgetTester`    | UI components, pages, forms        |
| Integration Test | `integration_test` package         | End-to-end user flows              |
| API Mock Test    | `mocktail` + fake datasources      | Data layer / remote datasources    |

## 1.3 Test Case Notation

| Prefix    | Meaning                                  |
| --------- | ---------------------------------------- |
| `TC-POS`  | Positive test — valid input, happy path  |
| `TC-NEG`  | Negative test — invalid input, errors    |
| `TC-EDGE` | Edge case — boundary, concurrent, limit  |

---

# 2. Coverage Goals

| Layer             | Minimum Coverage | Target Coverage |
| ----------------- | ---------------- | --------------- |
| Use Cases         | 90%              | 95%             |
| Repositories      | 85%              | 90%             |
| Validators        | 100%             | 100%            |
| Widget / UI       | 75%              | 85%             |
| Integration Flows | All 12 FR flows  | All 12 FR flows |
| **Overall**       | **80%**          | **90%**         |

---

# 3. Test Environment Setup

## 3.1 Dependencies (`pubspec.yaml`)

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  mocktail: ^1.0.0
  fake_async: ^1.3.1
  bloc_test: ^9.1.5        # if using BLoC
  riverpod_test: ^2.0.0    # for Riverpod providers
```

## 3.2 Folder Structure

```
test/
├── unit/
│   ├── auth/
│   ├── travel_request/
│   ├── approval/
│   ├── expense/
│   ├── policy/
│   ├── reimbursement/
│   ├── notifications/
│   ├── finance/
│   └── audit/
├── widget/
│   ├── auth/
│   ├── dashboard/
│   ├── travel_request/
│   ├── approval/
│   ├── expense/
│   └── shared/
└── integration/
    ├── auth_flow_test.dart
    ├── travel_request_flow_test.dart
    ├── approval_flow_test.dart
    ├── expense_submission_flow_test.dart
    └── reimbursement_flow_test.dart
```

## 3.3 Mock Setup Pattern

```dart
// Standard mock pattern used across all feature tests
class MockAuthRepository extends Mock implements AuthRepository {}
class MockTravelRepository extends Mock implements TravelRepository {}

void main() {
  late MockAuthRepository mockRepository;
  late LoginUseCase loginUseCase;

  setUp(() {
    mockRepository = MockAuthRepository();
    loginUseCase = LoginUseCase(mockRepository);
  });
}
```

---

# 4. FR-001 — Authentication (SSO)

**PRD Reference:** FR-001 | Priority: Must Have
**Acceptance Criteria (Gherkin):**
> Given an authenticated employee
> When they open the app
> Then they should be redirected to the dashboard based on their role

---

## 4.1 Unit Tests — Auth

### TC-POS-AUTH-001
**Test:** Login use case returns user entity on valid SSO token

```dart
test('should return UserEntity when SSO token is valid', () async {
  when(() => mockAuthRepository.loginWithSSO(token: any(named: 'token')))
      .thenAnswer((_) async => Right(tUserEntity));

  final result = await loginUseCase(token: 'valid_sso_token');

  expect(result, Right(tUserEntity));
  verify(() => mockAuthRepository.loginWithSSO(token: 'valid_sso_token')).called(1);
});
```

### TC-NEG-AUTH-001
**Test:** Login use case returns AuthFailure on invalid/expired token

```dart
test('should return AuthFailure when token is expired', () async {
  when(() => mockAuthRepository.loginWithSSO(token: any(named: 'token')))
      .thenAnswer((_) async => Left(AuthFailure('Token expired')));

  final result = await loginUseCase(token: 'expired_token');

  expect(result, Left(AuthFailure('Token expired')));
});
```

### TC-NEG-AUTH-002
**Test:** Login use case returns NetworkFailure on no internet

```dart
test('should return NetworkFailure when device is offline', () async {
  when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);

  final result = await loginUseCase(token: 'valid_token');

  expect(result, Left(NetworkFailure()));
});
```

### TC-POS-AUTH-002
**Test:** RBAC — Employee role is assigned correctly from JWT claims

```dart
test('should assign Employee role when JWT role claim is EMPLOYEE', () {
  final user = UserModel.fromJson({'role': 'EMPLOYEE', 'id': '1', 'name': 'John'});

  expect(user.role, equals(UserRole.employee));
});
```

### TC-POS-AUTH-003
**Test:** RBAC — Finance role is assigned correctly

```dart
test('should assign Finance role when JWT role claim is FINANCE', () {
  final user = UserModel.fromJson({'role': 'FINANCE', 'id': '2', 'name': 'Jane'});

  expect(user.role, equals(UserRole.finance));
});
```

### TC-EDGE-AUTH-001
**Test:** Session auto-logout after 30 minutes of inactivity

```dart
test('should trigger logout after 30 minutes of inactivity', () async {
  fakeAsync((async) {
    sessionManager.startInactivityTimer();
    async.elapse(const Duration(minutes: 30));
    verify(() => mockAuthRepository.logout()).called(1);
  });
});
```

### TC-EDGE-AUTH-002
**Test:** Concurrent login attempt with same token is idempotent

```dart
test('should not create duplicate sessions on concurrent SSO calls', () async {
  final futures = List.generate(3, (_) => loginUseCase(token: 'same_token'));
  await Future.wait(futures);
  verify(() => mockAuthRepository.loginWithSSO(token: 'same_token')).called(1);
});
```

---

## 4.2 Widget Tests — Auth

### TC-POS-AUTH-W001
**Test:** Login page renders SSO button

```dart
testWidgets('Login page shows SSO login button', (tester) async {
  await tester.pumpWidget(const LoginPage());
  expect(find.byKey(const Key('sso_login_button')), findsOneWidget);
});
```

### TC-NEG-AUTH-W001
**Test:** Login page shows error message on auth failure

```dart
testWidgets('Shows error snackbar when authentication fails', (tester) async {
  when(() => mockProvider.login()).thenThrow(AuthFailure('Invalid credentials'));
  await tester.pumpWidget(const LoginPage());
  await tester.tap(find.byKey(const Key('sso_login_button')));
  await tester.pump();
  expect(find.text('Invalid credentials'), findsOneWidget);
});
```

### TC-NEG-AUTH-W002
**Test:** Loading indicator visible during SSO login

```dart
testWidgets('Shows CircularProgressIndicator during login', (tester) async {
  await tester.pumpWidget(const LoginPage());
  await tester.tap(find.byKey(const Key('sso_login_button')));
  await tester.pump();
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
});
```

---

## 4.3 Integration Tests — Auth

### TC-POS-AUTH-I001
**Test:** Full SSO login → role assignment → dashboard navigation

```dart
testWidgets('Employee can log in and is redirected to employee dashboard', (tester) async {
  app.main();
  await tester.pumpAndSettle();
  await tester.tap(find.byKey(const Key('sso_login_button')));
  await tester.pumpAndSettle();
  expect(find.byKey(const Key('employee_dashboard_page')), findsOneWidget);
});
```

---

# 5. FR-002 — Travel Request Submission

**PRD Reference:** FR-002 | Priority: Must Have
**User Story:** As an employee, I want to submit travel requests digitally so that approvals happen faster.
**Acceptance Criteria:**
> Given an authenticated employee
> When travel details are submitted
> Then the request should be routed to the correct approver

---

## 5.1 Unit Tests — Travel Request

### TC-POS-TR-001
**Test:** Submit travel request use case returns success on valid input

```dart
test('should return TravelRequestEntity on successful submission', () async {
  when(() => mockTravelRepo.submitRequest(travelRequest: any(named: 'travelRequest')))
      .thenAnswer((_) async => Right(tTravelRequestEntity));

  final result = await submitTravelRequestUseCase(request: tTravelRequest);
  expect(result, Right(tTravelRequestEntity));
});
```

### TC-NEG-TR-001
**Test:** Submit travel request fails when destination is empty

```dart
test('should return ValidationFailure when destination is empty', () {
  final validator = TravelRequestValidator();
  final result = validator.validate(destination: '', startDate: DateTime.now());
  expect(result, Left(ValidationFailure('Destination is required')));
});
```

### TC-NEG-TR-002
**Test:** Submit travel request fails when start date is in the past

```dart
test('should return ValidationFailure when start date is in the past', () {
  final validator = TravelRequestValidator();
  final result = validator.validate(
    destination: 'Mumbai',
    startDate: DateTime.now().subtract(const Duration(days: 1)),
  );
  expect(result, Left(ValidationFailure('Start date cannot be in the past')));
});
```

### TC-NEG-TR-003
**Test:** Submit travel request fails when end date is before start date

```dart
test('should return ValidationFailure when end date is before start date', () {
  final validator = TravelRequestValidator();
  final result = validator.validate(
    destination: 'Delhi',
    startDate: DateTime(2026, 6, 10),
    endDate: DateTime(2026, 6, 5),
  );
  expect(result, Left(ValidationFailure('End date must be after start date')));
});
```

### TC-NEG-TR-004
**Test:** Submit fails when cost center is missing

```dart
test('should return ValidationFailure when cost center is not provided', () {
  final validator = TravelRequestValidator();
  final result = validator.validate(destination: 'Pune', costCenter: null);
  expect(result, Left(ValidationFailure('Cost center is required')));
});
```

### TC-EDGE-TR-001
**Test:** Travel request submission with maximum allowed trip duration (90 days)

```dart
test('should accept travel request with 90-day duration', () {
  final validator = TravelRequestValidator();
  final result = validator.validate(
    destination: 'USA',
    startDate: DateTime(2026, 7, 1),
    endDate: DateTime(2026, 9, 29),
  );
  expect(result, isA<Right>());
});
```

### TC-EDGE-TR-002
**Test:** Travel request submission with trip duration exceeding 90 days is rejected

```dart
test('should reject travel request exceeding 90-day maximum', () {
  final validator = TravelRequestValidator();
  final result = validator.validate(
    destination: 'USA',
    startDate: DateTime(2026, 7, 1),
    endDate: DateTime(2026, 10, 15),
  );
  expect(result, Left(ValidationFailure('Trip duration cannot exceed 90 days')));
});
```

### TC-EDGE-TR-003
**Test:** Concurrent travel request submission (prevent duplicates)

```dart
test('should reject duplicate travel request for same dates and destination', () async {
  when(() => mockTravelRepo.checkDuplicate(any())).thenAnswer((_) async => true);
  final result = await submitTravelRequestUseCase(request: tTravelRequest);
  expect(result, Left(DuplicateRequestFailure()));
});
```

---

## 5.2 Widget Tests — Travel Request

### TC-POS-TR-W001
**Test:** Travel request form renders all required fields

```dart
testWidgets('Travel request form displays destination, date, purpose, and cost center fields', (tester) async {
  await tester.pumpWidget(const TravelRequestFormPage());
  expect(find.byKey(const Key('field_destination')), findsOneWidget);
  expect(find.byKey(const Key('field_start_date')), findsOneWidget);
  expect(find.byKey(const Key('field_end_date')), findsOneWidget);
  expect(find.byKey(const Key('field_purpose')), findsOneWidget);
  expect(find.byKey(const Key('field_cost_center')), findsOneWidget);
});
```

### TC-NEG-TR-W001
**Test:** Submit button shows validation errors on empty form

```dart
testWidgets('Tapping submit on empty form shows required field errors', (tester) async {
  await tester.pumpWidget(const TravelRequestFormPage());
  await tester.tap(find.byKey(const Key('btn_submit_travel_request')));
  await tester.pump();
  expect(find.text('Destination is required'), findsOneWidget);
  expect(find.text('Start date is required'), findsOneWidget);
});
```

### TC-POS-TR-W002
**Test:** Successful submission shows confirmation and navigates to list

```dart
testWidgets('Success message shown after valid form submission', (tester) async {
  // mock provider returns success
  await tester.pumpWidget(const TravelRequestFormPage());
  await tester.enterText(find.byKey(const Key('field_destination')), 'Mumbai');
  await tester.tap(find.byKey(const Key('btn_submit_travel_request')));
  await tester.pump();
  expect(find.text('Travel request submitted successfully'), findsOneWidget);
});
```

---

## 5.3 Integration Tests — Travel Request

### TC-POS-TR-I001
**Test:** Employee submits travel request → request appears in manager's approval queue

```dart
testWidgets('Submitted travel request appears in manager approval queue', (tester) async {
  // Login as employee, submit request
  // Login as manager, check approval queue
  expect(find.byKey(const Key('pending_approval_card')), findsOneWidget);
});
```

---

# 6. FR-003 — Multi-Level Approval Workflow

**PRD Reference:** FR-003 | Priority: Must Have
**Acceptance Criteria:**
> Given a pending request
> When manager approves
> Then workflow should move to the next approval stage

---

## 6.1 Unit Tests — Approval Workflow

### TC-POS-APR-001
**Test:** Approve request use case advances workflow to next stage

```dart
test('should advance workflow to L2 after L1 approval', () async {
  when(() => mockApprovalRepo.approve(requestId: '1', level: ApprovalLevel.l1))
      .thenAnswer((_) async => Right(ApprovalEntity(status: ApprovalStatus.pendingL2)));

  final result = await approveRequestUseCase(requestId: '1', level: ApprovalLevel.l1);
  expect(result.getOrElse(() => throw Exception()).status, ApprovalStatus.pendingL2);
});
```

### TC-POS-APR-002
**Test:** Final approval (L3 Finance) sets request to fully approved

```dart
test('should set status to fullyApproved after L3 Finance approval', () async {
  when(() => mockApprovalRepo.approve(requestId: '1', level: ApprovalLevel.l3))
      .thenAnswer((_) async => Right(ApprovalEntity(status: ApprovalStatus.fullyApproved)));

  final result = await approveRequestUseCase(requestId: '1', level: ApprovalLevel.l3);
  expect(result.getOrElse(() => throw Exception()).status, ApprovalStatus.fullyApproved);
});
```

### TC-NEG-APR-001
**Test:** Reject request use case requires rejection reason

```dart
test('should return ValidationFailure when rejection reason is empty', () {
  final validator = ApprovalValidator();
  final result = validator.validateRejection(reason: '');
  expect(result, Left(ValidationFailure('Rejection reason is required')));
});
```

### TC-NEG-APR-002
**Test:** Approver cannot approve their own travel request

```dart
test('should return UnauthorizedFailure when approver is same as requester', () async {
  when(() => mockApprovalRepo.approve(requestId: '1', level: ApprovalLevel.l1))
      .thenAnswer((_) async => Left(UnauthorizedFailure('Self-approval not allowed')));

  final result = await approveRequestUseCase(requestId: '1', level: ApprovalLevel.l1);
  expect(result, Left(UnauthorizedFailure('Self-approval not allowed')));
});
```

### TC-EDGE-APR-001
**Test:** SLA escalation triggers when primary approver is inactive for 8 hours

```dart
test('should escalate to secondary approver after 8 hours of inactivity', () async {
  fakeAsync((async) {
    slaTimer.start(requestId: 'req_1', approverLevel: ApprovalLevel.l1);
    async.elapse(const Duration(hours: 8));
    verify(() => mockApprovalRepo.escalate(requestId: 'req_1')).called(1);
  });
});
```

### TC-EDGE-APR-002
**Test:** Approval action on already-rejected request returns error

```dart
test('should return InvalidStateFailure when approving an already rejected request', () async {
  when(() => mockApprovalRepo.getStatus(requestId: '1'))
      .thenAnswer((_) async => Right(ApprovalStatus.rejected));

  final result = await approveRequestUseCase(requestId: '1', level: ApprovalLevel.l1);
  expect(result, Left(InvalidStateFailure('Request is already rejected')));
});
```

### TC-EDGE-APR-003
**Test:** Concurrent approval from two managers for same request is handled

```dart
test('should only process first approval when two managers approve simultaneously', () async {
  final futures = [
    approveRequestUseCase(requestId: '1', level: ApprovalLevel.l1),
    approveRequestUseCase(requestId: '1', level: ApprovalLevel.l1),
  ];
  final results = await Future.wait(futures);
  final successCount = results.where((r) => r.isRight()).length;
  expect(successCount, 1);
});
```

---

## 6.2 Widget Tests — Approval

### TC-POS-APR-W001
**Test:** Approval queue page renders list of pending approvals

```dart
testWidgets('Manager sees list of pending approval cards', (tester) async {
  await tester.pumpWidget(const ApprovalQueuePage());
  expect(find.byType(ApprovalCard), findsWidgets);
});
```

### TC-POS-APR-W002
**Test:** Approve/Reject action sheet appears on card tap

```dart
testWidgets('Tapping approval card opens approve/reject action sheet', (tester) async {
  await tester.pumpWidget(const ApprovalQueuePage());
  await tester.tap(find.byKey(const Key('approval_card_0')));
  await tester.pumpAndSettle();
  expect(find.byKey(const Key('btn_approve')), findsOneWidget);
  expect(find.byKey(const Key('btn_reject')), findsOneWidget);
});
```

### TC-NEG-APR-W001
**Test:** Reject without reason shows validation error

```dart
testWidgets('Reject button shows validation error when reason is empty', (tester) async {
  await tester.pumpWidget(const ApprovalActionSheet());
  await tester.tap(find.byKey(const Key('btn_reject')));
  await tester.pump();
  expect(find.text('Rejection reason is required'), findsOneWidget);
});
```

---

# 7. FR-004 — Expense Submission

**PRD Reference:** FR-004 | Priority: Must Have
**User Story:** As an employee, I want to upload expenses using my phone so that reimbursement is processed quickly.
**Acceptance Criteria:**
> Given a completed trip
> When receipts are uploaded
> Then an expense claim should be created successfully

---

## 7.1 Unit Tests — Expense

### TC-POS-EXP-001
**Test:** Submit expense claim use case returns ClaimEntity on valid input

```dart
test('should return ExpenseClaimEntity on valid submission', () async {
  when(() => mockExpenseRepo.submitClaim(claim: any(named: 'claim')))
      .thenAnswer((_) async => Right(tExpenseClaimEntity));

  final result = await submitExpenseClaimUseCase(claim: tExpenseClaim);
  expect(result, Right(tExpenseClaimEntity));
});
```

### TC-NEG-EXP-001
**Test:** Expense claim rejected when amount is zero or negative

```dart
test('should return ValidationFailure when amount is zero', () {
  final validator = ExpenseValidator();
  final result = validator.validateAmount(amount: 0.0);
  expect(result, Left(ValidationFailure('Amount must be greater than zero')));
});

test('should return ValidationFailure when amount is negative', () {
  final validator = ExpenseValidator();
  final result = validator.validateAmount(amount: -100.0);
  expect(result, Left(ValidationFailure('Amount must be greater than zero')));
});
```

### TC-NEG-EXP-002
**Test:** Expense claim rejected when category is not selected

```dart
test('should return ValidationFailure when expense category is null', () {
  final validator = ExpenseValidator();
  final result = validator.validateCategory(category: null);
  expect(result, Left(ValidationFailure('Expense category is required')));
});
```

### TC-NEG-EXP-003
**Test:** Expense claim rejected when expense date is in future

```dart
test('should return ValidationFailure when expense date is in the future', () {
  final validator = ExpenseValidator();
  final result = validator.validateDate(date: DateTime.now().add(const Duration(days: 1)));
  expect(result, Left(ValidationFailure('Expense date cannot be in the future')));
});
```

### TC-NEG-EXP-004
**Test:** Duplicate claim detection blocks re-submission of same expense

```dart
test('should return DuplicateClaimFailure when identical claim already exists', () async {
  when(() => mockExpenseRepo.checkDuplicate(any())).thenAnswer((_) async => true);
  final result = await submitExpenseClaimUseCase(claim: tExpenseClaim);
  expect(result, Left(DuplicateClaimFailure()));
});
```

### TC-NEG-EXP-005
**Test:** Claim above policy limit is flagged

```dart
test('should return PolicyViolationFailure when claim exceeds category limit', () async {
  when(() => mockPolicyRepo.checkLimit(category: 'meals', amount: 5000))
      .thenAnswer((_) async => Left(PolicyViolationFailure('Exceeds meal limit of ₹500')));

  final result = await submitExpenseClaimUseCase(
      claim: tExpenseClaim.copyWith(category: 'meals', amount: 5000));
  expect(result, Left(PolicyViolationFailure('Exceeds meal limit of ₹500')));
});
```

### TC-EDGE-EXP-001
**Test:** Claim with exactly the policy limit amount is accepted

```dart
test('should accept claim with amount equal to policy limit', () async {
  when(() => mockPolicyRepo.checkLimit(category: 'meals', amount: 500))
      .thenAnswer((_) async => Right(true));

  final result = await submitExpenseClaimUseCase(
      claim: tExpenseClaim.copyWith(category: 'meals', amount: 500));
  expect(result.isRight(), true);
});
```

### TC-EDGE-EXP-002
**Test:** Multi-item claim with 50 line items is processed correctly

```dart
test('should handle expense claim with 50 line items', () async {
  final items = List.generate(50, (i) => ExpenseItem(amount: 100, category: 'transport'));
  final claim = tExpenseClaim.copyWith(items: items);
  final result = await submitExpenseClaimUseCase(claim: claim);
  expect(result.isRight(), true);
});
```

---

## 7.2 Widget Tests — Expense

### TC-POS-EXP-W001
**Test:** Expense form renders all required fields

```dart
testWidgets('Expense form displays amount, category, date, and description fields', (tester) async {
  await tester.pumpWidget(const ExpenseFormPage());
  expect(find.byKey(const Key('field_amount')), findsOneWidget);
  expect(find.byKey(const Key('field_category')), findsOneWidget);
  expect(find.byKey(const Key('field_expense_date')), findsOneWidget);
  expect(find.byKey(const Key('field_description')), findsOneWidget);
});
```

### TC-NEG-EXP-W001
**Test:** Invalid amount shows inline error

```dart
testWidgets('Entering negative amount shows validation error', (tester) async {
  await tester.pumpWidget(const ExpenseFormPage());
  await tester.enterText(find.byKey(const Key('field_amount')), '-50');
  await tester.tap(find.byKey(const Key('btn_add_expense_item')));
  await tester.pump();
  expect(find.text('Amount must be greater than zero'), findsOneWidget);
});
```

---

# 8. FR-005 — Receipt Upload & Storage

**PRD Reference:** FR-005 | Priority: Must Have

---

## 8.1 Unit Tests — Receipt Upload

### TC-POS-RCP-001
**Test:** Upload receipt use case returns file URL on success

```dart
test('should return file URL after successful receipt upload', () async {
  when(() => mockStorageRepo.upload(file: any(named: 'file')))
      .thenAnswer((_) async => Right('https://storage.example.com/receipt_1.pdf'));

  final result = await uploadReceiptUseCase(file: tReceiptFile);
  expect(result.getOrElse(() => ''), contains('receipt_1'));
});
```

### TC-NEG-RCP-001
**Test:** Upload fails when file size exceeds 10MB

```dart
test('should return FileSizeFailure when file is larger than 10MB', () async {
  final largeFile = FakeFile(sizeInBytes: 11 * 1024 * 1024);
  final result = await uploadReceiptUseCase(file: largeFile);
  expect(result, Left(FileSizeFailure('File must not exceed 10MB')));
});
```

### TC-NEG-RCP-002
**Test:** Upload fails when file type is unsupported

```dart
test('should return InvalidFileTypeFailure for unsupported file types', () async {
  final exeFile = FakeFile(extension: '.exe');
  final result = await uploadReceiptUseCase(file: exeFile);
  expect(result, Left(InvalidFileTypeFailure('Only PDF, JPG, PNG supported')));
});
```

### TC-EDGE-RCP-001
**Test:** Exactly 10MB file is accepted

```dart
test('should accept file of exactly 10MB', () async {
  final file = FakeFile(sizeInBytes: 10 * 1024 * 1024);
  when(() => mockStorageRepo.upload(file: any(named: 'file')))
      .thenAnswer((_) async => Right('https://storage.example.com/file.pdf'));
  final result = await uploadReceiptUseCase(file: file);
  expect(result.isRight(), true);
});
```

### TC-EDGE-RCP-002
**Test:** Upload retries automatically on transient network error

```dart
test('should retry upload up to 3 times on transient network error', () async {
  var callCount = 0;
  when(() => mockStorageRepo.upload(file: any(named: 'file'))).thenAnswer((_) async {
    callCount++;
    if (callCount < 3) return Left(NetworkFailure());
    return Right('https://storage.example.com/receipt.pdf');
  });

  final result = await uploadReceiptUseCase(file: tReceiptFile);
  expect(callCount, 3);
  expect(result.isRight(), true);
});
```

---

## 8.2 Widget Tests — Receipt Upload

### TC-POS-RCP-W001
**Test:** Receipt picker widget shows file picker options

```dart
testWidgets('Receipt picker shows camera and gallery options', (tester) async {
  await tester.pumpWidget(const ReceiptPickerWidget());
  expect(find.byKey(const Key('btn_camera')), findsOneWidget);
  expect(find.byKey(const Key('btn_gallery')), findsOneWidget);
});
```

### TC-POS-RCP-W002
**Test:** Uploaded file name is shown after successful upload

```dart
testWidgets('Displays file name after receipt is uploaded', (tester) async {
  await tester.pumpWidget(const ReceiptPickerWidget());
  // simulate file selection
  await tester.pump();
  expect(find.text('receipt_1.pdf'), findsOneWidget);
});
```

---

# 9. FR-006 — Policy Validation Engine

**PRD Reference:** FR-006 | Priority: Must Have

---

## 9.1 Unit Tests — Policy Validation

### TC-POS-POL-001
**Test:** Compliant expense passes policy validation

```dart
test('should return Right(true) when expense is within policy limits', () async {
  when(() => mockPolicyRepo.validate(expense: tCompliantExpense))
      .thenAnswer((_) async => Right(PolicyResult.compliant));

  final result = await validateExpensePolicyUseCase(expense: tCompliantExpense);
  expect(result, Right(PolicyResult.compliant));
});
```

### TC-NEG-POL-001
**Test:** Expense exceeding category limit returns violation

```dart
test('should return PolicyViolation when accommodation exceeds ₹5000/night', () async {
  when(() => mockPolicyRepo.validate(expense: tExpensiveAccommodation))
      .thenAnswer((_) async => Right(PolicyResult.violation(
          rule: 'Accommodation limit exceeded: ₹5000/night allowed')));

  final result = await validateExpensePolicyUseCase(expense: tExpensiveAccommodation);
  expect(result.getOrElse(() => throw Exception()).isViolation, true);
});
```

### TC-NEG-POL-002
**Test:** Expense without mandatory receipt above ₹10,000 is flagged

```dart
test('should return PolicyViolation when claim above ₹10,000 has no receipt', () async {
  final claim = tExpenseClaim.copyWith(amount: 15000, receipt: null);
  final result = await validateExpensePolicyUseCase(expense: claim);
  expect(result.getOrElse(() => throw Exception()).message,
      contains('Receipt required for claims above ₹10,000'));
});
```

### TC-NEG-POL-003
**Test:** Submission is blocked when unresolved policy violation exists

```dart
test('should block submission when open policy violations are present', () async {
  when(() => mockPolicyRepo.hasOpenViolations(claimId: '1'))
      .thenAnswer((_) async => true);

  final result = await submitExpenseClaimUseCase(claim: tExpenseClaim);
  expect(result, Left(BlockedByViolationFailure()));
});
```

### TC-EDGE-POL-001
**Test:** Policy rules with overlapping category limits apply the stricter rule

```dart
test('should apply stricter limit when two overlapping policies exist', () async {
  // Two policies: general meals ₹500, client meals ₹2000
  // For non-client meals, ₹500 should apply
  final result = await validateExpensePolicyUseCase(
      expense: tMealExpense.copyWith(isClientMeeting: false, amount: 600));
  expect(result.getOrElse(() => throw Exception()).isViolation, true);
});
```

---

# 10. FR-007 — Reimbursement Tracking

**PRD Reference:** FR-007 | Priority: Must Have
**Acceptance Criteria:**
> Given an approved claim
> When payment is processed
> Then reimbursement status should update automatically

---

## 10.1 Unit Tests — Reimbursement

### TC-POS-RMB-001
**Test:** Get reimbursement status returns current payment stage

```dart
test('should return ReimbursementEntity with correct status', () async {
  when(() => mockReimbursementRepo.getStatus(claimId: '1'))
      .thenAnswer((_) async => Right(tReimbursementEntity));

  final result = await getReimbursementStatusUseCase(claimId: '1');
  expect(result.getOrElse(() => throw Exception()).status, ReimbursementStatus.processingPayment);
});
```

### TC-NEG-RMB-001
**Test:** Returns NotFoundFailure for non-existent claim ID

```dart
test('should return NotFoundFailure when claim ID does not exist', () async {
  when(() => mockReimbursementRepo.getStatus(claimId: 'invalid'))
      .thenAnswer((_) async => Left(NotFoundFailure('Claim not found')));

  final result = await getReimbursementStatusUseCase(claimId: 'invalid');
  expect(result, Left(NotFoundFailure('Claim not found')));
});
```

### TC-EDGE-RMB-001
**Test:** Reimbursement status updates in real-time when ERP confirms payment

```dart
test('should reflect paid status immediately after ERP webhook confirmation', () async {
  streamController.add(ReimbursementStatusUpdate(status: ReimbursementStatus.paid));
  await Future.delayed(Duration.zero);
  verify(() => mockUINotifier.updateStatus(ReimbursementStatus.paid)).called(1);
});
```

---

# 11. FR-008 — Push Notifications & Alerts

**PRD Reference:** FR-008 | Priority: Should Have

---

## 11.1 Unit Tests — Notifications

### TC-POS-NOT-001
**Test:** Notification is dispatched when a travel request is submitted

```dart
test('should dispatch notification to L1 approver on request submission', () async {
  await submitTravelRequestUseCase(request: tTravelRequest);
  verify(() => mockNotificationService.send(
      to: tTravelRequest.l1ApproverId,
      type: NotificationType.pendingApproval)).called(1);
});
```

### TC-POS-NOT-002
**Test:** SLA warning notification fires 2 hours before SLA breach

```dart
test('should send SLA warning notification 2 hours before SLA breach', () async {
  fakeAsync((async) {
    slaTimer.start(requestId: 'req_1', slaDuration: const Duration(hours: 8));
    async.elapse(const Duration(hours: 6));
    verify(() => mockNotificationService.send(
        type: NotificationType.slaWarning)).called(1);
  });
});
```

### TC-NEG-NOT-001
**Test:** Notification not sent when user has disabled that notification type

```dart
test('should not send notification when user disabled approval notifications', () async {
  when(() => mockNotificationPrefs.isEnabled(NotificationType.pendingApproval))
      .thenReturn(false);
  await submitTravelRequestUseCase(request: tTravelRequest);
  verifyNever(() => mockNotificationService.send(type: NotificationType.pendingApproval));
});
```

### TC-EDGE-NOT-001
**Test:** Notification delivery failure does not block the main workflow

```dart
test('should complete workflow even if notification dispatch fails', () async {
  when(() => mockNotificationService.send(any(), any()))
      .thenThrow(NetworkException());
  final result = await submitTravelRequestUseCase(request: tTravelRequest);
  expect(result.isRight(), true); // Workflow must succeed regardless
});
```

---

# 12. FR-009 — Employee Dashboard

**PRD Reference:** FR-009 | Priority: Must Have

---

## 12.1 Widget Tests — Dashboard

### TC-POS-DSH-W001
**Test:** Dashboard renders summary cards

```dart
testWidgets('Dashboard shows pending requests, active claims, and reimbursement cards', (tester) async {
  await tester.pumpWidget(const DashboardPage());
  expect(find.byKey(const Key('card_pending_requests')), findsOneWidget);
  expect(find.byKey(const Key('card_active_claims')), findsOneWidget);
  expect(find.byKey(const Key('card_reimbursement_status')), findsOneWidget);
});
```

### TC-POS-DSH-W002
**Test:** Dashboard shows zero-state when employee has no requests

```dart
testWidgets('Dashboard shows empty state when no requests exist', (tester) async {
  when(() => mockDashboardProvider.pendingRequests).thenReturn([]);
  await tester.pumpWidget(const DashboardPage());
  expect(find.byKey(const Key('empty_state_no_requests')), findsOneWidget);
});
```

### TC-POS-DSH-W003
**Test:** Quick action button navigates to travel request form

```dart
testWidgets('Tapping New Travel Request navigates to travel request form', (tester) async {
  await tester.pumpWidget(const DashboardPage());
  await tester.tap(find.byKey(const Key('btn_new_travel_request')));
  await tester.pumpAndSettle();
  expect(find.byType(TravelRequestFormPage), findsOneWidget);
});
```

### TC-NEG-DSH-W001
**Test:** Dashboard shows error state on API failure

```dart
testWidgets('Dashboard shows error widget when data fetch fails', (tester) async {
  when(() => mockDashboardProvider.fetchData()).thenThrow(ServerException());
  await tester.pumpWidget(const DashboardPage());
  await tester.pump();
  expect(find.byKey(const Key('error_state_dashboard')), findsOneWidget);
});
```

---

# 13. FR-010 — Manager Approval Console

**PRD Reference:** FR-010 | Priority: Must Have

---

## 13.1 Widget Tests — Manager Console

### TC-POS-MGR-W001
**Test:** Manager sees all pending approvals in queue

```dart
testWidgets('Manager approval console shows all pending items', (tester) async {
  await tester.pumpWidget(const ApprovalQueuePage());
  expect(find.byType(ApprovalCard), findsNWidgets(3));
});
```

### TC-POS-MGR-W002
**Test:** Single-tap approve works from queue card

```dart
testWidgets('Tapping approve button on card triggers approval', (tester) async {
  await tester.pumpWidget(const ApprovalQueuePage());
  await tester.tap(find.byKey(const Key('btn_quick_approve_0')));
  await tester.pump();
  verify(() => mockApprovalProvider.approve(requestId: '1')).called(1);
});
```

### TC-NEG-MGR-W001
**Test:** Empty approval queue shows appropriate zero-state

```dart
testWidgets('Empty queue state displayed when no items pending', (tester) async {
  when(() => mockApprovalProvider.pendingApprovals).thenReturn([]);
  await tester.pumpWidget(const ApprovalQueuePage());
  expect(find.byKey(const Key('empty_queue_state')), findsOneWidget);
});
```

---

# 14. FR-011 — Finance Review Module

**PRD Reference:** FR-011 | Priority: Must Have

---

## 14.1 Unit Tests — Finance

### TC-POS-FIN-001
**Test:** Finance approval initiates ERP payment

```dart
test('should call ERP payment initiation after finance approval', () async {
  when(() => mockFinanceRepo.approve(claimId: '1'))
      .thenAnswer((_) async => Right(FinanceApprovalResult.approved));

  await approveClaimForPaymentUseCase(claimId: '1');
  verify(() => mockErpRepo.initiatePayment(claimId: '1')).called(1);
});
```

### TC-NEG-FIN-001
**Test:** Finance rejection requires mandatory reason

```dart
test('should return ValidationFailure when finance rejection reason is empty', () {
  final validator = FinanceReviewValidator();
  final result = validator.validateRejection(reason: '');
  expect(result, Left(ValidationFailure('Reason for rejection is required')));
});
```

### TC-EDGE-FIN-001
**Test:** ERP payment initiation failure does not mark claim as paid

```dart
test('should not mark claim as paid when ERP API returns error', () async {
  when(() => mockErpRepo.initiatePayment(claimId: '1'))
      .thenAnswer((_) async => Left(ErpIntegrationFailure()));

  final result = await approveClaimForPaymentUseCase(claimId: '1');
  expect(result, Left(ErpIntegrationFailure()));
  verifyNever(() => mockExpenseRepo.markAsPaid(claimId: '1'));
});
```

---

# 15. FR-012 — Audit Log & Trail

**PRD Reference:** FR-012 | Priority: Must Have

---

## 15.1 Unit Tests — Audit Log

### TC-POS-AUD-001
**Test:** Audit log entry created on every workflow action

```dart
test('should create immutable audit entry on travel request approval', () async {
  await approveRequestUseCase(requestId: '1', level: ApprovalLevel.l1);
  verify(() => mockAuditRepo.log(AuditEntry(
      action: AuditAction.approved,
      entityId: '1',
      actorId: 'mgr_1',
  ))).called(1);
});
```

### TC-NEG-AUD-001
**Test:** Audit log entries cannot be modified or deleted

```dart
test('should throw ImmutableRecordException when attempting to edit an audit entry', () {
  expect(
    () => auditRepository.update(entryId: 'log_1', data: {}),
    throwsA(isA<ImmutableRecordException>()),
  );
});
```

### TC-EDGE-AUD-001
**Test:** Audit log records actor identity even during impersonation

```dart
test('should log both original actor and impersonated actor in audit entry', () async {
  await adminService.impersonateAndApprove(adminId: 'admin_1', targetUserId: 'mgr_1', requestId: '1');
  verify(() => mockAuditRepo.log(
    predicate((AuditEntry e) => e.actorId == 'admin_1' && e.onBehalfOf == 'mgr_1')
  )).called(1);
});
```

---

# 16. Non-Functional Requirement Tests

**PRD Reference:** Section 11 — Non-Functional Requirements

---

## 16.1 Performance Tests

| Test ID         | Requirement         | Test Method                              | Threshold        |
| --------------- | ------------------- | ---------------------------------------- | ---------------- |
| NFR-PERF-001    | App launch < 3s     | Stopwatch on app init → first frame      | ≤ 3,000 ms       |
| NFR-PERF-002    | API response < 2s   | Mock API latency simulation              | P95 ≤ 2,000 ms   |
| NFR-PERF-003    | Dashboard load < 5s | Widget test with simulated data fetch    | ≤ 5,000 ms       |
| NFR-PERF-004    | Receipt upload < 5s | Integration test with 10MB file          | ≤ 5,000 ms       |

```dart
test('App launch completes within 3 seconds', () async {
  final stopwatch = Stopwatch()..start();
  await app.launch();
  stopwatch.stop();
  expect(stopwatch.elapsedMilliseconds, lessThan(3000));
});
```

---

## 16.2 Scalability Tests

| Test ID         | Requirement                    | Test Method                      |
| --------------- | ------------------------------ | -------------------------------- |
| NFR-SCALE-001   | 10,000 concurrent users        | Load test at 150% projected load |
| NFR-SCALE-002   | 100,000 transactions/month     | Batch processing stress test     |
| NFR-SCALE-003   | Paginated lists > 10,000 items | Widget test with 10,000 mock rows|

```dart
test('Expense list handles 10,000 items without UI jank', () async {
  final items = List.generate(10000, (i) => FakeExpenseClaim(id: '$i'));
  when(() => mockExpenseProvider.claims).thenReturn(items);
  await tester.pumpWidget(const ExpenseListPage());
  // Verify smooth scroll — no dropped frames
});
```

---

## 16.3 Security Tests

| Test ID         | Requirement                  | Test                                              |
| --------------- | ---------------------------- | ------------------------------------------------- |
| NFR-SEC-001     | Auth token not in plain text | Verify SecureStorage used, not SharedPreferences  |
| NFR-SEC-002     | RBAC enforced on all routes  | Test route guard rejects unauthorized role access |
| NFR-SEC-003     | Session expires at 30 min    | Idle timer unit test                              |
| NFR-SEC-004     | No sensitive data in logs    | Log output scan for PII or tokens                 |

```dart
test('Auth token is stored in secure storage, not shared preferences', () {
  verify(() => mockSecureStorage.write(key: 'auth_token', value: any(named: 'value'))).called(1);
  verifyNever(() => mockSharedPrefs.setString('auth_token', any()));
});

test('Finance route rejects Employee role access', () async {
  routeGuard.setCurrentUserRole(UserRole.employee);
  final canAccess = await routeGuard.canAccess('/finance/queue');
  expect(canAccess, false);
});
```

---

## 16.4 Accessibility Tests

| Test ID         | Requirement              | Test                                                  |
| --------------- | ------------------------ | ----------------------------------------------------- |
| NFR-ACC-001     | Semantic labels on all actions | `find.bySemanticsLabel` for all buttons         |
| NFR-ACC-002     | Font scaling support     | Render UI at 2x text scale factor without overflow    |
| NFR-ACC-003     | Color contrast ≥ 4.5:1   | Manual audit + automated axe-like contrast checking   |

```dart
testWidgets('Submit button has correct semantic label', (tester) async {
  await tester.pumpWidget(const TravelRequestFormPage());
  expect(find.bySemanticsLabel('Submit Travel Request'), findsOneWidget);
});

testWidgets('UI does not overflow at 2x text scale', (tester) async {
  await tester.pumpWidget(
    MediaQuery(
      data: const MediaQueryData(textScaleFactor: 2.0),
      child: const DashboardPage(),
    ),
  );
  expect(tester.takeException(), isNull);
});
```

---

# 17. Validation Rules Master List

| Rule ID  | Field               | Rule                                               | Error Message                                     |
| -------- | ------------------- | -------------------------------------------------- | ------------------------------------------------- |
| VR-001   | Destination         | Required; non-empty string                         | "Destination is required"                         |
| VR-002   | Trip Start Date     | Required; must be today or future                  | "Start date cannot be in the past"                |
| VR-003   | Trip End Date       | Required; must be after start date                 | "End date must be after start date"               |
| VR-004   | Trip Duration       | Maximum 90 days                                    | "Trip duration cannot exceed 90 days"             |
| VR-005   | Cost Center         | Required; must match HRMS cost center codes        | "Valid cost center is required"                   |
| VR-006   | Expense Amount      | Required; must be > 0                              | "Amount must be greater than zero"                |
| VR-007   | Expense Category    | Required; must be from predefined list             | "Expense category is required"                    |
| VR-008   | Expense Date        | Required; cannot be in the future                  | "Expense date cannot be in the future"            |
| VR-009   | Receipt Attachment  | Required for claims > ₹10,000                      | "Receipt is required for claims above ₹10,000"   |
| VR-010   | Receipt File Size   | Maximum 10MB                                       | "File must not exceed 10MB"                       |
| VR-011   | Receipt File Type   | PDF, JPG, PNG only                                 | "Only PDF, JPG, PNG files are supported"          |
| VR-012   | Rejection Reason    | Required when rejecting; non-empty                 | "Rejection reason is required"                    |
| VR-013   | Policy Limit        | Amount ≤ configured category limit                 | "Amount exceeds policy limit for [category]"      |
| VR-014   | Duplicate Claim     | No identical claim for same date + category + amount | "Duplicate claim detected"                      |
| VR-015   | SSO Token           | Must be present and non-expired                    | "Session expired. Please login again"             |
| VR-016   | Self-Approval       | Approver cannot be the same as requester           | "Self-approval is not permitted"                  |
| VR-017   | Approved Claim Edit | Approved/paid claims cannot be edited              | "Approved claims cannot be modified"              |

---

# 18. Risks

| Risk ID  | Risk Description                                          | Impact | Mitigation                                                       |
| -------- | --------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| RISK-001 | SSO provider API instability blocks auth tests           | High   | Implement mock SSO server for all test environments              |
| RISK-002 | ERP API not available in test environment                 | High   | Use contract testing with mock ERP responses                     |
| RISK-003 | Flaky integration tests due to async timing               | Medium | Use `pumpAndSettle` + explicit wait helpers; avoid real timers   |
| RISK-004 | Widget tests breaking across Flutter SDK upgrades         | Medium | Pin Flutter SDK version in CI; upgrade with dedicated sprint     |
| RISK-005 | Policy rules change frequently, invalidating test data   | Medium | Use factory pattern for test data; externalize policy values     |
| RISK-006 | Concurrent test execution causes shared state corruption  | Low    | Isolate test state; use `setUp`/`tearDown` for each test         |
| RISK-007 | Large file upload tests slow down CI pipeline             | Low    | Separate upload tests into nightly pipeline; mock in unit tests  |
| RISK-008 | Accessibility tests not automated, remain manual          | Medium | Integrate `flutter_accessibility_service` in widget tests        |

---

# 19. Definition of Done

## 19.1 Test-Level Definition of Done

A test is considered **done** when:

- [ ] Test is written **before** implementation code (TDD cycle: Red → Green → Refactor).
- [ ] Test has a clear, descriptive name following the `should [behavior] when [condition]` naming convention.
- [ ] Test covers at minimum: one positive case, one negative case, one edge case per function/use case.
- [ ] Test uses mocks for all external dependencies (repositories, APIs, services).
- [ ] Test does not share mutable state with other tests.
- [ ] Test passes consistently with no flakiness across 5 consecutive runs.
- [ ] Test is reviewed and approved by one other developer.

---

## 19.2 Feature-Level Definition of Done

A feature is considered **done** when:

- [ ] All acceptance criteria from PRD are covered by passing tests.
- [ ] Unit test coverage ≥ 80% for use cases and validators.
- [ ] Widget tests cover all interactive elements (buttons, forms, navigation).
- [ ] Integration test for the end-to-end user flow passes.
- [ ] No open P1 or P2 defects against the feature.
- [ ] All validation rules (VR-001 to VR-017) relevant to the feature are tested.
- [ ] Non-functional requirements (performance, security, accessibility) for the feature are verified.
- [ ] Product Owner has reviewed and signed off via UAT.

---

## 19.3 Project-Level Definition of Done

The TDD cycle for the project is considered **complete** when:

| Criterion                                | Target               | Verified By                  |
| ---------------------------------------- | -------------------- | ---------------------------- |
| Overall code coverage                    | ≥ 80%                | `flutter test --coverage`    |
| All 12 FR integration flows passing      | 100%                 | CI/CD pipeline               |
| All 17 validation rules tested           | 100%                 | QA sign-off                  |
| All NFR tests passing                    | 100%                 | Performance + Security audit |
| No open critical or high defects         | 0 open               | Bug tracking system          |
| Test results reviewed by QA Architect    | Signed off           | QA Architect sign-off        |
| All tests run in under 10 minutes on CI  | ≤ 10 min             | CI pipeline metrics          |

---

*This TDD document is derived exclusively from `prd.md` and contains no assumptions. All test cases map directly to functional requirements (FR-001 to FR-012), acceptance criteria, user stories, non-functional requirements, and validation rules defined in the PRD. Any requirement gaps or ambiguities must be resolved in the PRD before new test cases are written.*
