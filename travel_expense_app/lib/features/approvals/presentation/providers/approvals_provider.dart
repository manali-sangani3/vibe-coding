import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/entities/approval_stage_entity.dart';
import '../../domain/usecases/get_pending_approvals_usecase.dart';
import '../../domain/usecases/approve_stage_usecase.dart';
import '../../domain/usecases/reject_stage_usecase.dart';

class ApprovalsState {
  final List<ApprovalStageEntity> pendingApprovals;
  final bool isLoading;
  final String? errorMessage;
  final bool isProcessing;
  final bool isProcessed;

  const ApprovalsState({
    this.pendingApprovals = const [],
    this.isLoading = false,
    this.errorMessage,
    this.isProcessing = false,
    this.isProcessed = false,
  });

  ApprovalsState copyWith({
    List<ApprovalStageEntity>? pendingApprovals,
    bool? isLoading,
    String? errorMessage,
    bool? isProcessing,
    bool? isProcessed,
    bool clearError = false,
  }) {
    return ApprovalsState(
      pendingApprovals: pendingApprovals ?? this.pendingApprovals,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isProcessing: isProcessing ?? this.isProcessing,
      isProcessed: isProcessed ?? this.isProcessed,
    );
  }
}

class ApprovalsNotifier extends StateNotifier<ApprovalsState> {
  final GetPendingApprovalsUseCase _getPendingApprovalsUseCase;
  final ApproveStageUseCase _approveStageUseCase;
  final RejectStageUseCase _rejectStageUseCase;

  ApprovalsNotifier({
    required GetPendingApprovalsUseCase getPendingApprovalsUseCase,
    required ApproveStageUseCase approveStageUseCase,
    required RejectStageUseCase rejectStageUseCase,
  })  : _getPendingApprovalsUseCase = getPendingApprovalsUseCase,
        _approveStageUseCase = approveStageUseCase,
        _rejectStageUseCase = rejectStageUseCase,
        super(const ApprovalsState()) {
    loadPendingApprovals();
  }

  Future<void> loadPendingApprovals() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getPendingApprovalsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (list) => state = state.copyWith(isLoading: false, pendingApprovals: list),
    );
  }

  Future<void> approveApprovalStage(String stageId) async {
    state = state.copyWith(isProcessing: true, isProcessed: false, clearError: true);
    final result = await _approveStageUseCase(stageId);
    result.fold(
      (failure) => state = state.copyWith(isProcessing: false, errorMessage: failure.message),
      (_) {
        final updated = state.pendingApprovals.where((item) => item.id != stageId).toList();
        state = state.copyWith(
          isProcessing: false,
          isProcessed: true,
          pendingApprovals: updated,
        );
      },
    );
  }

  Future<void> rejectApprovalStage(String stageId, String reason) async {
    state = state.copyWith(isProcessing: true, isProcessed: false, clearError: true);
    final result = await _rejectStageUseCase(stageId, reason);
    result.fold(
      (failure) => state = state.copyWith(isProcessing: false, errorMessage: failure.message),
      (_) {
        final updated = state.pendingApprovals.where((item) => item.id != stageId).toList();
        state = state.copyWith(
          isProcessing: false,
          isProcessed: true,
          pendingApprovals: updated,
        );
      },
    );
  }

  void resetProcessedFlag() {
    state = state.copyWith(isProcessed: false);
  }
}

final approvalsNotifierProvider =
    StateNotifierProvider.autoDispose<ApprovalsNotifier, ApprovalsState>((ref) {
  return ApprovalsNotifier(
    getPendingApprovalsUseCase: sl<GetPendingApprovalsUseCase>(),
    approveStageUseCase: sl<ApproveStageUseCase>(),
    rejectStageUseCase: sl<RejectStageUseCase>(),
  );
});
