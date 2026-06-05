import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/approval_stage_entity.dart';
import '../repositories/approvals_repository.dart';

class ApproveStageUseCase {
  final ApprovalsRepository repository;

  ApproveStageUseCase(this.repository);

  Future<Either<Failure, ApprovalStageEntity>> call(String stageId) async {
    return await repository.approveStage(stageId);
  }
}
