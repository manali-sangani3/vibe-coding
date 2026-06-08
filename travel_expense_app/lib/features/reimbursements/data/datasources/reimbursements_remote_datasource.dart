import '../../../../core/network/api_client.dart';
import '../models/reimbursement_model.dart';

abstract class ReimbursementsRemoteDataSource {
  Future<List<ReimbursementModel>> getReimbursements();
  Future<List<Map<String, dynamic>>> getPendingReimbursements();
  Future<void> markAsPaid(String claimId, String paymentRef);
}

class ReimbursementsRemoteDataSourceImpl implements ReimbursementsRemoteDataSource {
  final ApiClient apiClient;

  ReimbursementsRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<ReimbursementModel>> getReimbursements() async {
    final response = await apiClient.get('/reimbursements');
    final dataList = (response.data['data'] as List?) ?? [];
    return dataList
        .map((json) => ReimbursementModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<List<Map<String, dynamic>>> getPendingReimbursements() async {
    final response = await apiClient.get('/reimbursements/pending');
    final dataList = (response.data['data'] as List?) ?? [];
    return dataList.cast<Map<String, dynamic>>();
  }

  @override
  Future<void> markAsPaid(String claimId, String paymentRef) async {
    await apiClient.post('/reimbursements/$claimId/pay', data: {
      'paymentRef': paymentRef,
    });
  }
}
