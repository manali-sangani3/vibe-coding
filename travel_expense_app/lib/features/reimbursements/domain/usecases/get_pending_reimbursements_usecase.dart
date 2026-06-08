import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../repositories/reimbursements_repository.dart';

class GetPendingReimbursementsUseCase {
  final ReimbursementsRepository repository;

  GetPendingReimbursementsUseCase(this.repository);

  Future<Either<Failure, List<Map<String, dynamic>>>> call() {
    return repository.getPendingReimbursements();
  }
}
