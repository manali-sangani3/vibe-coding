import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/expense_claim_entity.dart';
import '../repositories/expenses_repository.dart';

class GetPendingExpenseApprovalsUseCase {
  final ExpensesRepository repository;

  GetPendingExpenseApprovalsUseCase(this.repository);

  Future<Either<Failure, List<ExpenseClaimEntity>>> call() async {
    return await repository.getPendingExpenseApprovals();
  }
}
