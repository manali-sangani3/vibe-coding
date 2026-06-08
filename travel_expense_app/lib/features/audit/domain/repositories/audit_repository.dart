import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/audit_log_entity.dart';

abstract class AuditRepository {
  Future<Either<Failure, List<AuditLogEntity>>> getAuditLogs();
}
