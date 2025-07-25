import 'dart:convert';

import 'package:http/http.dart' as http;
import '../../models/blog.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class BlogService extends ChangeNotifier {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8080';
    } else {
      return 'http://10.0.2.2:8080';
    }
  }

  List<BlogPost> posts = [];
  bool isLoading = false;
  String? error;

  Future<void> fetchPosts() async {
    isLoading = true;
    error = null;
    notifyListeners();
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/blog'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );
      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        posts = jsonData.map((json) => BlogPost.fromJson(json)).toList();
      } else {
        error = 'Lỗi server: ${response.statusCode}';
      }
    } catch (e) {
      error = 'Không thể kết nối server: $e';
    }
    isLoading = false;
    notifyListeners();
  }

  Future<BlogPost?> getBlogById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/blog/$id'),
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        return BlogPost.fromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      print('❌ Error fetching blog $id: $e');
      return null;
    }
  }
}
