import '../../../../core/network/api_client.dart';
import '../models/travel_request_model.dart';

abstract class TravelRemoteDataSource {
  Future<List<TravelRequestModel>> getTravelRequests();
  Future<TravelRequestModel> submitTravelRequest({
    required String title,
    required String description,
    required String purpose,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double estimatedCost,
  });
  Future<TravelRequestModel> cancelTravelRequest(String requestId);
}

class TravelRemoteDataSourceImpl implements TravelRemoteDataSource {
  final ApiClient apiClient;

  TravelRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<TravelRequestModel>> getTravelRequests() async {
    final response = await apiClient.get('/travel');
    final dataList = (response.data['data'] as List?) ?? [];
    return dataList
        .map((json) => TravelRequestModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<TravelRequestModel> submitTravelRequest({
    required String title,
    required String description,
    required String purpose,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double estimatedCost,
  }) async {
    final response = await apiClient.post(
      '/travel',
      data: {
        'title': title,
        'description': description,
        'purpose': purpose,
        'destination': destination,
        'startDate': startDate.toUtc().toIso8601String(),
        'endDate': endDate.toUtc().toIso8601String(),
        'estimatedCost': estimatedCost,
      },
    );
    return TravelRequestModel.fromJson(response.data as Map<String, dynamic>);
  }

  @override
  Future<TravelRequestModel> cancelTravelRequest(String requestId) async {
    final response = await apiClient.post('/travel/$requestId/cancel');
    final data = response.data['data'] as Map<String, dynamic>;
    return TravelRequestModel.fromJson(data);
  }
}
