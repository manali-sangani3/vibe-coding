import '../../../../core/network/api_client.dart';
import '../models/approval_stage_model.dart';

abstract class ApprovalsRemoteDataSource {
  Future<List<ApprovalStageModel>> getPendingApprovals();
  Future<ApprovalStageModel> approveStage(String stageId);
  Future<ApprovalStageModel> rejectStage(String stageId, String reason);
}

class ApprovalsRemoteDataSourceImpl implements ApprovalsRemoteDataSource {
  final ApiClient apiClient;

  ApprovalsRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<ApprovalStageModel>> getPendingApprovals() async {
    final response = await apiClient.get('/approvals/pending');
    final dataList = response.data['data'] as List;
    return dataList
        .map((json) => ApprovalStageModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<ApprovalStageModel> approveStage(String stageId) async {
    final response = await apiClient.post('/approvals/$stageId/approve');
    final data = response.data['data'] as Map<String, dynamic>;
    return ApprovalStageModel.fromJson(data);
  }

  @override
  Future<ApprovalStageModel> rejectStage(String stageId, String reason) async {
    final response = await apiClient.post(
      '/approvals/$stageId/reject',
      data: {'reason': reason},
    );
    final data = response.data['data'] as Map<String, dynamic>;
    return ApprovalStageModel.fromJson(data);
  }
}
