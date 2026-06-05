import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/approval_stage_entity.dart';
import '../repositories/approvals_repository.dart';

class GetPendingApprovalsUseCase {
  final ApprovalsRepository repository;

  GetPendingApprovalsUseCase(this.repository);

  Future<Either<Failure, List<ApprovalStageEntity>>> call() async {
    return await repository.getPendingApprovals();
  }
}
