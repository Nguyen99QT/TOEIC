import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'storage_service.dart';

class ApiService {
  final String _baseUrl = 'http://10.0.2.2:8080/api'; // Updated for Android emulator

  Future<Map<String, String>> _getHeaders() async {
    final token = await StorageService.instance.getString('auth_token');
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  Future<http.Response> get(String path) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$_baseUrl$path'),
      headers: headers,
    );
    return response;
  }

  Future<http.Response> post(String path, {dynamic data}) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$_baseUrl$path'),
      headers: headers,
      body: data != null ? jsonEncode(data) : null,
    );
    return response;
  }

  Future<http.Response> put(String path, {dynamic data}) async {
    final headers = await _getHeaders();
    final response = await http.put(
      Uri.parse('$_baseUrl$path'),
      headers: headers,
      body: data != null ? jsonEncode(data) : null,
    );
    return response;
  }

  Future<http.Response> delete(String path) async {
    final headers = await _getHeaders();
    final response = await http.delete(
      Uri.parse('$_baseUrl$path'),
      headers: headers,
    );
    return response;
  }
}

// Provider for ApiService
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});
