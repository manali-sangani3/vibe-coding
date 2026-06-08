import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../repositories/reimbursements_repository.dart';

class MarkReimbursementAsPaidUseCase {
  final ReimbursementsRepository repository;

  MarkReimbursementAsPaidUseCase(this.repository);

  Future<Either<Failure, void>> call(String claimId, String paymentRef) {
    return repository.markAsPaid(claimId, paymentRef);
  }
}
