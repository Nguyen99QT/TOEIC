import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';
import '../services/api_service.dart';
import '../widgets/exercise_intro_view.dart';
import 'question_list_screen.dart';

class ExerciseScreen extends StatefulWidget {
  final Exercise exercise;

  const ExerciseScreen({super.key, required this.exercise});

  @override
  _ExerciseScreenState createState() => _ExerciseScreenState();
}

class _ExerciseScreenState extends State<ExerciseScreen> {
  List<Question> questions = [];
  bool isLoading = false;
  bool isStarted = false;

  @override
  void initState() {
    super.initState();
    _fetchQuestions();
  }

  Future<void> _fetchQuestions() async {
    setState(() => isLoading = true);
    try {
      // Gọi API lấy danh sách câu hỏi của bài tập
      final fetchedQuestions = await ApiService().getQuestionsByExerciseId(
        widget.exercise.id,
      );
      setState(() => questions = fetchedQuestions);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading questions: ${e.toString()}')),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _startExercise() {
    setState(() => isStarted = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.exercise.title),
        backgroundColor: widget.exercise.typeColor,
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : questions.isEmpty
              ? const Center(
                child: Text(
                  'No questions available for this exercise',
                  style: TextStyle(fontSize: 16),
                ),
              )
              : !isStarted
              ? ExerciseIntroView(
                exercise: widget.exercise,
                onStart: _startExercise,
              )
              : QuestionListScreen(questions: questions),
    );
  }
}
