import '../../../../core/network/api_client.dart';
import '../models/reimbursement_model.dart';

abstract class ReimbursementsRemoteDataSource {
  Future<List<ReimbursementModel>> getReimbursements();
}

class ReimbursementsRemoteDataSourceImpl implements ReimbursementsRemoteDataSource {
  final ApiClient apiClient;

  ReimbursementsRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<ReimbursementModel>> getReimbursements() async {
    final response = await apiClient.get('/reimbursements');
    final dataList = response.data['data'] as List;
    return dataList
        .map((json) => ReimbursementModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
