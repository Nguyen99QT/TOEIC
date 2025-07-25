import 'package:toeic_mobile/models/blog.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthApiService {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService.instance;

  // Authentication methods
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _apiService.post('/auth/login', {
        'username': username,
        'password': password,
      });

      if (response.success && response.data != null) {
        // Save token if available
        final token = response.data['token'] ?? response.data['accessToken'];
        if (token != null) {
          await _storageService.saveString('auth_token', token);
        }

        return {
          'success': true,
          'data': response.data,
        };
      }

      return {
        'success': false,
        'message': response.message,
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Login failed: $e',
      };
    }
  }

  Future<bool> logout() async {
    try {
      await _apiService.post('/auth/logout', {});
      await _storageService.remove('auth_token');
      await _storageService.remove('user_data');
      return true;
    } catch (e) {
      // Clear local data even if server request fails
      await _storageService.remove('auth_token');
      await _storageService.remove('user_data');
      return true;
    }
  }

  Future<bool> checkAuthStatus() async {
    try {
      final response = await _apiService.post('/auth/validate-token', {});
      return response.success;
    } catch (e) {
      return false;
    }
  }
}

class BlogApiService {
  final ApiService _apiService = ApiService();

  Future<List<BlogPost>> getBlogPosts() async {
    try {
      final response = await _apiService.get('/blog');

      if (response.success && response.data is List) {
        return (response.data as List)
            .map((json) => BlogPost.fromJson(json))
            .toList();
      }

      return [];
    } catch (e) {
      throw Exception('Failed to load blog posts: $e');
    }
  }

  Future<BlogPost?> getBlogPost(int id) async {
    try {
      final response = await _apiService.get('/blog/$id');

      if (response.success && response.data != null) {
        return BlogPost.fromJson(response.data);
      }

      return null;
    } catch (e) {
      throw Exception('Failed to load blog post: $e');
    }
  }

  Future<BlogPost> createBlogPost({
    required String title,
    required String content,
    required String author,
  }) async {
    try {
      final response = await _apiService.post('/blog', {
        'title': title,
        'content': content,
        'author': author,
      });

      if (response.success && response.data != null) {
        return BlogPost.fromJson(response.data);
      }

      throw Exception('Failed to create blog post');
    } catch (e) {
      throw Exception('Failed to create blog post: $e');
    }
  }

  Future<List<BlogPost>> searchBlogPosts(String query) async {
    try {
      final response = await _apiService.get('/blog/search?title=$query');

      if (response.success && response.data is List) {
        return (response.data as List)
            .map((json) => BlogPost.fromJson(json))
            .toList();
      }

      return [];
    } catch (e) {
      throw Exception('Failed to search blog posts: $e');
    }
  }
}
