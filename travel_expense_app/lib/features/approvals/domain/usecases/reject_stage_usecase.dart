import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/approval_stage_entity.dart';
import '../repositories/approvals_repository.dart';

class RejectStageUseCase {
  final ApprovalsRepository repository;

  RejectStageUseCase(this.repository);

  Future<Either<Failure, ApprovalStageEntity>> call(String stageId, String reason) async {
    return await repository.rejectStage(stageId, reason);
  }
}
