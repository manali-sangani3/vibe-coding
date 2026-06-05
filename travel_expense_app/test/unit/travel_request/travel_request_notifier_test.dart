import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:fpdart/fpdart.dart';
import 'package:travel_expense_app/core/errors/failures.dart';
import 'package:travel_expense_app/features/travel_request/domain/entities/travel_request_entity.dart';
import 'package:travel_expense_app/features/travel_request/domain/usecases/get_travel_requests_usecase.dart';
import 'package:travel_expense_app/features/travel_request/domain/usecases/submit_travel_request_usecase.dart';
import 'package:travel_expense_app/features/travel_request/domain/usecases/cancel_travel_request_usecase.dart';
import 'package:travel_expense_app/features/travel_request/presentation/providers/travel_request_provider.dart';

class MockGetTravelRequestsUseCase extends Mock implements GetTravelRequestsUseCase {}
class MockSubmitTravelRequestUseCase extends Mock implements SubmitTravelRequestUseCase {}
class MockCancelTravelRequestUseCase extends Mock implements CancelTravelRequestUseCase {}

void main() {
  late MockGetTravelRequestsUseCase mockGetTravelRequestsUseCase;
  late MockSubmitTravelRequestUseCase mockSubmitTravelRequestUseCase;
  late MockCancelTravelRequestUseCase mockCancelTravelRequestUseCase;
  late TravelRequestNotifier travelRequestNotifier;

  final tRequest = TravelRequestEntity(
    id: 'TRV-2026-001',
    title: 'Client Meeting London',
    description: 'Onsite integration meeting',
    purpose: 'Client Meeting',
    destination: 'London, UK',
    startDate: DateTime(2026, 7, 1),
    endDate: DateTime(2026, 7, 5),
    estimatedCost: 150000.0,
    status: 'pending',
    createdAt: DateTime(2026, 6, 1),
  );

  setUpAll(() {
    registerFallbackValue(DateTime.now());
  });

  setUp(() {
    mockGetTravelRequestsUseCase = MockGetTravelRequestsUseCase();
    mockSubmitTravelRequestUseCase = MockSubmitTravelRequestUseCase();
    mockCancelTravelRequestUseCase = MockCancelTravelRequestUseCase();

    // Default stub for loading constructor
    when(() => mockGetTravelRequestsUseCase()).thenAnswer(
      (_) async => const Right([]),
    );

    travelRequestNotifier = TravelRequestNotifier(
      getTravelRequestsUseCase: mockGetTravelRequestsUseCase,
      submitTravelRequestUseCase: mockSubmitTravelRequestUseCase,
      cancelTravelRequestUseCase: mockCancelTravelRequestUseCase,
    );
  });

  test('initial state should be empty', () {
    expect(travelRequestNotifier.state.requests, isEmpty);
    expect(travelRequestNotifier.state.isLoading, false);
    expect(travelRequestNotifier.state.isSubmitting, false);
    expect(travelRequestNotifier.state.isSubmitted, false);
  });

  group('loadTravelRequests', () {
    test('should emit loading and then set requests on success', () async {
      // arrange
      when(() => mockGetTravelRequestsUseCase()).thenAnswer(
        (_) async => Right([tRequest]),
      );

      // act
      final future = travelRequestNotifier.loadTravelRequests();

      // assert
      expect(travelRequestNotifier.state.isLoading, true);
      await future;
      expect(travelRequestNotifier.state.isLoading, false);
      expect(travelRequestNotifier.state.requests, [tRequest]);
    });

    test('should set error message on failure', () async {
      // arrange
      when(() => mockGetTravelRequestsUseCase()).thenAnswer(
        (_) async => const Left(ServerFailure('Connection timed out.')),
      );

      // act
      await travelRequestNotifier.loadTravelRequests();

      // assert
      expect(travelRequestNotifier.state.isLoading, false);
      expect(travelRequestNotifier.state.errorMessage, 'Connection timed out.');
    });
  });

  group('submitRequest', () {
    test('should emit isSubmitting and add new request to state on success', () async {
      // arrange
      when(() => mockSubmitTravelRequestUseCase(
            title: any(named: 'title'),
            description: any(named: 'description'),
            purpose: any(named: 'purpose'),
            destination: any(named: 'destination'),
            startDate: any(named: 'startDate'),
            endDate: any(named: 'endDate'),
            estimatedCost: any(named: 'estimatedCost'),
          )).thenAnswer((_) async => Right(tRequest));

      // act
      final future = travelRequestNotifier.submitRequest(
        title: 'Client Meeting London',
        description: 'Onsite integration meeting',
        purpose: 'Client Meeting',
        destination: 'London, UK',
        startDate: DateTime(2026, 7, 1),
        endDate: DateTime(2026, 7, 5),
        estimatedCost: 150000.0,
      );

      // assert
      expect(travelRequestNotifier.state.isSubmitting, true);
      await future;
      expect(travelRequestNotifier.state.isSubmitting, false);
      expect(travelRequestNotifier.state.isSubmitted, true);
      expect(travelRequestNotifier.state.requests, [tRequest]);
    });
  });

  group('cancelRequest', () {
    test('should update request status to cancelled on success', () async {
      // arrange
      final cancelledRequest = TravelRequestEntity(
        id: tRequest.id,
        title: tRequest.title,
        description: tRequest.description,
        purpose: tRequest.purpose,
        destination: tRequest.destination,
        startDate: tRequest.startDate,
        endDate: tRequest.endDate,
        estimatedCost: tRequest.estimatedCost,
        status: 'cancelled',
        createdAt: tRequest.createdAt,
      );

      // Setup initial requests list
      travelRequestNotifier.state = travelRequestNotifier.state.copyWith(requests: [tRequest]);

      when(() => mockCancelTravelRequestUseCase(any())).thenAnswer(
        (_) async => Right(cancelledRequest),
      );

      // act
      await travelRequestNotifier.cancelRequest(tRequest.id);

      // assert
      expect(travelRequestNotifier.state.requests.first.status, 'cancelled');
    });
  });
}
