import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/reimbursement_entity.dart';
import '../repositories/reimbursements_repository.dart';

class GetReimbursementsUseCase {
  final ReimbursementsRepository repository;

  GetReimbursementsUseCase(this.repository);

  Future<Either<Failure, List<ReimbursementEntity>>> call() async {
    return await repository.getReimbursements();
  }
}
