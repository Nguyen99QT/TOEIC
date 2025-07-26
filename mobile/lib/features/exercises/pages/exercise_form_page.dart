import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/features/exercise/providers/exercise_provider.dart';

class ExerciseFormPage extends ConsumerStatefulWidget {
  final String? exerciseId; // null for create, provided for edit

  const ExerciseFormPage({
    Key? key,
    this.exerciseId,
  }) : super(key: key);

  @override
  ConsumerState<ExerciseFormPage> createState() => _ExerciseFormPageState();
}

class _ExerciseFormPageState extends ConsumerState<ExerciseFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _questionController = TextEditingController();
  final _correctAnswerController = TextEditingController();
  final _explanationController = TextEditingController();
  final _timeLimitController = TextEditingController();
  final _pointsController = TextEditingController();
  final _orderIndexController = TextEditingController();
  final _lessonIdController = TextEditingController();

  String _selectedType = 'multiple_choice';
  String _selectedDifficulty = 'medium';
  String _selectedLevel = 'intermediate';
  bool _isActive = true;
  bool _isPremium = false;

  final List<TextEditingController> _optionControllers = [];
  File? _imageFile;
  File? _audioFile;
  Exercise? _existingExercise;

  @override
  void initState() {
    super.initState();
    _initializeOptions();

    if (widget.exerciseId != null) {
      // Load existing exercise for editing - the provider family automatically loads the exercise
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _questionController.dispose();
    _correctAnswerController.dispose();
    _explanationController.dispose();
    _timeLimitController.dispose();
    _pointsController.dispose();
    _orderIndexController.dispose();
    _lessonIdController.dispose();
    for (var controller in _optionControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _initializeOptions() {
    // Initialize with 4 options for multiple choice
    for (int i = 0; i < 4; i++) {
      _optionControllers.add(TextEditingController());
    }
  }

  void _loadExistingExercise(Exercise exercise) {
    if (_existingExercise?.id == exercise.id) return; // Already loaded

    _existingExercise = exercise;
    _titleController.text = exercise.title;
    _descriptionController.text = exercise.description;
    _questionController.text = exercise.question;
    _correctAnswerController.text = exercise.correctAnswer;
    _explanationController.text = exercise.explanation ?? '';
    _timeLimitController.text = exercise.timeLimit?.toString() ?? '';
    _pointsController.text = exercise.points.toString();
    _orderIndexController.text = exercise.orderIndex.toString();
    _lessonIdController.text = exercise.lessonId ?? '';

    _selectedType = exercise.type;
    _selectedDifficulty = exercise.difficulty;
    _selectedLevel = exercise.level;
    _isActive = exercise.isActive;
    _isPremium = exercise.isPremium;

    // Load options
    _updateOptionsForType(_selectedType);
    for (int i = 0;
        i < exercise.options.length && i < _optionControllers.length;
        i++) {
      _optionControllers[i].text = exercise.options[i];
    }
  }

  void _updateOptionsForType(String type) {
    // Clear existing controllers
    for (var controller in _optionControllers) {
      controller.dispose();
    }
    _optionControllers.clear();

    // Add appropriate number of options based on type
    int optionCount = 0;
    switch (type) {
      case 'multiple_choice':
        optionCount = 4;
        break;
      case 'matching':
        optionCount = 6;
        break;
      case 'true_false':
        optionCount = 2;
        _optionControllers.add(TextEditingController()..text = 'True');
        _optionControllers.add(TextEditingController()..text = 'False');
        return;
      default:
        optionCount = 0; // No options for fill_in_blank, essay, etc.
    }

    for (int i = 0; i < optionCount; i++) {
      _optionControllers.add(TextEditingController());
    }
  }

  @override
  Widget build(BuildContext context) {
    final exerciseState = widget.exerciseId != null
        ? ref.watch(exerciseDetailProvider(widget.exerciseId!))
        : null;
    final isEditing = widget.exerciseId != null;

    // Load existing exercise data if editing
    if (isEditing &&
        exerciseState?.hasValue == true &&
        exerciseState?.value != null &&
        _existingExercise == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadExistingExercise(exerciseState!.value!);
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Exercise' : 'Create Exercise'),
        actions: [
          TextButton(
            onPressed: _saveExercise,
            child: Text(
              isEditing ? 'Update' : 'Save',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: (isEditing && exerciseState?.isLoading == true)
          ? const Center(child: CircularProgressIndicator())
          : Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Basic Information
                    _buildSectionHeader('Basic Information'),
                    _buildTextField(
                      controller: _titleController,
                      label: 'Title',
                      hint: 'Enter exercise title',
                      required: true,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _descriptionController,
                      label: 'Description',
                      hint: 'Enter exercise description',
                      maxLines: 3,
                      required: true,
                    ),

                    const SizedBox(height: 24),

                    // Exercise Configuration
                    _buildSectionHeader('Exercise Configuration'),
                    _buildDropdownField(
                      label: 'Type',
                      value: _selectedType,
                      items: [
                        'multiple_choice',
                        'fill_in_blank',
                        'matching',
                        'true_false',
                        'listening',
                        'reading',
                        'essay',
                      ],
                      onChanged: (value) {
                        setState(() {
                          _selectedType = value!;
                          _updateOptionsForType(_selectedType);
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildDropdownField(
                            label: 'Difficulty',
                            value: _selectedDifficulty,
                            items: ['easy', 'medium', 'hard'],
                            onChanged: (value) =>
                                setState(() => _selectedDifficulty = value!),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildDropdownField(
                            label: 'Level',
                            value: _selectedLevel,
                            items: ['beginner', 'intermediate', 'advanced'],
                            onChanged: (value) =>
                                setState(() => _selectedLevel = value!),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Question
                    _buildSectionHeader('Question'),
                    _buildTextField(
                      controller: _questionController,
                      label: 'Question',
                      hint: 'Enter the question text',
                      maxLines: 3,
                      required: true,
                    ),

                    const SizedBox(height: 24),

                    // Options (if applicable)
                    if (_optionControllers.isNotEmpty) ...[
                      _buildSectionHeader('Answer Options'),
                      ..._optionControllers.asMap().entries.map((entry) {
                        final index = entry.key;
                        final controller = entry.value;
                        final optionLabel = _selectedType == 'matching'
                            ? 'Item ${index + 1}'
                            : 'Option ${String.fromCharCode(65 + index)}'; // A, B, C, D

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _buildTextField(
                            controller: controller,
                            label: optionLabel,
                            hint: 'Enter $optionLabel',
                            required: _selectedType == 'multiple_choice' ||
                                _selectedType == 'true_false',
                          ),
                        );
                      }).toList(),
                      const SizedBox(height: 16),
                    ],

                    // Correct Answer
                    _buildSectionHeader('Correct Answer'),
                    if (_selectedType == 'multiple_choice' ||
                        _selectedType == 'true_false') ...[
                      DropdownButtonFormField<String>(
                        value: _correctAnswerController.text.isEmpty
                            ? null
                            : _correctAnswerController.text,
                        decoration: const InputDecoration(
                          labelText: 'Select Correct Answer',
                          border: OutlineInputBorder(),
                        ),
                        items: _optionControllers
                            .where((c) => c.text.isNotEmpty)
                            .map((c) => DropdownMenuItem(
                                value: c.text, child: Text(c.text)))
                            .toList(),
                        onChanged: (value) {
                          _correctAnswerController.text = value ?? '';
                        },
                        validator: (value) => value == null
                            ? 'Please select the correct answer'
                            : null,
                      ),
                    ] else ...[
                      _buildTextField(
                        controller: _correctAnswerController,
                        label: 'Correct Answer',
                        hint: 'Enter the correct answer',
                        required: true,
                      ),
                    ],

                    const SizedBox(height: 24),

                    // Explanation
                    _buildSectionHeader('Explanation (Optional)'),
                    _buildTextField(
                      controller: _explanationController,
                      label: 'Explanation',
                      hint: 'Explain why this is the correct answer',
                      maxLines: 4,
                    ),

                    const SizedBox(height: 24),

                    // Media Files
                    _buildSectionHeader('Media Files (Optional)'),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text('Image',
                                          style: TextStyle(
                                              fontWeight: FontWeight.w500)),
                                      const SizedBox(height: 4),
                                      Text(
                                        _imageFile?.path.split('/').last ??
                                            'No image selected',
                                        style: TextStyle(
                                            color: Colors.grey[600],
                                            fontSize: 12),
                                      ),
                                    ],
                                  ),
                                ),
                                OutlinedButton(
                                  onPressed: _pickImage,
                                  child: const Text('Choose Image'),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text('Audio',
                                          style: TextStyle(
                                              fontWeight: FontWeight.w500)),
                                      const SizedBox(height: 4),
                                      Text(
                                        _audioFile?.path.split('/').last ??
                                            'No audio selected',
                                        style: TextStyle(
                                            color: Colors.grey[600],
                                            fontSize: 12),
                                      ),
                                    ],
                                  ),
                                ),
                                OutlinedButton(
                                  onPressed: _pickAudio,
                                  child: const Text('Choose Audio'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Additional Settings
                    _buildSectionHeader('Additional Settings'),
                    _buildTextField(
                      controller: _lessonIdController,
                      label: 'Lesson ID',
                      hint: 'Associated lesson ID',
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            controller: _timeLimitController,
                            label: 'Time Limit (seconds)',
                            hint: 'e.g., 60',
                            keyboardType: TextInputType.number,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            controller: _pointsController,
                            label: 'Points',
                            hint: 'e.g., 10',
                            keyboardType: TextInputType.number,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            controller: _orderIndexController,
                            label: 'Order Index',
                            hint: 'Display order',
                            keyboardType: TextInputType.number,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Status'),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Checkbox(
                                    value: _isActive,
                                    onChanged: (value) =>
                                        setState(() => _isActive = value!),
                                  ),
                                  const Text('Active'),
                                  const SizedBox(width: 16),
                                  Checkbox(
                                    value: _isPremium,
                                    onChanged: (value) =>
                                        setState(() => _isPremium = value!),
                                  ),
                                  const Text('Premium'),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 32),

                    // Save Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: (exerciseState?.isLoading ?? false)
                            ? null
                            : _saveExercise,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: (exerciseState?.isLoading ?? false)
                            ? const CircularProgressIndicator(
                                color: Colors.white)
                            : Text(
                                isEditing
                                    ? 'Update Exercise'
                                    : 'Create Exercise',
                                style: const TextStyle(fontSize: 16),
                              ),
                      ),
                    ),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    String? hint,
    int maxLines = 1,
    bool required = false,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
      ),
      maxLines: maxLines,
      keyboardType: keyboardType,
      validator: required
          ? (value) =>
              value == null || value.isEmpty ? 'This field is required' : null
          : null,
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
      items: items
          .map((item) => DropdownMenuItem(value: item, child: Text(item)))
          .toList(),
      onChanged: onChanged,
    );
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
      });
    }
  }

  Future<void> _pickAudio() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.audio,
      allowMultiple: false,
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _audioFile = File(result.files.single.path!);
      });
    }
  }

  Future<void> _saveExercise() async {
    if (!_formKey.currentState!.validate()) return;

    final options = _optionControllers
        .where((c) => c.text.isNotEmpty)
        .map((c) => c.text)
        .toList();

    final isEditing = widget.exerciseId != null;
    final apiService = ref.read(exerciseApiServiceProvider);

    Exercise? result;

    try {
      if (isEditing) {
        final response = await apiService.updateExercise(
          id: widget.exerciseId!,
          title: _titleController.text,
          description: _descriptionController.text,
          question: _questionController.text,
          type: _selectedType,
          difficulty: _selectedDifficulty,
          level: _selectedLevel,
          options: options,
          correctAnswer: _correctAnswerController.text,
          explanation: _explanationController.text.isEmpty
              ? null
              : _explanationController.text,
          timeLimit: _timeLimitController.text.isEmpty
              ? 0
              : int.tryParse(_timeLimitController.text) ?? 0,
          points: _pointsController.text.isEmpty
              ? 0
              : int.tryParse(_pointsController.text) ?? 0,
          orderIndex: _orderIndexController.text.isEmpty
              ? 0
              : int.tryParse(_orderIndexController.text) ?? 0,
          lessonId: _lessonIdController.text.isEmpty
              ? null
              : _lessonIdController.text,
          isActive: _isActive,
          isPremium: _isPremium,
          imageFile: _imageFile,
          audioFile: _audioFile,
        );
        result =
            response.exercises.isNotEmpty ? response.exercises.first : null;
      } else {
        final response = await apiService.createExercise(
          title: _titleController.text,
          description: _descriptionController.text,
          question: _questionController.text,
          type: _selectedType,
          difficulty: _selectedDifficulty,
          level: _selectedLevel,
          options: options,
          correctAnswer: _correctAnswerController.text,
          explanation: _explanationController.text.isEmpty
              ? null
              : _explanationController.text,
          timeLimit: _timeLimitController.text.isEmpty
              ? 0
              : int.tryParse(_timeLimitController.text) ?? 0,
          points: _pointsController.text.isEmpty
              ? 0
              : int.tryParse(_pointsController.text) ?? 0,
          orderIndex: _orderIndexController.text.isEmpty
              ? 0
              : int.tryParse(_orderIndexController.text) ?? 0,
          lessonId: _lessonIdController.text.isEmpty
              ? null
              : _lessonIdController.text,
          isActive: _isActive,
          isPremium: _isPremium,
          imageFile: _imageFile,
          audioFile: _audioFile,
        );
        result =
            response.exercises.isNotEmpty ? response.exercises.first : null;
      }

      if (result != null) {
        // Refresh the exercise list to reflect changes
        ref.read(exerciseListProvider.notifier).refresh();

        if (mounted) {
          context.pop();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(isEditing
                  ? 'Exercise updated successfully'
                  : 'Exercise created successfully'),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(isEditing
                ? 'Failed to update exercise: $e'
                : 'Failed to create exercise: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}
