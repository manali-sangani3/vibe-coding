import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/expense_claim_entity.dart';

abstract class ExpensesRepository {
  Future<Either<Failure, List<ExpenseClaimEntity>>> getExpenseClaims();
  Future<Either<Failure, ExpenseClaimEntity>> getExpenseClaimById(String id);
  Future<Either<Failure, ExpenseClaimEntity>> submitExpenseClaim({
    String? travelRequestId,
    required List<ExpenseItemEntity> items,
  });
  Future<Either<Failure, String>> uploadReceipt(String filePath, String fileName);
  Future<Either<Failure, List<ExpenseClaimEntity>>> getPendingExpenseApprovals();
  Future<Either<Failure, ExpenseClaimEntity>> managerApproveExpenseClaim(String claimId);
}
