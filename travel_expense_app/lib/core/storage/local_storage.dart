import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  final SharedPreferences _sharedPreferences;

  LocalStorage(this._sharedPreferences);

  Future<bool> setBool(String key, bool value) async {
    return await _sharedPreferences.setBool(key, value);
  }

  bool getBool(String key, {bool defaultValue = false}) {
    return _sharedPreferences.getBool(key) ?? defaultValue;
  }

  Future<bool> setString(String key, String value) async {
    return await _sharedPreferences.setString(key, value);
  }

  String? getString(String key) {
    return _sharedPreferences.getString(key);
  }

  Future<bool> remove(String key) async {
    return await _sharedPreferences.remove(key);
  }
}
