import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/travel_request_entity.dart';

abstract class TravelRepository {
  Future<Either<Failure, List<TravelRequestEntity>>> getTravelRequests();
  Future<Either<Failure, TravelRequestEntity>> submitTravelRequest({
    required String title,
    required String description,
    required String purpose,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double estimatedCost,
  });
  Future<Either<Failure, TravelRequestEntity>> cancelTravelRequest(String requestId);
}
