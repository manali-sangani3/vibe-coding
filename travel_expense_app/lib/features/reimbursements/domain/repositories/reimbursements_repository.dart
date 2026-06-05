import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/reimbursement_entity.dart';

abstract class ReimbursementsRepository {
  Future<Either<Failure, List<ReimbursementEntity>>> getReimbursements();
}
