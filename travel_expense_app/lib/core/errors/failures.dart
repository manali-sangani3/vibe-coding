abstract class Failure {
  final String message;
  const Failure(this.message);

  @override
  String toString() => message;
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = 'A server error occurred. Please try again.']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'A local storage error occurred.']);
}

class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'No internet connection. Please check your network settings.']);
}

class AuthFailure extends Failure {
  const AuthFailure(super.message);
}

class PolicyViolationFailure extends Failure {
  const PolicyViolationFailure(super.message);
}
