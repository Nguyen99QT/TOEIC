import 'dart:convert';
import 'dart:developer' as developer;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  static StorageService get instance => _instance;
  StorageService._internal();

  // Secure storage for sensitive data (tokens, user credentials)
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  );

  // Regular storage for non-sensitive data
  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Secure storage methods (for sensitive data like tokens)
  Future<void> saveSecureString(String key, String value) async {
    try {
      await _secureStorage.write(key: key, value: value);
    } catch (e) {
      developer.log('Error saving secure string: $e', name: 'StorageService');
      // Fallback to regular storage if secure storage fails
      await saveString(key, value);
    }
  }

  Future<String?> getSecureString(String key) async {
    try {
      return await _secureStorage.read(key: key);
    } catch (e) {
      developer.log('Error reading secure string: $e', name: 'StorageService');
      // Fallback to regular storage
      return getString(key);
    }
  }

  Future<void> removeSecure(String key) async {
    try {
      await _secureStorage.delete(key: key);
    } catch (e) {
      developer.log('Error removing secure string: $e', name: 'StorageService');
      // Fallback to regular storage
      await remove(key);
    }
  }

  Future<void> clearAllSecure() async {
    try {
      await _secureStorage.deleteAll();
    } catch (e) {
      developer.log('Error clearing all secure data: $e',
          name: 'StorageService');
    }
  }

  // Regular storage methods (for non-sensitive data)
  Future<void> saveString(String key, String value) async {
    await _ensureInitialized();
    await _prefs!.setString(key, value);
  }

  Future<String?> getString(String key) async {
    await _ensureInitialized();
    return _prefs!.getString(key);
  }

  Future<void> saveBool(String key, bool value) async {
    await _ensureInitialized();
    await _prefs!.setBool(key, value);
  }

  Future<bool?> getBool(String key) async {
    await _ensureInitialized();
    return _prefs!.getBool(key);
  }

  Future<void> saveInt(String key, int value) async {
    await _ensureInitialized();
    await _prefs!.setInt(key, value);
  }

  Future<int?> getInt(String key) async {
    await _ensureInitialized();
    return _prefs!.getInt(key);
  }

  Future<void> saveDouble(String key, double value) async {
    await _ensureInitialized();
    await _prefs!.setDouble(key, value);
  }

  Future<double?> getDouble(String key) async {
    await _ensureInitialized();
    return _prefs!.getDouble(key);
  }

  Future<void> saveStringList(String key, List<String> value) async {
    await _ensureInitialized();
    await _prefs!.setStringList(key, value);
  }

  Future<List<String>?> getStringList(String key) async {
    await _ensureInitialized();
    return _prefs!.getStringList(key);
  }

  // Save complex objects as JSON
  Future<void> saveObject(String key, Map<String, dynamic> object) async {
    final jsonString = jsonEncode(object);
    await saveString(key, jsonString);
  }

  Future<Map<String, dynamic>?> getObject(String key) async {
    final jsonString = await getString(key);
    if (jsonString != null) {
      try {
        return jsonDecode(jsonString) as Map<String, dynamic>;
      } catch (e) {
        developer.log('Error decoding JSON for key $key: $e',
            name: 'StorageService');
        return null;
      }
    }
    return null;
  }

  // Save secure objects as JSON
  Future<void> saveSecureObject(String key, Map<String, dynamic> object) async {
    final jsonString = jsonEncode(object);
    await saveSecureString(key, jsonString);
  }

  Future<Map<String, dynamic>?> getSecureObject(String key) async {
    final jsonString = await getSecureString(key);
    if (jsonString != null) {
      try {
        return jsonDecode(jsonString) as Map<String, dynamic>;
      } catch (e) {
        developer.log('Error decoding secure JSON for key $key: $e',
            name: 'StorageService');
        return null;
      }
    }
    return null;
  }

  Future<void> remove(String key) async {
    await _ensureInitialized();
    await _prefs!.remove(key);
  }

  Future<void> clear() async {
    await _ensureInitialized();
    await _prefs!.clear();
  }

  Future<bool> containsKey(String key) async {
    await _ensureInitialized();
    return _prefs!.containsKey(key);
  }

  Future<Set<String>> getKeys() async {
    await _ensureInitialized();
    return _prefs!.getKeys();
  }

  // Helper method to ensure SharedPreferences is initialized
  Future<void> _ensureInitialized() async {
    if (_prefs == null) {
      await init();
    }
  }

  // Authentication specific methods
  Future<void> saveAuthToken(String token) async {
    await saveSecureString('auth_token', token);
  }

  Future<String?> getAuthToken() async {
    return await getSecureString('auth_token');
  }

  Future<void> saveRefreshToken(String token) async {
    await saveSecureString('refresh_token', token);
  }

  Future<String?> getRefreshToken() async {
    return await getSecureString('refresh_token');
  }

  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await saveSecureObject('user_data', userData);
  }

  Future<Map<String, dynamic>?> getUserData() async {
    return await getSecureObject('user_data');
  }

  Future<void> clearAuthData() async {
    await removeSecure('auth_token');
    await removeSecure('refresh_token');
    await removeSecure('user_data');
  }

  // App settings methods
  Future<void> saveThemeMode(String themeMode) async {
    await saveString('theme_mode', themeMode);
  }

  Future<String?> getThemeMode() async {
    return await getString('theme_mode');
  }

  Future<void> saveLanguage(String languageCode) async {
    await saveString('language_code', languageCode);
  }

  Future<String?> getLanguage() async {
    return await getString('language_code');
  }

  Future<void> saveNotificationSettings(bool enabled) async {
    await saveBool('notifications_enabled', enabled);
  }

  Future<bool> getNotificationSettings() async {
    return await getBool('notifications_enabled') ?? true;
  }

  // Cache methods
  Future<void> saveCacheData(String key, Map<String, dynamic> data,
      {Duration? expiry}) async {
    final cacheObject = {
      'data': data,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'expiry': expiry?.inMilliseconds,
    };
    await saveObject('cache_$key', cacheObject);
  }

  Future<Map<String, dynamic>?> getCacheData(String key) async {
    final cacheObject = await getObject('cache_$key');
    if (cacheObject == null) return null;

    final timestamp = cacheObject['timestamp'] as int?;
    final expiryMs = cacheObject['expiry'] as int?;

    if (timestamp != null && expiryMs != null) {
      final expiryTime =
          DateTime.fromMillisecondsSinceEpoch(timestamp + expiryMs);
      if (DateTime.now().isAfter(expiryTime)) {
        // Cache expired, remove it
        await remove('cache_$key');
        return null;
      }
    }

    return cacheObject['data'] as Map<String, dynamic>?;
  }

  Future<void> clearCache() async {
    final keys = await getKeys();
    final cacheKeys = keys.where((key) => key.startsWith('cache_'));
    for (final key in cacheKeys) {
      await remove(key);
    }
  }

  // Debug methods
  Future<void> printAllKeys() async {
    final keys = await getKeys();
    developer.log('SharedPreferences keys: $keys', name: 'StorageService');

    try {
      final secureKeys = await _secureStorage.readAll();
      developer.log('Secure storage keys: ${secureKeys.keys}',
          name: 'StorageService');
    } catch (e) {
      developer.log('Error reading secure storage keys: $e',
          name: 'StorageService');
    }
  }
}
