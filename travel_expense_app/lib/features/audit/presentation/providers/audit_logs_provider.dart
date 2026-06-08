import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/entities/audit_log_entity.dart';
import '../../domain/usecases/get_audit_logs_usecase.dart';

class AuditLogsState {
  final List<AuditLogEntity> logs;
  final bool isLoading;
  final String? errorMessage;

  const AuditLogsState({
    this.logs = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  AuditLogsState copyWith({
    List<AuditLogEntity>? logs,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return AuditLogsState(
      logs: logs ?? this.logs,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class AuditLogsNotifier extends StateNotifier<AuditLogsState> {
  final GetAuditLogsUseCase _getAuditLogsUseCase;

  AuditLogsNotifier({
    required GetAuditLogsUseCase getAuditLogsUseCase,
  })  : _getAuditLogsUseCase = getAuditLogsUseCase,
        super(const AuditLogsState()) {
    loadAuditLogs();
  }

  Future<void> loadAuditLogs() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getAuditLogsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (list) => state = state.copyWith(isLoading: false, logs: list),
    );
  }
}

final auditLogsNotifierProvider =
    StateNotifierProvider.autoDispose<AuditLogsNotifier, AuditLogsState>((ref) {
  return AuditLogsNotifier(
    getAuditLogsUseCase: sl<GetAuditLogsUseCase>(),
  );
});
