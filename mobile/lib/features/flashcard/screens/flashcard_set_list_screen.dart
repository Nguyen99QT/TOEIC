import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/models/flashcard_model.dart';
import 'package:toeic_mobile/features/flashcard/providers/flashcard_provider.dart';

class FlashcardSetListScreen extends ConsumerStatefulWidget {
  const FlashcardSetListScreen({super.key});

  @override
  ConsumerState<FlashcardSetListScreen> createState() =>
      _FlashcardSetListScreenState();
}

class _FlashcardSetListScreenState
    extends ConsumerState<FlashcardSetListScreen> {
  final _scrollController = ScrollController();
  final _searchController = TextEditingController();
  String? _selectedDifficulty;
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    // Load initial data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(flashcardSetsProvider.notifier).loadSets();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      _loadMore();
    }
  }

  void _loadMore() {
    ref.read(flashcardSetsProvider.notifier).loadMore(
          search:
              _searchController.text.isEmpty ? null : _searchController.text,
          difficulty: _selectedDifficulty,
          category: _selectedCategory,
        );
  }

  void _onSearch() {
    ref.read(flashcardSetsProvider.notifier).refresh(
          search:
              _searchController.text.isEmpty ? null : _searchController.text,
          difficulty: _selectedDifficulty,
          category: _selectedCategory,
        );
  }

  void _onRefresh() async {
    await ref.read(flashcardSetsProvider.notifier).refresh(
          search:
              _searchController.text.isEmpty ? null : _searchController.text,
          difficulty: _selectedDifficulty,
          category: _selectedCategory,
        );
  }

  @override
  Widget build(BuildContext context) {
    final setsState = ref.watch(flashcardSetsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Flashcard Sets'),
        backgroundColor: Colors.purple[600],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/flashcards/create-set'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                // Search bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search flashcard sets...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        _onSearch();
                      },
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  onSubmitted: (_) => _onSearch(),
                ),
                const SizedBox(height: 12),
                // Filters
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedDifficulty,
                        decoration: InputDecoration(
                          labelText: 'Difficulty',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
                        items: const [
                          DropdownMenuItem(value: null, child: Text('All')),
                          DropdownMenuItem(value: 'EASY', child: Text('Easy')),
                          DropdownMenuItem(
                              value: 'MEDIUM', child: Text('Medium')),
                          DropdownMenuItem(value: 'HARD', child: Text('Hard')),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _selectedDifficulty = value;
                          });
                          _onSearch();
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedCategory,
                        decoration: InputDecoration(
                          labelText: 'Category',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
                        items: const [
                          DropdownMenuItem(value: null, child: Text('All')),
                          DropdownMenuItem(
                              value: 'GENERAL', child: Text('General')),
                          DropdownMenuItem(
                              value: 'VOCABULARY', child: Text('Vocabulary')),
                          DropdownMenuItem(
                              value: 'GRAMMAR', child: Text('Grammar')),
                          DropdownMenuItem(
                              value: 'IDIOMS', child: Text('Idioms')),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _selectedCategory = value;
                          });
                          _onSearch();
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Flashcard Sets List
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async => _onRefresh(),
              child: setsState.sets.isEmpty && setsState.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : setsState.sets.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.style_outlined,
                                size: 64,
                                color: Colors.grey[400],
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No flashcard sets found',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(
                                      color: Colors.grey[600],
                                    ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Create your first flashcard set or adjust your filters',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(
                                      color: Colors.grey[500],
                                    ),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: setsState.sets.length +
                              (setsState.hasNextPage ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == setsState.sets.length) {
                              return const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(16),
                                  child: CircularProgressIndicator(),
                                ),
                              );
                            }

                            final set = setsState.sets[index];
                            return _FlashcardSetCard(
                              flashcardSet: set,
                              onTap: () =>
                                  context.push('/flashcards/${set.id}'),
                              onEdit: () => context
                                  .push('/flashcards/${set.id}/edit-set'),
                              onDelete: () => _showDeleteDialog(set),
                            );
                          },
                        ),
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(FlashcardSet set) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Flashcard Set'),
        content: Text(
            'Are you sure you want to delete "${set.title}"? This will also delete all flashcards in this set.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await ref
                    .read(flashcardSetsProvider.notifier)
                    .deleteSet(set.id!);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Flashcard set deleted successfully'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Failed to delete flashcard set: $e'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

class _FlashcardSetCard extends StatelessWidget {
  final FlashcardSet flashcardSet;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _FlashcardSetCard({
    required this.flashcardSet,
    required this.onTap,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      flashcardSet.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                  PopupMenuButton(
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit, size: 20),
                            SizedBox(width: 8),
                            Text('Edit Set'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'manage',
                        child: Row(
                          children: [
                            Icon(Icons.style, size: 20),
                            SizedBox(width: 8),
                            Text('Manage Cards'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete, size: 20, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                    onSelected: (value) {
                      if (value == 'edit') {
                        onEdit();
                      } else if (value == 'manage') {
                        onTap();
                      } else if (value == 'delete') {
                        onDelete();
                      }
                    },
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                flashcardSet.description,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildChip(
                    flashcardSet.difficulty,
                    _getDifficultyColor(flashcardSet.difficulty),
                  ),
                  const SizedBox(width: 8),
                  _buildChip(
                    flashcardSet.category,
                    Colors.purple[100]!,
                  ),
                  const Spacer(),
                  Icon(
                    Icons.style_outlined,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${flashcardSet.flashcards?.length ?? 0} cards',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                ],
              ),
              if (flashcardSet.imageUrl != null ||
                  flashcardSet.audioUrl != null) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    if (flashcardSet.imageUrl != null) ...[
                      Icon(
                        Icons.image_outlined,
                        size: 16,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Image',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.grey[600],
                            ),
                      ),
                      const SizedBox(width: 12),
                    ],
                    if (flashcardSet.audioUrl != null) ...[
                      Icon(
                        Icons.audiotrack_outlined,
                        size: 16,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Audio',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.grey[600],
                            ),
                      ),
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

  Widget _buildChip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return Colors.green[100]!;
      case 'MEDIUM':
        return Colors.orange[100]!;
      case 'HARD':
        return Colors.red[100]!;
      default:
        return Colors.grey[100]!;
    }
  }
}
