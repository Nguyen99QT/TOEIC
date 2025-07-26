import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/features/exercise/providers/exercise_provider.dart';

class ExerciseListPage extends ConsumerStatefulWidget {
  final String? lessonId;
  final String? type;
  final String? difficulty;
  final String? level;

  const ExerciseListPage({
    Key? key,
    this.lessonId,
    this.type,
    this.difficulty,
    this.level,
  }) : super(key: key);

  @override
  ConsumerState<ExerciseListPage> createState() => _ExerciseListPageState();
}

class _ExerciseListPageState extends ConsumerState<ExerciseListPage> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  String? _selectedType;
  String? _selectedDifficulty;
  String? _selectedLevel;

  @override
  void initState() {
    super.initState();
    _selectedType = widget.type;
    _selectedDifficulty = widget.difficulty;
    _selectedLevel = widget.level;

    // Load initial exercises
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadExercises();
    });

    // Add scroll listener for pagination
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      _loadMoreExercises();
    }
  }

  void _loadExercises() {
    ref.read(exerciseListProvider.notifier).loadExercises(
          type: _selectedType,
          difficulty: _selectedDifficulty,
          level: _selectedLevel,
          lessonId: widget.lessonId,
        );
  }

  void _loadMoreExercises() {
    ref.read(exerciseListProvider.notifier).loadExercises(
          type: _selectedType,
          difficulty: _selectedDifficulty,
          level: _selectedLevel,
          lessonId: widget.lessonId,
        );
  }

  void _searchExercises(String query) {
    if (query.isEmpty) {
      _loadExercises();
    } else {
      ref.read(exerciseListProvider.notifier).searchExercises(query);
    }
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Exercises'),
        content: StatefulBuilder(
          builder: (context, setState) => Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: _selectedType,
                decoration: const InputDecoration(labelText: 'Type'),
                items: [
                  'multiple_choice',
                  'fill_in_blank',
                  'matching',
                  'listening',
                  'reading'
                ]
                    .map((type) =>
                        DropdownMenuItem(value: type, child: Text(type)))
                    .toList(),
                onChanged: (value) => setState(() => _selectedType = value),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedDifficulty,
                decoration: const InputDecoration(labelText: 'Difficulty'),
                items: ['easy', 'medium', 'hard']
                    .map((difficulty) => DropdownMenuItem(
                        value: difficulty, child: Text(difficulty)))
                    .toList(),
                onChanged: (value) =>
                    setState(() => _selectedDifficulty = value),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedLevel,
                decoration: const InputDecoration(labelText: 'Level'),
                items: ['beginner', 'intermediate', 'advanced']
                    .map((level) =>
                        DropdownMenuItem(value: level, child: Text(level)))
                    .toList(),
                onChanged: (value) => setState(() => _selectedLevel = value),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _selectedType = null;
                _selectedDifficulty = null;
                _selectedLevel = null;
              });
              Navigator.pop(context);
              _loadExercises();
            },
            child: const Text('Clear'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _loadExercises();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final exerciseState = ref.watch(exerciseListProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(
            widget.lessonId != null ? 'Lesson Exercises' : 'All Exercises'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/exercises/create'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search exercises...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    _loadExercises();
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onSubmitted: _searchExercises,
            ),
          ),

          // Filter chips
          if (_selectedType != null ||
              _selectedDifficulty != null ||
              _selectedLevel != null)
            Container(
              height: 60,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  if (_selectedType != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text('Type: $_selectedType'),
                        onDeleted: () {
                          setState(() => _selectedType = null);
                          _loadExercises();
                        },
                      ),
                    ),
                  if (_selectedDifficulty != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text('Difficulty: $_selectedDifficulty'),
                        onDeleted: () {
                          setState(() => _selectedDifficulty = null);
                          _loadExercises();
                        },
                      ),
                    ),
                  if (_selectedLevel != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text('Level: $_selectedLevel'),
                        onDeleted: () {
                          setState(() => _selectedLevel = null);
                          _loadExercises();
                        },
                      ),
                    ),
                ],
              ),
            ),

          // Exercise list
          Expanded(
            child: exerciseState.error != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error, size: 64, color: Colors.red[300]),
                        const SizedBox(height: 16),
                        Text(
                          'Error: ${exerciseState.error}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadExercises,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : exerciseState.exercises.isEmpty && !exerciseState.isLoading
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.quiz, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              'No exercises found',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Try adjusting your filters or search terms',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () async => _loadExercises(),
                        child: ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: exerciseState.exercises.length +
                              (exerciseState.isLoading ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == exerciseState.exercises.length) {
                              return const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(16),
                                  child: CircularProgressIndicator(),
                                ),
                              );
                            }

                            final exercise = exerciseState.exercises[index];
                            return ExerciseCard(
                              exercise: exercise,
                              onTap: () =>
                                  context.push('/exercises/${exercise.id}'),
                              onEdit: () => context
                                  .push('/exercises/${exercise.id}/edit'),
                              onDelete: () => _showDeleteDialog(exercise),
                              onStartQuiz: () => _startQuiz([exercise]),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: exerciseState.exercises.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () => _startQuiz(exerciseState.exercises),
              label: const Text('Start Quiz'),
              icon: const Icon(Icons.play_arrow),
            )
          : null,
    );
  }

  void _showDeleteDialog(Exercise exercise) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Exercise'),
        content: Text('Are you sure you want to delete "${exercise.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              Navigator.pop(context);
              try {
                final apiService = ref.read(exerciseApiServiceProvider);
                await apiService.deleteExercise(exercise.id!);
                ref
                    .read(exerciseListProvider.notifier)
                    .deleteExercise(exercise.id!);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Exercise deleted successfully')),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Failed to delete exercise: $e'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _startQuiz(List<Exercise> exercises) {
    ref.read(exerciseQuizProvider.notifier).initializeQuiz(exercises);
    context.push('/exercises/quiz');
  }
}

class ExerciseCard extends StatelessWidget {
  final Exercise exercise;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onStartQuiz;

  const ExerciseCard({
    Key? key,
    required this.exercise,
    this.onTap,
    this.onEdit,
    this.onDelete,
    this.onStartQuiz,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
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
                      exercise.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  PopupMenuButton<String>(
                    onSelected: (value) {
                      switch (value) {
                        case 'edit':
                          onEdit?.call();
                          break;
                        case 'delete':
                          onDelete?.call();
                          break;
                        case 'quiz':
                          onStartQuiz?.call();
                          break;
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                          value: 'quiz', child: Text('Start Quiz')),
                      const PopupMenuItem(value: 'edit', child: Text('Edit')),
                      const PopupMenuItem(
                          value: 'delete', child: Text('Delete')),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                exercise.description,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: [
                  _buildChip(exercise.type, Colors.blue),
                  _buildChip(exercise.difficulty,
                      _getDifficultyColor(exercise.difficulty)),
                  _buildChip(exercise.level, Colors.green),
                  if (exercise.timeLimit != null && exercise.timeLimit! > 0)
                    _buildChip('${exercise.timeLimit}s', Colors.orange),
                  if (exercise.points > 0)
                    _buildChip('${exercise.points} pts', Colors.purple),
                  if (exercise.isPremium == true)
                    _buildChip('Premium', Colors.amber),
                ],
              ),
              if (exercise.imageUrl != null || exercise.audioUrl != null) ...[
                const SizedBox(height: 12),
                Row(
                  children: [
                    if (exercise.imageUrl != null)
                      const Icon(Icons.image, size: 16, color: Colors.grey),
                    if (exercise.imageUrl != null && exercise.audioUrl != null)
                      const SizedBox(width: 8),
                    if (exercise.audioUrl != null)
                      const Icon(Icons.audiotrack,
                          size: 16, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(
                      'Has media files',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
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
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return Colors.green;
      case 'medium':
        return Colors.orange;
      case 'hard':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
