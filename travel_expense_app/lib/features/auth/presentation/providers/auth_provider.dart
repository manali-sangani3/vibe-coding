import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/injection_container.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/get_current_user_usecase.dart';

class AuthState {
  final UserEntity? user;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.errorMessage,
  });

  bool get isAuthenticated => user != null;

  AuthState copyWith({
    UserEntity? user,
    bool? isLoading,
    String? errorMessage,
    bool clearUser = false,
    bool clearError = false,
  }) {
    return AuthState(
      user: clearUser ? null : (user ?? this.user),
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final LoginUseCase _loginUseCase;
  final LogoutUseCase _logoutUseCase;
  final GetCurrentUserUseCase _getCurrentUserUseCase;

  AuthNotifier({
    required LoginUseCase loginUseCase,
    required LogoutUseCase logoutUseCase,
    required GetCurrentUserUseCase getCurrentUserUseCase,
  })  : _loginUseCase = loginUseCase,
        _logoutUseCase = logoutUseCase,
        _getCurrentUserUseCase = getCurrentUserUseCase,
        super(const AuthState()) {
    checkCurrentUser();
  }

  Future<void> checkCurrentUser() async {
    state = state.copyWith(isLoading: true);
    final result = await _getCurrentUserUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, clearUser: true),
      (user) => state = state.copyWith(isLoading: false, user: user),
    );
  }

  Future<void> login(String ssoToken) async {
    state = state.copyWith(isLoading: true, clearError: true);
    final result = await _loginUseCase(ssoToken);
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (user) => state = state.copyWith(isLoading: false, user: user),
    );
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    final result = await _logoutUseCase();
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (_) => state = const AuthState(),
    );
  }
}

final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    loginUseCase: sl<LoginUseCase>(),
    logoutUseCase: sl<LogoutUseCase>(),
    getCurrentUserUseCase: sl<GetCurrentUserUseCase>(),
  );
});
