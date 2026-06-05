import 'package:fpdart/fpdart.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../../../core/constants/app_constants.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final SecureStorage secureStorage;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.secureStorage,
  });

  @override
  Future<Either<Failure, UserEntity>> loginWithSSO(String ssoToken) async {
    try {
      final userModel = await remoteDataSource.loginWithSSO(ssoToken);
      return Right(userModel);
    } catch (e) {
      return Left(AuthFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await secureStorage.delete(AppConstants.authTokenKey);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> getCurrentUser() async {
    try {
      final token = await secureStorage.read(AppConstants.authTokenKey);
      if (token == null || token.isEmpty) {
        return const Left(AuthFailure('No authenticated session found.'));
      }
      final userModel = await remoteDataSource.getCurrentUser(token);
      return Right(userModel);
    } catch (e) {
      return Left(AuthFailure(e.toString().replaceAll('Exception: ', '')));
    }
  }
}
