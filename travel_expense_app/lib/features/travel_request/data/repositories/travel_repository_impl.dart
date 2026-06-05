import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/travel_request_entity.dart';
import '../../domain/repositories/travel_repository.dart';
import '../datasources/travel_remote_datasource.dart';

class TravelRepositoryImpl implements TravelRepository {
  final TravelRemoteDataSource remoteDataSource;

  TravelRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<TravelRequestEntity>>> getTravelRequests() async {
    try {
      final list = await remoteDataSource.getTravelRequests();
      return Right(list);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, TravelRequestEntity>> submitTravelRequest({
    required String title,
    required String description,
    required String purpose,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double estimatedCost,
  }) async {
    try {
      final request = await remoteDataSource.submitTravelRequest(
        title: title,
        description: description,
        purpose: purpose,
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        estimatedCost: estimatedCost,
      );
      return Right(request);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, TravelRequestEntity>> cancelTravelRequest(String requestId) async {
    try {
      final request = await remoteDataSource.cancelTravelRequest(requestId);
      return Right(request);
    } catch (e) {
      return Left(ServerFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }
}
