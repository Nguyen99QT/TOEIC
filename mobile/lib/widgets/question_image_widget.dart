import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class QuestionImageWidget extends StatelessWidget {
  final String imageUrl;

  const QuestionImageWidget({
    super.key,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    // Remove debug logging to avoid loops
    
    return GestureDetector(
      onTap: () {
        // Show full screen image
        showDialog(
          context: context,
          builder: (context) => Dialog(
            backgroundColor: Colors.transparent,
            child: Stack(
              children: [
                Center(
                  child: InteractiveViewer(
                    child: CachedNetworkImage(
                      imageUrl: imageUrl,
                      fit: BoxFit.contain,
                      placeholder: (context, url) => const Center(
                        child: CircularProgressIndicator(),
                      ),
                      errorWidget: (context, url, error) {
                        // Log error for debugging but don't show URL to user
                        print('Image load error: ${error.runtimeType}');
                        
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error, size: 64, color: Colors.white),
                              const SizedBox(height: 8),
                              Text(
                                _getErrorMessage(error),
                                style: const TextStyle(color: Colors.white),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ),
                Positioned(
                  top: 40,
                  right: 20,
                  child: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(
                      Icons.close,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
      child: Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[300]!),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Stack(
            children: [
              CachedNetworkImage(
                imageUrl: imageUrl,
                width: double.infinity,
                height: double.infinity,
                fit: BoxFit.contain,
                placeholder: (context, url) => const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 8),
                      Text('Đang tải hình ảnh...'),
                    ],
                  ),
                ),
                errorWidget: (context, url, error) {
                  // Log error for debugging but don't show URL to user
                  print('Image thumbnail error: ${error.runtimeType}');
                  
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error, size: 48, color: Colors.red),
                        const SizedBox(height: 8),
                        Text(_getErrorMessage(error)),
                        const SizedBox(height: 4),
                        const Text(
                          'Không thể tải hình ảnh',
                          style: TextStyle(fontSize: 10, color: Colors.grey),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                },
              ),
              
              // Overlay to indicate it's clickable
              Positioned(
                bottom: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.zoom_in, size: 16, color: Colors.white),
                      SizedBox(width: 4),
                      Text(
                        'Nhấn để phóng to',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getErrorMessage(dynamic error) {
    String errorStr = error.toString().toLowerCase();
    
    if (errorStr.contains('404') || errorStr.contains('not found')) {
      return 'Hình ảnh không tồn tại';
    } else if (errorStr.contains('network') || errorStr.contains('connection')) {
      return 'Lỗi kết nối mạng';
    } else if (errorStr.contains('timeout')) {
      return 'Kết nối bị timeout';
    } else if (errorStr.contains('format') || errorStr.contains('invalid')) {
      return 'Định dạng hình ảnh không hợp lệ';
    } else {
      return 'Không thể tải hình ảnh';
    }
  }
}
