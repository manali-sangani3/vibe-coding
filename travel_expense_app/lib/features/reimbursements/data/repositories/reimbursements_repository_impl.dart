import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/reimbursement_entity.dart';
import '../../domain/repositories/reimbursements_repository.dart';
import '../datasources/reimbursements_remote_datasource.dart';

class ReimbursementsRepositoryImpl implements ReimbursementsRepository {
  final ReimbursementsRemoteDataSource remoteDataSource;

  ReimbursementsRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<ReimbursementEntity>>> getReimbursements() async {
    try {
      final list = await remoteDataSource.getReimbursements();
      return Right(list);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, List<Map<String, dynamic>>>> getPendingReimbursements() async {
    try {
      final list = await remoteDataSource.getPendingReimbursements();
      return Right(list);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, void>> markAsPaid(String claimId, String paymentRef) async {
    try {
      await remoteDataSource.markAsPaid(claimId, paymentRef);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }
}
