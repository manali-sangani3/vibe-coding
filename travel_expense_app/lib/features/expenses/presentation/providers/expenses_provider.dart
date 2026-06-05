import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/entities/expense_claim_entity.dart';
import '../../domain/usecases/get_expense_claims_usecase.dart';
import '../../domain/usecases/get_expense_claim_by_id_usecase.dart';
import '../../domain/usecases/submit_expense_claim_usecase.dart';
import '../../domain/usecases/upload_receipt_usecase.dart';

class ExpensesState {
  final List<ExpenseClaimEntity> claims;
  final bool isLoading;
  final String? errorMessage;
  final bool isSubmitting;
  final bool isSubmitted;
  final String? uploadedReceiptUrl;
  final bool isUploadingReceipt;

  const ExpensesState({
    this.claims = const [],
    this.isLoading = false,
    this.errorMessage,
    this.isSubmitting = false,
    this.isSubmitted = false,
    this.uploadedReceiptUrl,
    this.isUploadingReceipt = false,
  });

  ExpensesState copyWith({
    List<ExpenseClaimEntity>? claims,
    bool? isLoading,
    String? errorMessage,
    bool? isSubmitting,
    bool? isSubmitted,
    String? uploadedReceiptUrl,
    bool? isUploadingReceipt,
    bool clearError = false,
    bool clearReceipt = false,
  }) {
    return ExpensesState(
      claims: claims ?? this.claims,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isSubmitted: isSubmitted ?? this.isSubmitted,
      uploadedReceiptUrl: clearReceipt ? null : (uploadedReceiptUrl ?? this.uploadedReceiptUrl),
      isUploadingReceipt: isUploadingReceipt ?? this.isUploadingReceipt,
    );
  }
}

class ExpensesNotifier extends StateNotifier<ExpensesState> {
  final GetExpenseClaimsUseCase _getExpenseClaimsUseCase;
  final GetExpenseClaimByIdUseCase _getExpenseClaimByIdUseCase;
  final SubmitExpenseClaimUseCase _submitExpenseClaimUseCase;
  final UploadReceiptUseCase _uploadReceiptUseCase;

  ExpensesNotifier({
    required GetExpenseClaimsUseCase getExpenseClaimsUseCase,
    required GetExpenseClaimByIdUseCase getExpenseClaimByIdUseCase,
    required SubmitExpenseClaimUseCase submitExpenseClaimUseCase,
    required UploadReceiptUseCase uploadReceiptUseCase,
  })  : _getExpenseClaimsUseCase = getExpenseClaimsUseCase,
        _getExpenseClaimByIdUseCase = getExpenseClaimByIdUseCase,
        _submitExpenseClaimUseCase = submitExpenseClaimUseCase,
        _uploadReceiptUseCase = uploadReceiptUseCase,
        super(const ExpensesState()) {
    loadExpenseClaims();
  }

  Future<void> loadExpenseClaims() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getExpenseClaimsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (list) => state = state.copyWith(isLoading: false, claims: list),
    );
  }

  Future<void> loadExpenseClaimById(String id) async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getExpenseClaimByIdUseCase(id);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (claim) {
        final idx = state.claims.indexWhere((c) => c.id == id);
        if (idx != -1) {
          final updated = List<ExpenseClaimEntity>.from(state.claims)..[idx] = claim;
          state = state.copyWith(isLoading: false, claims: updated);
        } else {
          state = state.copyWith(isLoading: false, claims: [...state.claims, claim]);
        }
      },
    );
  }

  Future<void> submitClaim({
    String? travelRequestId,
    required List<ExpenseItemEntity> items,
  }) async {
    state = state.copyWith(isSubmitting: true, isSubmitted: false, clearError: true);
    final result = await _submitExpenseClaimUseCase(
      travelRequestId: travelRequestId,
      items: items,
    );
    result.fold(
      (failure) => state = state.copyWith(isSubmitting: false, errorMessage: failure.message),
      (newClaim) {
        final updatedClaims = List<ExpenseClaimEntity>.from(state.claims)..insert(0, newClaim);
        state = state.copyWith(
          isSubmitting: false,
          isSubmitted: true,
          claims: updatedClaims,
        );
      },
    );
  }

  Future<String?> uploadReceipt(String filePath, String fileName) async {
    state = state.copyWith(isUploadingReceipt: true, clearError: true, clearReceipt: true);
    final result = await _uploadReceiptUseCase(filePath, fileName);
    return result.fold(
      (failure) {
        state = state.copyWith(isUploadingReceipt: false, errorMessage: failure.message);
        return null;
      },
      (receiptUrl) {
        state = state.copyWith(
          isUploadingReceipt: false,
          uploadedReceiptUrl: receiptUrl,
        );
        return receiptUrl;
      },
    );
  }

  void resetSubmitFlag() {
    state = state.copyWith(isSubmitted: false);
  }

  void clearUploadedReceipt() {
    state = state.copyWith(clearReceipt: true);
  }
}

final expensesNotifierProvider =
    StateNotifierProvider<ExpensesNotifier, ExpensesState>((ref) {
  return ExpensesNotifier(
    getExpenseClaimsUseCase: sl<GetExpenseClaimsUseCase>(),
    getExpenseClaimByIdUseCase: sl<GetExpenseClaimByIdUseCase>(),
    submitExpenseClaimUseCase: sl<SubmitExpenseClaimUseCase>(),
    uploadReceiptUseCase: sl<UploadReceiptUseCase>(),
  );
});
