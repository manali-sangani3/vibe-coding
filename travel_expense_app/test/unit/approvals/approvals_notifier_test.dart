import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:fpdart/fpdart.dart';
import 'package:travel_expense_app/core/errors/failures.dart';
import 'package:travel_expense_app/features/approvals/domain/entities/approval_stage_entity.dart';
import 'package:travel_expense_app/features/approvals/domain/usecases/get_pending_approvals_usecase.dart';
import 'package:travel_expense_app/features/approvals/domain/usecases/approve_stage_usecase.dart';
import 'package:travel_expense_app/features/approvals/domain/usecases/reject_stage_usecase.dart';
import 'package:travel_expense_app/features/approvals/presentation/providers/approvals_provider.dart';

class MockGetPendingApprovalsUseCase extends Mock implements GetPendingApprovalsUseCase {}
class MockApproveStageUseCase extends Mock implements ApproveStageUseCase {}
class MockRejectStageUseCase extends Mock implements RejectStageUseCase {}

void main() {
  late MockGetPendingApprovalsUseCase mockGetPendingApprovalsUseCase;
  late MockApproveStageUseCase mockApproveStageUseCase;
  late MockRejectStageUseCase mockRejectStageUseCase;
  late ApprovalsNotifier approvalsNotifier;

  final tStage = ApprovalStageEntity(
    id: 'stage-123',
    requestId: 'req-456',
    approverId: 'approver-789',
    level: 'manager',
    status: 'pending',
    createdAt: DateTime(2026, 6, 1),
  );

  setUp(() {
    mockGetPendingApprovalsUseCase = MockGetPendingApprovalsUseCase();
    mockApproveStageUseCase = MockApproveStageUseCase();
    mockRejectStageUseCase = MockRejectStageUseCase();

    when(() => mockGetPendingApprovalsUseCase()).thenAnswer(
      (_) async => const Right([]),
    );

    approvalsNotifier = ApprovalsNotifier(
      getPendingApprovalsUseCase: mockGetPendingApprovalsUseCase,
      approveStageUseCase: mockApproveStageUseCase,
      rejectStageUseCase: mockRejectStageUseCase,
    );
  });

  test('initial state should be correct', () {
    expect(approvalsNotifier.state.pendingApprovals, isEmpty);
    expect(approvalsNotifier.state.isLoading, false);
    expect(approvalsNotifier.state.isProcessing, false);
    expect(approvalsNotifier.state.isProcessed, false);
    expect(approvalsNotifier.state.errorMessage, isNull);
  });

  group('loadPendingApprovals', () {
    test('should emit loading and set pendingApprovals on success', () async {
      when(() => mockGetPendingApprovalsUseCase()).thenAnswer(
        (_) async => Right([tStage]),
      );

      final future = approvalsNotifier.loadPendingApprovals();

      expect(approvalsNotifier.state.isLoading, true);
      await future;
      expect(approvalsNotifier.state.isLoading, false);
      expect(approvalsNotifier.state.pendingApprovals, [tStage]);
    });

    test('should set error message on failure', () async {
      when(() => mockGetPendingApprovalsUseCase()).thenAnswer(
        (_) async => const Left(ServerFailure('Fetch failed')),
      );

      await approvalsNotifier.loadPendingApprovals();

      expect(approvalsNotifier.state.isLoading, false);
      expect(approvalsNotifier.state.errorMessage, 'Fetch failed');
    });
  });

  group('approveApprovalStage', () {
    test('should emit isProcessing and remove approved stage from list on success', () async {
      approvalsNotifier.state = approvalsNotifier.state.copyWith(pendingApprovals: [tStage]);

      when(() => mockApproveStageUseCase(any())).thenAnswer(
        (_) async => Right(tStage),
      );

      final future = approvalsNotifier.approveApprovalStage(tStage.id);

      expect(approvalsNotifier.state.isProcessing, true);
      await future;
      expect(approvalsNotifier.state.isProcessing, false);
      expect(approvalsNotifier.state.isProcessed, true);
      expect(approvalsNotifier.state.pendingApprovals, isEmpty);
    });

    test('should set error message on failure', () async {
      when(() => mockApproveStageUseCase(any())).thenAnswer(
        (_) async => const Left(ServerFailure('Approval failed')),
      );

      await approvalsNotifier.approveApprovalStage(tStage.id);

      expect(approvalsNotifier.state.isProcessing, false);
      expect(approvalsNotifier.state.isProcessed, false);
      expect(approvalsNotifier.state.errorMessage, 'Approval failed');
    });
  });

  group('rejectApprovalStage', () {
    test('should emit isProcessing and remove rejected stage from list on success', () async {
      approvalsNotifier.state = approvalsNotifier.state.copyWith(pendingApprovals: [tStage]);

      when(() => mockRejectStageUseCase(any(), any())).thenAnswer(
        (_) async => Right(tStage),
      );

      final future = approvalsNotifier.rejectApprovalStage(tStage.id, 'Out of budget');

      expect(approvalsNotifier.state.isProcessing, true);
      await future;
      expect(approvalsNotifier.state.isProcessing, false);
      expect(approvalsNotifier.state.isProcessed, true);
      expect(approvalsNotifier.state.pendingApprovals, isEmpty);
    });
  });
}
