import 'package:dio/dio.dart';
import '../../../../core/network/api_client.dart';
import '../models/expense_claim_model.dart';

abstract class ExpensesRemoteDataSource {
  Future<List<ExpenseClaimModel>> getExpenseClaims();
  Future<ExpenseClaimModel> getExpenseClaimById(String id);
  Future<ExpenseClaimModel> submitExpenseClaim({
    String? travelRequestId,
    required List<Map<String, dynamic>> items,
  });
  Future<String> uploadReceipt(String filePath, String fileName);
}

class ExpensesRemoteDataSourceImpl implements ExpensesRemoteDataSource {
  final ApiClient apiClient;

  ExpensesRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<ExpenseClaimModel>> getExpenseClaims() async {
    final response = await apiClient.get('/expenses');
    final dataList = response.data['data'] as List;
    return dataList
        .map((json) => ExpenseClaimModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<ExpenseClaimModel> getExpenseClaimById(String id) async {
    final response = await apiClient.get('/expenses/$id');
    final data = response.data['data'] as Map<String, dynamic>;
    return ExpenseClaimModel.fromJson(data);
  }

  @override
  Future<ExpenseClaimModel> submitExpenseClaim({
    String? travelRequestId,
    required List<Map<String, dynamic>> items,
  }) async {
    final response = await apiClient.post(
      '/expenses',
      data: {
        if (travelRequestId != null) 'travelRequestId': travelRequestId,
        'items': items,
      },
    );
    return ExpenseClaimModel.fromJson(response.data as Map<String, dynamic>);
  }

  @override
  Future<String> uploadReceipt(String filePath, String fileName) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        filePath,
        filename: fileName,
      ),
    });
    final response = await apiClient.post(
      '/expenses/upload',
      data: formData,
    );
    return response.data['receiptUrl'] as String;
  }
}
