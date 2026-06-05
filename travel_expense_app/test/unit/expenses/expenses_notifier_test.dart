import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:fpdart/fpdart.dart';
import 'package:travel_expense_app/features/expenses/domain/entities/expense_claim_entity.dart';
import 'package:travel_expense_app/features/expenses/domain/usecases/get_expense_claims_usecase.dart';
import 'package:travel_expense_app/features/expenses/domain/usecases/get_expense_claim_by_id_usecase.dart';
import 'package:travel_expense_app/features/expenses/domain/usecases/submit_expense_claim_usecase.dart';
import 'package:travel_expense_app/features/expenses/domain/usecases/upload_receipt_usecase.dart';
import 'package:travel_expense_app/features/expenses/presentation/providers/expenses_provider.dart';

class MockGetExpenseClaimsUseCase extends Mock implements GetExpenseClaimsUseCase {}
class MockGetExpenseClaimByIdUseCase extends Mock implements GetExpenseClaimByIdUseCase {}
class MockSubmitExpenseClaimUseCase extends Mock implements SubmitExpenseClaimUseCase {}
class MockUploadReceiptUseCase extends Mock implements UploadReceiptUseCase {}

void main() {
  late MockGetExpenseClaimsUseCase mockGetExpenseClaimsUseCase;
  late MockGetExpenseClaimByIdUseCase mockGetExpenseClaimByIdUseCase;
  late MockSubmitExpenseClaimUseCase mockSubmitExpenseClaimUseCase;
  late MockUploadReceiptUseCase mockUploadReceiptUseCase;
  late ExpensesNotifier expensesNotifier;

  final tClaim = ExpenseClaimEntity(
    id: 'claim-123',
    claimAmount: 1200.0,
    status: 'submitted',
    userId: 'user-789',
    items: const [],
    createdAt: DateTime(2026, 6, 1),
  );

  setUp(() {
    mockGetExpenseClaimsUseCase = MockGetExpenseClaimsUseCase();
    mockGetExpenseClaimByIdUseCase = MockGetExpenseClaimByIdUseCase();
    mockSubmitExpenseClaimUseCase = MockSubmitExpenseClaimUseCase();
    mockUploadReceiptUseCase = MockUploadReceiptUseCase();

    when(() => mockGetExpenseClaimsUseCase()).thenAnswer(
      (_) async => const Right([]),
    );

    expensesNotifier = ExpensesNotifier(
      getExpenseClaimsUseCase: mockGetExpenseClaimsUseCase,
      getExpenseClaimByIdUseCase: mockGetExpenseClaimByIdUseCase,
      submitExpenseClaimUseCase: mockSubmitExpenseClaimUseCase,
      uploadReceiptUseCase: mockUploadReceiptUseCase,
    );
  });

  test('initial state should be correct', () {
    expect(expensesNotifier.state.claims, isEmpty);
    expect(expensesNotifier.state.isLoading, false);
    expect(expensesNotifier.state.isSubmitting, false);
    expect(expensesNotifier.state.isSubmitted, false);
    expect(expensesNotifier.state.uploadedReceiptUrl, isNull);
    expect(expensesNotifier.state.isUploadingReceipt, false);
    expect(expensesNotifier.state.errorMessage, isNull);
  });

  group('loadExpenseClaims', () {
    test('should emit loading and set claims on success', () async {
      when(() => mockGetExpenseClaimsUseCase()).thenAnswer(
        (_) async => Right([tClaim]),
      );

      final future = expensesNotifier.loadExpenseClaims();

      expect(expensesNotifier.state.isLoading, true);
      await future;
      expect(expensesNotifier.state.isLoading, false);
      expect(expensesNotifier.state.claims, [tClaim]);
    });
  });

  group('loadExpenseClaimById', () {
    test('should fetch and update/append specific claim in list', () async {
      when(() => mockGetExpenseClaimByIdUseCase(any())).thenAnswer(
        (_) async => Right(tClaim),
      );

      final future = expensesNotifier.loadExpenseClaimById(tClaim.id);

      expect(expensesNotifier.state.isLoading, true);
      await future;
      expect(expensesNotifier.state.isLoading, false);
      expect(expensesNotifier.state.claims.contains(tClaim), true);
    });
  });

  group('submitClaim', () {
    test('should emit isSubmitting and insert new claim on success', () async {
      when(() => mockSubmitExpenseClaimUseCase(
            travelRequestId: any(named: 'travelRequestId'),
            items: any(named: 'items'),
          )).thenAnswer((_) async => Right(tClaim));

      final future = expensesNotifier.submitClaim(
        travelRequestId: 'req-123',
        items: const [],
      );

      expect(expensesNotifier.state.isSubmitting, true);
      await future;
      expect(expensesNotifier.state.isSubmitting, false);
      expect(expensesNotifier.state.isSubmitted, true);
      expect(expensesNotifier.state.claims.first, tClaim);
    });
  });

  group('uploadReceipt', () {
    test('should set uploadedReceiptUrl on success', () async {
      const mockUrl = 'http://localhost/receipt.png';
      when(() => mockUploadReceiptUseCase(any(), any())).thenAnswer(
        (_) async => const Right(mockUrl),
      );

      final future = expensesNotifier.uploadReceipt('path/to/file', 'file.png');

      expect(expensesNotifier.state.isUploadingReceipt, true);
      final res = await future;
      expect(expensesNotifier.state.isUploadingReceipt, false);
      expect(expensesNotifier.state.uploadedReceiptUrl, mockUrl);
      expect(res, mockUrl);
    });
  });
}
