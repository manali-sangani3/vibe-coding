import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/expense_claim_entity.dart';
import '../../domain/repositories/expenses_repository.dart';
import '../datasources/expenses_remote_datasource.dart';

class ExpensesRepositoryImpl implements ExpensesRepository {
  final ExpensesRemoteDataSource remoteDataSource;

  ExpensesRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<ExpenseClaimEntity>>> getExpenseClaims() async {
    try {
      final list = await remoteDataSource.getExpenseClaims();
      return Right(list);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, ExpenseClaimEntity>> getExpenseClaimById(String id) async {
    try {
      final claim = await remoteDataSource.getExpenseClaimById(id);
      return Right(claim);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, ExpenseClaimEntity>> submitExpenseClaim({
    String? travelRequestId,
    required List<ExpenseItemEntity> items,
  }) async {
    try {
      final itemMaps = items.map((item) => {
        'category': item.category,
        'amount': item.amount,
        'description': item.description,
        if (item.receiptUrl != null) 'receiptUrl': item.receiptUrl,
      }).toList();

      final claim = await remoteDataSource.submitExpenseClaim(
        travelRequestId: travelRequestId,
        items: itemMaps,
      );
      return Right(claim);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, String>> uploadReceipt(String filePath, String fileName) async {
    try {
      final url = await remoteDataSource.uploadReceipt(filePath, fileName);
      return Right(url);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, List<ExpenseClaimEntity>>> getPendingExpenseApprovals() async {
    try {
      final list = await remoteDataSource.getPendingExpenseApprovals();
      return Right(list);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, ExpenseClaimEntity>> managerApproveExpenseClaim(String claimId) async {
    try {
      final claim = await remoteDataSource.managerApproveExpenseClaim(claimId);
      return Right(claim);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }
}
