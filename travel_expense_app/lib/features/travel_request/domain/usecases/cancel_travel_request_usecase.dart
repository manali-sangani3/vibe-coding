import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/travel_request_entity.dart';
import '../repositories/travel_repository.dart';

class CancelTravelRequestUseCase {
  final TravelRepository repository;

  CancelTravelRequestUseCase(this.repository);

  Future<Either<Failure, TravelRequestEntity>> call(String requestId) async {
    return await repository.cancelTravelRequest(requestId);
  }
}
