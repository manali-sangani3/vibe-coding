import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/audit_log_entity.dart';
import '../repositories/audit_repository.dart';

class GetAuditLogsUseCase {
  final AuditRepository repository;

  GetAuditLogsUseCase(this.repository);

  Future<Either<Failure, List<AuditLogEntity>>> call() {
    return repository.getAuditLogs();
  }
}
