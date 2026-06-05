import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/approval_stage_entity.dart';
import '../../domain/repositories/approvals_repository.dart';
import '../datasources/approvals_remote_datasource.dart';

class ApprovalsRepositoryImpl implements ApprovalsRepository {
  final ApprovalsRemoteDataSource remoteDataSource;

  ApprovalsRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<ApprovalStageEntity>>> getPendingApprovals() async {
    try {
      final list = await remoteDataSource.getPendingApprovals();
      return Right(list);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, ApprovalStageEntity>> approveStage(String stageId) async {
    try {
      final stage = await remoteDataSource.approveStage(stageId);
      return Right(stage);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, ApprovalStageEntity>> rejectStage(String stageId, String reason) async {
    try {
      final stage = await remoteDataSource.rejectStage(stageId, reason);
      return Right(stage);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }
}
