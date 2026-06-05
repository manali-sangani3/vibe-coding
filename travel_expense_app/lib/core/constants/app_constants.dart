import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class AppConstants {
  static const String appName = 'Enterprise Travel & Expense';
  static const String appVersion = '1.0.0';
  
  // Storage Keys
  static const String userBoxName = 'user_box';
  static const String cachedUserKey = 'cached_user';
  static const String authTokenKey = 'auth_token';
  static const String isDarkThemeKey = 'is_dark_theme';
  
  // API endpoints
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:3000/v1';
    try {
      if (Platform.isAndroid) return 'http://10.0.2.2:3000/v1';
    } catch (_) {}
    return 'http://localhost:3000/v1';
  }
  static const String loginEndpoint = '/auth/sso-login';
  static const String userProfileEndpoint = '/auth/me';
  
  // Design Tokens
  static const double borderRadius = 12.0;
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;
}
