import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../models/test_models.dart';
import '../../../services/test_service.dart';
import '../../../core/services/auth_service.dart';

// Provider cho danh sách tests
final testsProvider = FutureProvider<List<Test>>((ref) async {
  return await TestService.getAllTests();
});

// Provider cho quick test generation
final quickTestProvider = StateNotifierProvider<QuickTestNotifier, AsyncValue<QuickTestResult?>>((ref) {
  return QuickTestNotifier();
});

class QuickTestNotifier extends StateNotifier<AsyncValue<QuickTestResult?>> {
  QuickTestNotifier() : super(const AsyncValue.data(null));

  Future<void> generateQuickTest() async {
    state = const AsyncValue.loading();
    try {
      final result = await TestService.generateQuickTest();
      state = AsyncValue.data(result);
    } catch (error, stackTrace) {
      if (error is PremiumRequiredException) {
        // Handle premium required exception separately
        state = AsyncValue.error('PREMIUM_REQUIRED: ${error.message}', stackTrace);
      } else {
        state = AsyncValue.error(error, stackTrace);
      }
    }
  }

  Future<void> generateFullTOEICTest() async {
    state = const AsyncValue.loading();
    try {
      final result = await TestService.generateFullTOEICTest();
      state = AsyncValue.data(result);
    } catch (error, stackTrace) {
      if (error is PremiumRequiredException) {
        // Handle premium required exception separately
        state = AsyncValue.error('PREMIUM_REQUIRED: ${error.message}', stackTrace);
      } else {
        state = AsyncValue.error(error, stackTrace);
      }
    }
  }

  void reset() {
    state = const AsyncValue.data(null);
  }
}

class TestListPage extends ConsumerWidget {
  const TestListPage({super.key});

  // Helper method to check if user has premium access
  bool _hasPremiumAccess() {
    final user = AuthService.instance.currentUser;
    if (user == null) return false;
    
    final membershipType = user.membershipType?.toUpperCase() ?? 'FREE';
    return membershipType == 'PREMIUM' || membershipType == 'VIP';
  }

  // Helper method to check if user is basic member (to show lock icon)
  bool _isBasicMember() {
    final user = AuthService.instance.currentUser;
    if (user == null) return true; // Consider non-logged users as basic
    
    final membershipType = user.membershipType?.toUpperCase() ?? 'FREE';
    return membershipType == 'BASIC';
  }

  // Helper method to show premium dialog
  void _showPremiumDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Yêu cầu nâng cấp'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Tính năng này chỉ dành cho thành viên Premium và VIP.'),
            SizedBox(height: 16),
            Text('Với gói Premium/VIP bạn sẽ có:'),
            SizedBox(height: 8),
            Text('• Tạo test nhanh không giới hạn'),
            Text('• Tạo full TOEIC test (200 câu)'),
            Text('• Truy cập tất cả nội dung học'),
            Text('• Báo cáo chi tiết kết quả'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Để sau'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Navigate to upgrade page
              context.go('/profile'); // User can upgrade from profile
            },
            child: const Text('Nâng cấp ngay'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final testsAsync = ref.watch(testsProvider);
    final quickTestAsync = ref.watch(quickTestProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh sách bài test'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () {
              context.go('/test-history');
            },
            icon: const Icon(Icons.history),
            tooltip: 'Lịch sử làm bài',
          ),
        ],
      ),
      body: Column(
        children: [
          // Quick Test Section
          Container(
            width: double.infinity,
            margin: const EdgeInsets.all(16),
            child: Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.flash_on,
                          color: Theme.of(context).colorScheme.primary,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Quick Test',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Tạo nhanh một bài test với 100 câu hỏi từ tất cả các phần',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: quickTestAsync.when(
                        data: (result) {
                          if (result != null) {
                            WidgetsBinding.instance.addPostFrameCallback((_) {
                              context.go('/test/${result.testId}');
                              ref.read(quickTestProvider.notifier).reset();
                            });
                          }
                          return Column(
                            children: [
                              // Quick Test Button
                              ElevatedButton.icon(
                                onPressed: () {
                                  if (_hasPremiumAccess()) {
                                    ref.read(quickTestProvider.notifier).generateQuickTest();
                                  } else {
                                    _showPremiumDialog(context);
                                  }
                                },
                                icon: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.play_arrow),
                                    if (_isBasicMember()) ...[
                                      const SizedBox(width: 4),
                                      const Icon(Icons.lock, size: 16),
                                    ],
                                  ],
                                ),
                                label: Text(_hasPremiumAccess() 
                                    ? 'Tạo Quick Test (45 câu)' 
                                    : 'Tạo Quick Test (45 câu) - Premium'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: _hasPremiumAccess() 
                                      ? Theme.of(context).colorScheme.primary
                                      : Colors.grey.shade600,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                              const SizedBox(height: 12),
                              // Full TOEIC Test Button
                              ElevatedButton.icon(
                                onPressed: () {
                                  if (_hasPremiumAccess()) {
                                    ref.read(quickTestProvider.notifier).generateFullTOEICTest();
                                  } else {
                                    _showPremiumDialog(context);
                                  }
                                },
                                icon: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.quiz),
                                    if (_isBasicMember()) ...[
                                      const SizedBox(width: 4),
                                      const Icon(Icons.lock, size: 16),
                                    ],
                                  ],
                                ),
                                label: Text(_hasPremiumAccess()
                                    ? 'Tạo Full TOEIC Test (200 câu)'
                                    : 'Tạo Full TOEIC Test (200 câu) - Premium'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: _hasPremiumAccess()
                                      ? Theme.of(context).colorScheme.secondary
                                      : Colors.grey.shade600,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ],
                          );
                        },
                        loading: () => ElevatedButton.icon(
                          onPressed: null,
                          icon: const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                          label: const Text('Đang tạo...'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                        error: (error, stack) {
                          // Check if it's a premium required error
                          if (error.toString().startsWith('PREMIUM_REQUIRED:')) {
                            final message = error.toString().replaceFirst('PREMIUM_REQUIRED: ', '');
                            WidgetsBinding.instance.addPostFrameCallback((_) {
                              _showPremiumDialog(context);
                            });
                            return Column(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.shade50,
                                    border: Border.all(color: Colors.orange),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(Icons.lock, color: Colors.orange.shade700),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          message,
                                          style: TextStyle(color: Colors.orange.shade700),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                ElevatedButton.icon(
                                  onPressed: () => _showPremiumDialog(context),
                                  icon: const Icon(Icons.upgrade),
                                  label: const Text('Nâng cấp Premium'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.orange,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ],
                            );
                          }
                          
                          // Regular error handling
                          return Column(
                            children: [
                              Text(
                                'Lỗi: $error',
                                style: const TextStyle(color: Colors.red),
                              ),
                              const SizedBox(height: 8),
                              ElevatedButton.icon(
                                onPressed: () {
                                  if (_hasPremiumAccess()) {
                                    ref.read(quickTestProvider.notifier).generateQuickTest();
                                  } else {
                                    _showPremiumDialog(context);
                                  }
                                },
                                icon: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.refresh),
                                    if (_isBasicMember()) ...[
                                      const SizedBox(width: 4),
                                      const Icon(Icons.lock, size: 16),
                                    ],
                                  ],
                                ),
                                label: const Text('Thử lại'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: _hasPremiumAccess()
                                      ? Theme.of(context).colorScheme.primary
                                      : Colors.grey.shade600,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          // Tests List Section
          Expanded(
            child: testsAsync.when(
              data: (tests) {
                if (tests.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.quiz_outlined,
                          size: 64,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Không có bài test nào',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    ref.invalidate(testsProvider);
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: tests.length,
                    itemBuilder: (context, index) {
                      final test = tests[index];
                      return Card(
                        elevation: 2,
                        margin: const EdgeInsets.only(bottom: 12),
                        child: InkWell(
                          onTap: () {
                            context.go('/test/${test.testId}');
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        test.title,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    Icon(
                                      Icons.arrow_forward_ios,
                                      size: 16,
                                      color: Colors.grey[600],
                                    ),
                                  ],
                                ),
                                if (test.description.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  Text(
                                    test.description,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey[600],
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.person,
                                      size: 16,
                                      color: Colors.grey[600],
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      test.createdBy?.username ?? 'Unknown',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                    const Spacer(),
                                    Icon(
                                      Icons.access_time,
                                      size: 16,
                                      color: Colors.grey[600],
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      _formatDate(test.createdAt),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Lỗi: $error',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.red,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () {
                        ref.invalidate(testsProvider);
                      },
                      icon: const Icon(Icons.refresh),
                      label: const Text('Thử lại'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return dateString;
    }
  }
}
