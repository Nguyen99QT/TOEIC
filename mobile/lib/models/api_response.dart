class ApiResponse<T> {
  final bool isSuccess;
  final T? data;
  final String? error;
  final String? message;

  ApiResponse._({
    required this.isSuccess,
    this.data,
    this.error,
    this.message,
  });

  factory ApiResponse.success(T data, {String? message}) {
    return ApiResponse._(
      isSuccess: true,
      data: data,
      message: message,
    );
  }

  factory ApiResponse.error(String error, {String? message}) {
    return ApiResponse._(
      isSuccess: false,
      error: error,
      message: message,
    );
  }

  bool get hasError => !isSuccess;
}
