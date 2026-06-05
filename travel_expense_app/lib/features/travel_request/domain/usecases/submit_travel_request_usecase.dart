import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/travel_request_entity.dart';
import '../repositories/travel_repository.dart';

class SubmitTravelRequestUseCase {
  final TravelRepository repository;

  SubmitTravelRequestUseCase(this.repository);

  Future<Either<Failure, TravelRequestEntity>> call({
    required String title,
    required String description,
    required String purpose,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double estimatedCost,
  }) async {
    return await repository.submitTravelRequest(
      title: title,
      description: description,
      purpose: purpose,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      estimatedCost: estimatedCost,
    );
  }
}
