import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:fpdart/fpdart.dart';
import 'package:travel_expense_app/core/errors/failures.dart';
import 'package:travel_expense_app/features/auth/domain/entities/user_entity.dart';
import 'package:travel_expense_app/features/auth/domain/usecases/login_usecase.dart';
import 'package:travel_expense_app/features/auth/domain/usecases/logout_usecase.dart';
import 'package:travel_expense_app/features/auth/domain/usecases/get_current_user_usecase.dart';
import 'package:travel_expense_app/features/auth/presentation/providers/auth_provider.dart';

class MockLoginUseCase extends Mock implements LoginUseCase {}
class MockLogoutUseCase extends Mock implements LogoutUseCase {}
class MockGetCurrentUserUseCase extends Mock implements GetCurrentUserUseCase {}

void main() {
  late MockLoginUseCase mockLoginUseCase;
  late MockLogoutUseCase mockLogoutUseCase;
  late MockGetCurrentUserUseCase mockGetCurrentUserUseCase;
  late AuthNotifier authNotifier;

  const tUser = UserEntity(
    id: 'usr_123',
    email: 'test@enterprise.com',
    name: 'Test User',
    role: 'Employee',
    department: 'Engineering',
  );

  setUp(() {
    mockLoginUseCase = MockLoginUseCase();
    mockLogoutUseCase = MockLogoutUseCase();
    mockGetCurrentUserUseCase = MockGetCurrentUserUseCase();

    // Default stub for constructor's checkCurrentUser check
    when(() => mockGetCurrentUserUseCase()).thenAnswer(
      (_) async => const Left(AuthFailure('No session')),
    );

    authNotifier = AuthNotifier(
      loginUseCase: mockLoginUseCase,
      logoutUseCase: mockLogoutUseCase,
      getCurrentUserUseCase: mockGetCurrentUserUseCase,
    );
  });

  test('initial state should be empty', () {
    expect(authNotifier.state.user, null);
    expect(authNotifier.state.isLoading, false);
    expect(authNotifier.state.errorMessage, null);
  });

  group('login', () {
    test('should emit loading and then authenticated state when login is successful', () async {
      // arrange
      when(() => mockLoginUseCase(any())).thenAnswer((_) async => const Right(tUser));

      // act
      final future = authNotifier.login('valid_token');

      // assert
      expect(authNotifier.state.isLoading, true);
      await future;
      expect(authNotifier.state.isLoading, false);
      expect(authNotifier.state.user, tUser);
      expect(authNotifier.state.isAuthenticated, true);
    });

    test('should emit loading and then error state when login fails', () async {
      // arrange
      when(() => mockLoginUseCase(any())).thenAnswer(
        (_) async => const Left(AuthFailure('Invalid SSO token.')),
      );

      // act
      final future = authNotifier.login('invalid_token');

      // assert
      expect(authNotifier.state.isLoading, true);
      await future;
      expect(authNotifier.state.isLoading, false);
      expect(authNotifier.state.user, null);
      expect(authNotifier.state.errorMessage, 'Invalid SSO token.');
      expect(authNotifier.state.isAuthenticated, false);
    });
  });

  group('logout', () {
    test('should clear user state when logout is successful', () async {
      // arrange
      when(() => mockLoginUseCase(any())).thenAnswer((_) async => const Right(tUser));
      when(() => mockLogoutUseCase()).thenAnswer((_) async => const Right(null));

      // login first
      await authNotifier.login('valid_token');
      expect(authNotifier.state.user, tUser);

      // act
      final future = authNotifier.logout();

      // assert
      expect(authNotifier.state.isLoading, true);
      await future;
      expect(authNotifier.state.isLoading, false);
      expect(authNotifier.state.user, null);
      expect(authNotifier.state.isAuthenticated, false);
    });
  });
}
