import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/entities/travel_request_entity.dart';
import '../../domain/usecases/submit_travel_request_usecase.dart';
import '../../domain/usecases/get_travel_requests_usecase.dart';
import '../../domain/usecases/cancel_travel_request_usecase.dart';

class TravelRequestState {
  final List<TravelRequestEntity> requests;
  final bool isLoading;
  final String? errorMessage;
  final bool isSubmitting;
  final bool isSubmitted;

  const TravelRequestState({
    this.requests = const [],
    this.isLoading = false,
    this.errorMessage,
    this.isSubmitting = false,
    this.isSubmitted = false,
  });

  TravelRequestState copyWith({
    List<TravelRequestEntity>? requests,
    bool? isLoading,
    String? errorMessage,
    bool? isSubmitting,
    bool? isSubmitted,
    bool clearError = false,
  }) {
    return TravelRequestState(
      requests: requests ?? this.requests,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isSubmitted: isSubmitted ?? this.isSubmitted,
    );
  }
}

class TravelRequestNotifier extends StateNotifier<TravelRequestState> {
  final GetTravelRequestsUseCase _getTravelRequestsUseCase;
  final SubmitTravelRequestUseCase _submitTravelRequestUseCase;
  final CancelTravelRequestUseCase _cancelTravelRequestUseCase;

  TravelRequestNotifier({
    required GetTravelRequestsUseCase getTravelRequestsUseCase,
    required SubmitTravelRequestUseCase submitTravelRequestUseCase,
    required CancelTravelRequestUseCase cancelTravelRequestUseCase,
  })  : _getTravelRequestsUseCase = getTravelRequestsUseCase,
        _submitTravelRequestUseCase = submitTravelRequestUseCase,
        _cancelTravelRequestUseCase = cancelTravelRequestUseCase,
        super(const TravelRequestState()) {
    loadTravelRequests();
  }

  Future<void> loadTravelRequests() async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _getTravelRequestsUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (requests) => state = state.copyWith(isLoading: false, requests: requests),
    );
  }

  Future<void> submitRequest({
    required String title,
    required String description,
    required String purpose,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double estimatedCost,
  }) async {
    state = state.copyWith(isSubmitting: true, isSubmitted: false, clearError: true);
    final result = await _submitTravelRequestUseCase(
      title: title,
      description: description,
      purpose: purpose,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      estimatedCost: estimatedCost,
    );
    result.fold(
      (failure) => state = state.copyWith(isSubmitting: false, errorMessage: failure.message),
      (newRequest) {
        final updatedRequests = List<TravelRequestEntity>.from(state.requests)..add(newRequest);
        state = state.copyWith(
          isSubmitting: false,
          isSubmitted: true,
          requests: updatedRequests,
        );
      },
    );
  }

  Future<void> cancelRequest(String requestId) async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _cancelTravelRequestUseCase(requestId);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (updatedRequest) {
        final updatedRequests = state.requests.map((req) {
          return req.id == requestId ? updatedRequest : req;
        }).toList();
        state = state.copyWith(isLoading: false, requests: updatedRequests);
      },
    );
  }
  
  void resetSubmitFlag() {
    state = state.copyWith(isSubmitted: false);
  }
}

final travelRequestNotifierProvider =
    StateNotifierProvider<TravelRequestNotifier, TravelRequestState>((ref) {
  return TravelRequestNotifier(
    getTravelRequestsUseCase: sl<GetTravelRequestsUseCase>(),
    submitTravelRequestUseCase: sl<SubmitTravelRequestUseCase>(),
    cancelTravelRequestUseCase: sl<CancelTravelRequestUseCase>(),
  );
});
