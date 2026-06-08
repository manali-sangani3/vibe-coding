import 'package:fpdart/fpdart.dart';
import 'package:dio/dio.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/audit_log_entity.dart';
import '../../domain/repositories/audit_repository.dart';
import '../datasources/audit_remote_datasource.dart';

class AuditRepositoryImpl implements AuditRepository {
  final AuditRemoteDataSource remoteDataSource;

  AuditRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<AuditLogEntity>>> getAuditLogs() async {
    try {
      final remoteLogs = await remoteDataSource.getAuditLogs();
      return Right(remoteLogs);
    } on DioException catch (e) {
      return Left(ServerFailure(e.response?.data['message'] ?? e.message ?? 'Server Error'));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
