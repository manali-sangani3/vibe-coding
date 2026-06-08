import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../../expenses/domain/entities/expense_claim_entity.dart';
import '../../../expenses/domain/usecases/get_pending_expense_approvals_usecase.dart';
import '../../../expenses/domain/usecases/manager_approve_expense_claim_usecase.dart';

class ExpenseApprovalsState {
  final List<ExpenseClaimEntity> pendingClaims;
  final bool isLoading;
  final String? errorMessage;
  final bool isProcessing;
  final bool isProcessed;

  const ExpenseApprovalsState({
    this.pendingClaims = const [],
    this.isLoading = false,
    this.errorMessage,
    this.isProcessing = false,
    this.isProcessed = false,
  });

  ExpenseApprovalsState copyWith({
    List<ExpenseClaimEntity>? pendingClaims,
    bool? isLoading,
    String? errorMessage,
    bool? isProcessing,
    bool? isProcessed,
    bool clearError = false,
  }) {
    return ExpenseApprovalsState(
      pendingClaims: pendingClaims ?? this.pendingClaims,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isProcessing: isProcessing ?? this.isProcessing,
      isProcessed: isProcessed ?? this.isProcessed,
    );
  }
}

class ExpenseApprovalsNotifier extends StateNotifier<ExpenseApprovalsState> {
  final GetPendingExpenseApprovalsUseCase _getPendingExpenseApprovalsUseCase;
  final ManagerApproveExpenseClaimUseCase _managerApproveExpenseClaimUseCase;

  ExpenseApprovalsNotifier({
    required GetPendingExpenseApprovalsUseCase getPendingExpenseApprovalsUseCase,
    required ManagerApproveExpenseClaimUseCase managerApproveExpenseClaimUseCase,
  })  : _getPendingExpenseApprovalsUseCase = getPendingExpenseApprovalsUseCase,
        _managerApproveExpenseClaimUseCase = managerApproveExpenseClaimUseCase,
        super(const ExpenseApprovalsState()) {
    loadPendingClaims();
  }

  Future<void> loadPendingClaims() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getPendingExpenseApprovalsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (list) => state = state.copyWith(isLoading: false, pendingClaims: list),
    );
  }

  Future<void> approveClaim(String claimId) async {
    state = state.copyWith(isProcessing: true, isProcessed: false, clearError: true);
    final result = await _managerApproveExpenseClaimUseCase(claimId);
    result.fold(
      (failure) => state = state.copyWith(isProcessing: false, errorMessage: failure.message),
      (_) {
        final updated = state.pendingClaims.where((item) => item.id != claimId).toList();
        state = state.copyWith(
          isProcessing: false,
          isProcessed: true,
          pendingClaims: updated,
        );
      },
    );
  }

  void resetProcessedFlag() {
    state = state.copyWith(isProcessed: false);
  }
}

final expenseApprovalsNotifierProvider =
    StateNotifierProvider.autoDispose<ExpenseApprovalsNotifier, ExpenseApprovalsState>((ref) {
  return ExpenseApprovalsNotifier(
    getPendingExpenseApprovalsUseCase: sl<GetPendingExpenseApprovalsUseCase>(),
    managerApproveExpenseClaimUseCase: sl<ManagerApproveExpenseClaimUseCase>(),
  );
});
