import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/entities/reimbursement_entity.dart';
import '../../domain/usecases/get_reimbursements_usecase.dart';

class ReimbursementsState {
  final List<ReimbursementEntity> reimbursements;
  final bool isLoading;
  final String? errorMessage;

  const ReimbursementsState({
    this.reimbursements = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  ReimbursementsState copyWith({
    List<ReimbursementEntity>? reimbursements,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return ReimbursementsState(
      reimbursements: reimbursements ?? this.reimbursements,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class ReimbursementsNotifier extends StateNotifier<ReimbursementsState> {
  final GetReimbursementsUseCase _getReimbursementsUseCase;

  ReimbursementsNotifier({
    required GetReimbursementsUseCase getReimbursementsUseCase,
  })  : _getReimbursementsUseCase = getReimbursementsUseCase,
        super(const ReimbursementsState()) {
    loadReimbursements();
  }

  Future<void> loadReimbursements() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getReimbursementsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (list) => state = state.copyWith(isLoading: false, reimbursements: list),
    );
  }
}

final reimbursementsNotifierProvider =
    StateNotifierProvider.autoDispose<ReimbursementsNotifier, ReimbursementsState>((ref) {
  return ReimbursementsNotifier(
    getReimbursementsUseCase: sl<GetReimbursementsUseCase>(),
  );
});
