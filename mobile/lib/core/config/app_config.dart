class AppConfig {
  static const String appName = 'TOEIC Learning Platform';
  static const String appVersion = '1.0.0';

  // API Configuration
  static const String baseUrl = 'http://localhost:8080';
  static const String apiBaseUrl = '$baseUrl/api';

  // Authentication
  static const String authTokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';

  // Storage
  static const String storageBoxName = 'toeic_app';

  // API Endpoints
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String refreshEndpoint = '/auth/refresh';
  static const String logoutEndpoint = '/auth/logout';
  static const String profileEndpoint = '/users/profile';
  static const String lessonsEndpoint = '/lessons';
  static const String exercisesEndpoint = '/exercises';
  static const String questionsEndpoint = '/questions';
  static const String flashcardsEndpoint = '/flashcards';
  static const String dashboardEndpoint = '/dashboard';

  // Media URLs
  static String getImageUrl(String imagePath) => '$baseUrl/images/$imagePath';
  static String getAudioUrl(String audioPath) => '$baseUrl/audio/$audioPath';
  static String getVideoUrl(String videoPath) => '$baseUrl/videos/$videoPath';

  // App Settings
  static const int connectionTimeout = 30000;
  static const int receiveTimeout = 30000;
  static const int maxRetries = 3;

  // UI Constants
  static const double defaultPadding = 16.0;
  static const double defaultRadius = 12.0;
  static const double cardElevation = 4.0;

  // Animation Durations
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);
}
