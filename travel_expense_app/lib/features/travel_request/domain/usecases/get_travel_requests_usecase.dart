import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../entities/travel_request_entity.dart';
import '../repositories/travel_repository.dart';

class GetTravelRequestsUseCase {
  final TravelRepository repository;

  GetTravelRequestsUseCase(this.repository);

  Future<Either<Failure, List<TravelRequestEntity>>> call() async {
    return await repository.getTravelRequests();
  }
}
