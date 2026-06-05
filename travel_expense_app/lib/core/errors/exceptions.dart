class ServerException implements Exception {
  final String message;
  const ServerException([this.message = 'Server exception occurred']);

  @override
  String toString() => 'ServerException: $message';
}

class CacheException implements Exception {
  final String message;
  const CacheException([this.message = 'Cache exception occurred']);

  @override
  String toString() => 'CacheException: $message';
}

class AuthException implements Exception {
  final String message;
  const AuthException(this.message);

  @override
  String toString() => 'AuthException: $message';
}

class NetworkException implements Exception {
  final String message;
  const NetworkException([this.message = 'Network connection failed']);

  @override
  String toString() => 'NetworkException: $message';
}
