import '../../../../core/network/api_client.dart';
import '../../../../core/constants/app_constants.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> loginWithSSO(String ssoToken);
  Future<UserModel> getCurrentUser(String token);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl(this.apiClient);

  @override
  Future<UserModel> loginWithSSO(String ssoToken) async {
    final response = await apiClient.post(AppConstants.loginEndpoint, data: {'ssoToken': ssoToken});
    final accessToken = response.data['accessToken'] as String;
    
    // Save JWT access token to secure storage
    await apiClient.secureStorage.write(AppConstants.authTokenKey, accessToken);
    
    return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
  }

  @override
  Future<UserModel> getCurrentUser(String token) async {
    final response = await apiClient.get(AppConstants.userProfileEndpoint);
    return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
  }
}
