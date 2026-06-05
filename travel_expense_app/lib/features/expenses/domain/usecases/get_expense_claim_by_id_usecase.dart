import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/expense_claim_entity.dart';
import '../repositories/expenses_repository.dart';

class GetExpenseClaimByIdUseCase {
  final ExpensesRepository repository;

  GetExpenseClaimByIdUseCase(this.repository);

  Future<Either<Failure, ExpenseClaimEntity>> call(String id) async {
    return await repository.getExpenseClaimById(id);
  }
}
