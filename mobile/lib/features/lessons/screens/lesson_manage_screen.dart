import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/models/lesson_model.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';
import 'package:toeic_mobile/features/lessons/providers/lesson_provider.dart';

class LessonManageScreen extends ConsumerStatefulWidget {
  const LessonManageScreen({super.key});

  @override
  ConsumerState<LessonManageScreen> createState() => _LessonManageScreenState();
}

class LessonManageSearchDelegate extends SearchDelegate<String> {
  final Function(String) onSearchChanged;

  LessonManageSearchDelegate({required this.onSearchChanged});

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
          onSearchChanged('');
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () => close(context, ''),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    onSearchChanged(query);
    close(context, query);
    return Container();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return Container();
  }
}

class _LessonManageScreenState extends ConsumerState<LessonManageScreen> {
  final ScrollController _scrollController = ScrollController();
  String _selectedCategory = '';
  String _selectedDifficulty = '';

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(lessonsProvider.notifier).loadMore();
    }
  }

  Future<void> _onRefresh() async {
    await ref.read(lessonsProvider.notifier).refresh();
  }

  void _onSearch(String query) {
    ref.read(lessonsProvider.notifier).search(query);
  }

  void _onCategoryChanged(String? category) {
    setState(() {
      _selectedCategory = category ?? '';
    });
    ref
        .read(lessonsProvider.notifier)
        .filterByCategory(category?.isEmpty == true ? null : category);
  }

  void _onDifficultyChanged(String? difficulty) {
    setState(() {
      _selectedDifficulty = difficulty ?? '';
    });
    ref
        .read(lessonsProvider.notifier)
        .filterByDifficulty(difficulty?.isEmpty == true ? null : difficulty);
  }

  void _showDeleteConfirmation(Lesson lesson) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Lesson'),
        content: Text('Are you sure you want to delete \"${lesson.title}\"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _deleteLesson(lesson);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteLesson(Lesson lesson) async {
    try {
      await ref.read(lessonsProvider.notifier).deleteLesson(lesson.id!);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Lesson deleted successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to delete lesson: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final lessonsAsync = ref.watch(lessonsProvider);
    final user = AuthService.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Lessons'),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: LessonManageSearchDelegate(
                  onSearchChanged: _onSearch,
                ),
              );
            },
          ),
          if (user?.canCreateContent == true)
            IconButton(
              icon: const Icon(Icons.add),
              tooltip: 'Create Lesson',
              onPressed: () => context.go('/lessons/create'),
            ),
        ],
      ),
      body: Column(
        children: [
          // Filters
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[100],
            child: Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Category',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    value: _selectedCategory.isEmpty ? null : _selectedCategory,
                    items: [
                      const DropdownMenuItem(
                          value: '', child: Text('All Categories')),
                      const DropdownMenuItem(
                          value: 'GENERAL', child: Text('General')),
                      const DropdownMenuItem(
                          value: 'LISTENING', child: Text('Listening')),
                      const DropdownMenuItem(
                          value: 'READING', child: Text('Reading')),
                      const DropdownMenuItem(
                          value: 'VOCABULARY', child: Text('Vocabulary')),
                      const DropdownMenuItem(
                          value: 'GRAMMAR', child: Text('Grammar')),
                    ],
                    onChanged: _onCategoryChanged,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Difficulty',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    value: _selectedDifficulty.isEmpty
                        ? null
                        : _selectedDifficulty,
                    items: [
                      const DropdownMenuItem(
                          value: '', child: Text('All Levels')),
                      const DropdownMenuItem(
                          value: 'EASY', child: Text('Easy')),
                      const DropdownMenuItem(
                          value: 'MEDIUM', child: Text('Medium')),
                      const DropdownMenuItem(
                          value: 'HARD', child: Text('Hard')),
                    ],
                    onChanged: _onDifficultyChanged,
                  ),
                ),
              ],
            ),
          ),

          // Lessons List
          Expanded(
            child: lessonsAsync.when(
              data: (response) => RefreshIndicator(
                onRefresh: _onRefresh,
                child: response.lessons.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.school_outlined,
                                size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              'No lessons found',
                              style:
                                  TextStyle(fontSize: 18, color: Colors.grey),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: response.lessons.length +
                            (response.hasNext ? 1 : 0),
                        itemBuilder: (context, index) {
                          if (index >= response.lessons.length) {
                            return const Center(
                              child: Padding(
                                padding: EdgeInsets.all(16),
                                child: CircularProgressIndicator(),
                              ),
                            );
                          }

                          final lesson = response.lessons[index];
                          return _LessonManageCard(
                            lesson: lesson,
                            onEdit: user?.canCreateContent == true
                                ? () =>
                                    context.push('/lessons/${lesson.id}/edit')
                                : null,
                            onDelete: user?.canCreateContent == true
                                ? () => _showDeleteConfirmation(lesson)
                                : null,
                            onTap: () => context.push('/lessons/${lesson.id}'),
                          );
                        },
                      ),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline,
                        size: 64, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Error: $error',
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _onRefresh,
                      child: const Text('Retry'),
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
}

class _LessonManageCard extends StatelessWidget {
  final Lesson lesson;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onTap;

  const _LessonManageCard({
    required this.lesson,
    this.onEdit,
    this.onDelete,
    this.onTap,
  });

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return Colors.green;
      case 'MEDIUM':
        return Colors.orange;
      case 'HARD':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: InkWell(
        onTap: onTap,
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
                      lesson.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (onEdit != null || onDelete != null)
                    PopupMenuButton<String>(
                      onSelected: (value) {
                        switch (value) {
                          case 'edit':
                            onEdit?.call();
                            break;
                          case 'delete':
                            onDelete?.call();
                            break;
                        }
                      },
                      itemBuilder: (context) => [
                        if (onEdit != null)
                          const PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit, size: 20),
                                SizedBox(width: 8),
                                Text('Edit'),
                              ],
                            ),
                          ),
                        if (onDelete != null)
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 20, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Delete',
                                    style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                lesson.description,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getDifficultyColor(lesson.difficulty)
                          .withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _getDifficultyColor(lesson.difficulty),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      lesson.difficulty,
                      style: TextStyle(
                        color: _getDifficultyColor(lesson.difficulty),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.blue, width: 1),
                    ),
                    child: Text(
                      lesson.category,
                      style: const TextStyle(
                        color: Colors.blue,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    '${lesson.estimatedTime} min',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              if (lesson.imageUrl != null || lesson.audioUrl != null) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    if (lesson.imageUrl != null) ...[
                      Icon(Icons.image, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      const Text('Image', style: TextStyle(fontSize: 12)),
                    ],
                    if (lesson.imageUrl != null && lesson.audioUrl != null)
                      const SizedBox(width: 16),
                    if (lesson.audioUrl != null) ...[
                      Icon(Icons.audiotrack, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      const Text('Audio', style: TextStyle(fontSize: 12)),
                    ],
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
