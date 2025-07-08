import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';
import '../services/api_service.dart';
import '../widgets/lesson_card.dart';
import 'lesson_detail_screen.dart';

class LessonListScreen extends StatefulWidget {
  const LessonListScreen({Key? key}) : super(key: key);

  @override
  _LessonListScreenState createState() => _LessonListScreenState();
}

class _LessonListScreenState extends State<LessonListScreen> {
  List<Lesson> lessons = [];
  bool isLoading = false;
  LessonLevel? selectedLevel;
  bool? isPremiumFilter;

  @override
  void initState() {
    super.initState();
    _fetchLessons();
  }

  Future<void> _fetchLessons() async {
    setState(() => isLoading = true);
    try {
      String? levelString;
      if (selectedLevel != null) {
        levelString = selectedLevel.toString().split('.').last;
      }

      final fetchedLessons = await ApiService().getLessons(
        level: levelString,
        isPremium: isPremiumFilter,
      );
      setState(() => lessons = fetchedLessons);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading lessons: ${e.toString()}')),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _applyFilters() {
    _fetchLessons();
  }

  void _resetFilters() {
    setState(() {
      selectedLevel = null;
      isPremiumFilter = null;
    });
    _fetchLessons();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TOEIC Lessons'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : lessons.isEmpty
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'No lessons found',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _fetchLessons,
                      child: const Text('Refresh'),
                    ),
                  ],
                ),
              )
              : RefreshIndicator(
                onRefresh: _fetchLessons,
                child: ListView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: lessons.length,
                  itemBuilder: (context, index) {
                    return LessonCard(
                      lesson: lessons[index],
                      onTap:
                          () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder:
                                  (context) => LessonDetailScreen(
                                    lesson: lessons[index],
                                  ),
                            ),
                          ),
                    );
                  },
                ),
              ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Filter Lessons'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Level:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children:
                        LessonLevel.values.map((level) {
                          final isSelected = selectedLevel == level;
                          return FilterChip(
                            label: Text(level.toString().split('.').last),
                            selected: isSelected,
                            onSelected: (selected) {
                              setState(() {
                                selectedLevel = selected ? level : null;
                              });
                            },
                          );
                        }).toList(),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Access:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      FilterChip(
                        label: const Text('Free'),
                        selected: isPremiumFilter == false,
                        onSelected: (selected) {
                          setState(() {
                            isPremiumFilter = selected ? false : null;
                          });
                        },
                      ),
                      FilterChip(
                        label: const Text('Premium'),
                        selected: isPremiumFilter == true,
                        onSelected: (selected) {
                          setState(() {
                            isPremiumFilter = selected ? true : null;
                          });
                        },
                      ),
                    ],
                  ),
                ],
              ),
              actions: [
                TextButton(
                  child: const Text('Reset'),
                  onPressed: () {
                    setState(() {
                      selectedLevel = null;
                      isPremiumFilter = null;
                    });
                  },
                ),
                TextButton(
                  child: const Text('Cancel'),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
                ElevatedButton(
                  child: const Text('Apply'),
                  onPressed: () {
                    this.setState(() {
                      this.selectedLevel = selectedLevel;
                      this.isPremiumFilter = isPremiumFilter;
                    });
                    _applyFilters();
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }
}
