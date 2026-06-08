import '../../../../core/network/api_client.dart';
import '../models/audit_log_model.dart';

abstract class AuditRemoteDataSource {
  Future<List<AuditLogModel>> getAuditLogs();
}

class AuditRemoteDataSourceImpl implements AuditRemoteDataSource {
  final ApiClient apiClient;

  AuditRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<AuditLogModel>> getAuditLogs() async {
    final response = await apiClient.get('/audit');
    final dataList = (response.data['data'] as List?) ?? [];
    return dataList
        .map((json) => AuditLogModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
