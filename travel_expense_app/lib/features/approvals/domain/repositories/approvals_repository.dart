import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/approval_stage_entity.dart';

abstract class ApprovalsRepository {
  Future<Either<Failure, List<ApprovalStageEntity>>> getPendingApprovals();
  Future<Either<Failure, ApprovalStageEntity>> approveStage(String stageId);
  Future<Either<Failure, ApprovalStageEntity>> rejectStage(String stageId, String reason);
}
