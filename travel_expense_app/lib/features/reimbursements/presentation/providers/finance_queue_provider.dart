import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/usecases/get_pending_reimbursements_usecase.dart';
import '../../domain/usecases/mark_reimbursement_as_paid_usecase.dart';

class FinanceQueueState {
  final List<Map<String, dynamic>> pendingClaims;
  final bool isLoading;
  final String? errorMessage;
  final bool isProcessing;

  const FinanceQueueState({
    this.pendingClaims = const [],
    this.isLoading = false,
    this.errorMessage,
    this.isProcessing = false,
  });

  FinanceQueueState copyWith({
    List<Map<String, dynamic>>? pendingClaims,
    bool? isLoading,
    String? errorMessage,
    bool? isProcessing,
    bool clearError = false,
  }) {
    return FinanceQueueState(
      pendingClaims: pendingClaims ?? this.pendingClaims,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isProcessing: isProcessing ?? this.isProcessing,
    );
  }
}

class FinanceQueueNotifier extends StateNotifier<FinanceQueueState> {
  final GetPendingReimbursementsUseCase _getPendingReimbursementsUseCase;
  final MarkReimbursementAsPaidUseCase _markReimbursementAsPaidUseCase;

  FinanceQueueNotifier({
    required GetPendingReimbursementsUseCase getPendingReimbursementsUseCase,
    required MarkReimbursementAsPaidUseCase markReimbursementAsPaidUseCase,
  })  : _getPendingReimbursementsUseCase = getPendingReimbursementsUseCase,
        _markReimbursementAsPaidUseCase = markReimbursementAsPaidUseCase,
        super(const FinanceQueueState()) {
    loadPendingReimbursements();
  }

  Future<void> loadPendingReimbursements() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getPendingReimbursementsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (list) => state = state.copyWith(isLoading: false, pendingClaims: list),
    );
  }

  Future<bool> processPayout(String claimId, String paymentRef) async {
    state = state.copyWith(isProcessing: true, clearError: true);
    final result = await _markReimbursementAsPaidUseCase(claimId, paymentRef);
    return result.fold(
      (failure) {
        state = state.copyWith(isProcessing: false, errorMessage: failure.message);
        return false;
      },
      (_) {
        state = state.copyWith(isProcessing: false);
        loadPendingReimbursements();
        return true;
      },
    );
  }
}

final financeQueueNotifierProvider =
    StateNotifierProvider.autoDispose<FinanceQueueNotifier, FinanceQueueState>((ref) {
  return FinanceQueueNotifier(
    getPendingReimbursementsUseCase: sl<GetPendingReimbursementsUseCase>(),
    markReimbursementAsPaidUseCase: sl<MarkReimbursementAsPaidUseCase>(),
  );
});
