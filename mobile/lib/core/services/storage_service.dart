import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  static StorageService get instance => _instance;
  StorageService._internal();

  Box? _box;

  Future<void> init() async {
    await Hive.initFlutter();
    _box = await Hive.openBox('app_storage');
  }

  Future<void> saveString(String key, String value) async {
    await _box?.put(key, value);
  }

  Future<String?> getString(String key) async {
    return _box?.get(key);
  }

  Future<void> saveInt(String key, int value) async {
    await _box?.put(key, value);
  }

  Future<int?> getInt(String key) async {
    return _box?.get(key);
  }

  Future<void> saveBool(String key, bool value) async {
    await _box?.put(key, value);
  }

  Future<bool?> getBool(String key) async {
    return _box?.get(key);
  }

  Future<void> saveMap(String key, Map<String, dynamic> value) async {
    await _box?.put(key, value);
  }

  Future<Map<String, dynamic>?> getMap(String key) async {
    return _box?.get(key);
  }

  Future<void> saveList(String key, List<dynamic> value) async {
    await _box?.put(key, value);
  }

  Future<List<dynamic>?> getList(String key) async {
    return _box?.get(key);
  }

  Future<void> remove(String key) async {
    await _box?.delete(key);
  }

  Future<void> clear() async {
    await _box?.clear();
  }

  bool containsKey(String key) {
    return _box?.containsKey(key) ?? false;
  }

  List<String> get keys {
    return _box?.keys.cast<String>().toList() ?? [];
  }

  int get length {
    return _box?.length ?? 0;
  }
}
