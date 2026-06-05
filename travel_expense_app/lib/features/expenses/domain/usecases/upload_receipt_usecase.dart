import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../repositories/expenses_repository.dart';

class UploadReceiptUseCase {
  final ExpensesRepository repository;

  UploadReceiptUseCase(this.repository);

  Future<Either<Failure, String>> call(String filePath, String fileName) async {
    return await repository.uploadReceipt(filePath, fileName);
  }
}
