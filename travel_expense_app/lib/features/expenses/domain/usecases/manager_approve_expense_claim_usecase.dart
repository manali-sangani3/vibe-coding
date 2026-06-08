import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/expense_claim_entity.dart';
import '../repositories/expenses_repository.dart';

class ManagerApproveExpenseClaimUseCase {
  final ExpensesRepository repository;

  ManagerApproveExpenseClaimUseCase(this.repository);

  Future<Either<Failure, ExpenseClaimEntity>> call(String claimId) async {
    return await repository.managerApproveExpenseClaim(claimId);
  }
}
