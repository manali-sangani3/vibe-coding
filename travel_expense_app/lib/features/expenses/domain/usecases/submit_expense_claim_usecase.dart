import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/expense_claim_entity.dart';
import '../repositories/expenses_repository.dart';

class SubmitExpenseClaimUseCase {
  final ExpensesRepository repository;

  SubmitExpenseClaimUseCase(this.repository);

  Future<Either<Failure, ExpenseClaimEntity>> call({
    String? travelRequestId,
    required List<ExpenseItemEntity> items,
  }) async {
    return await repository.submitExpenseClaim(
      travelRequestId: travelRequestId,
      items: items,
    );
  }
}
