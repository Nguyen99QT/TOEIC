import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';
import '../services/api_service.dart';
import '../widgets/lesson_header.dart';
import '../widgets/exercise_card.dart';
import 'exercise_screen.dart';

class LessonDetailScreen extends StatefulWidget {
  final Lesson lesson;

  const LessonDetailScreen({super.key, required this.lesson});

  @override
  _LessonDetailScreenState createState() => _LessonDetailScreenState();
}

class _LessonDetailScreenState extends State<LessonDetailScreen> {
  List<Exercise> exercises = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchExercises();
  }

  Future<void> _fetchExercises() async {
    setState(() => isLoading = true);
    try {
      final fetchedExercises = await ApiService().getExercisesByLessonId(
        widget.lesson.id,
      );
      setState(() => exercises = fetchedExercises);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading exercises: ${e.toString()}')),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Lesson ${widget.lesson.id}'),
        backgroundColor: widget.lesson.levelColor,
      ),
      body: RefreshIndicator(
        onRefresh: _fetchExercises,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Lesson image if available
              if (widget.lesson.imageUrl != null)
                Container(
                  width: double.infinity,
                  height: 200,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(widget.lesson.imageUrl!),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),

              // Lesson header with title, description, etc.
              LessonHeader(lesson: widget.lesson),

              // Lesson content
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Lesson Content',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.lesson.content,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),

              // Exercises section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: const Text(
                  'Exercises',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),

              const SizedBox(height: 8),

              // Exercises list
              isLoading
                  ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24.0),
                      child: CircularProgressIndicator(),
                    ),
                  )
                  : exercises.isEmpty
                  ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        children: [
                          const Text(
                            'No exercises available for this lesson',
                            style: TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _fetchExercises,
                            child: const Text('Refresh'),
                          ),
                        ],
                      ),
                    ),
                  )
                  : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    itemCount: exercises.length,
                    itemBuilder: (context, index) {
                      return ExerciseCard(
                        exercise: exercises[index],
                        onTap:
                            () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder:
                                    (context) => ExerciseScreen(
                                      exercise: exercises[index],
                                    ),
                              ),
                            ),
                      );
                    },
                  ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
