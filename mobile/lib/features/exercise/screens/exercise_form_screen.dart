import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/features/exercise/providers/exercise_provider.dart';

class ExerciseFormScreen extends ConsumerStatefulWidget {
  final String? exerciseId;

  const ExerciseFormScreen({
    super.key,
    this.exerciseId,
  });

  @override
  ConsumerState<ExerciseFormScreen> createState() => _ExerciseFormScreenState();
}

class _ExerciseFormScreenState extends ConsumerState<ExerciseFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _timeLimitController = TextEditingController();

  String _selectedDifficulty = 'EASY';
  String _selectedCategory = 'GENERAL';
  File? _selectedImage;
  File? _selectedAudio;
  bool _isLoading = false;
  Exercise? _existingExercise;

  @override
  void initState() {
    super.initState();
    _timeLimitController.text = '30';

    if (widget.exerciseId != null) {
      _loadExercise();
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _timeLimitController.dispose();
    super.dispose();
  }

  Future<void> _loadExercise() async {
    setState(() => _isLoading = true);

    try {
      final exerciseAsync =
          ref.read(exerciseDetailProvider(widget.exerciseId!));
      exerciseAsync.when(
        data: (exercise) {
          _existingExercise = exercise;
          if (_existingExercise != null) {
            _titleController.text = _existingExercise!.title;
            _descriptionController.text = _existingExercise!.description;
            _timeLimitController.text = _existingExercise!.timeLimit.toString();
            _selectedDifficulty = _existingExercise!.difficulty;
            _selectedCategory = _existingExercise!.type;
          }
        },
        loading: () => {},
        error: (error, stack) => throw error,
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load exercise: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _pickImage() async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to pick image: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _pickAudio() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.audio,
        allowMultiple: false,
      );

      if (result != null && result.files.first.path != null) {
        File audioFile = File(result.files.first.path!);

        // Check file size (max 10MB)
        int fileSize = await audioFile.length();
        if (fileSize > 10 * 1024 * 1024) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Audio file must be less than 10MB'),
                backgroundColor: Colors.red,
              ),
            );
          }
          return;
        }

        setState(() {
          _selectedAudio = audioFile;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to pick audio: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final title = _titleController.text.trim();
      final description = _descriptionController.text.trim();
      final timeLimit = int.parse(_timeLimitController.text);

      Exercise? result;

      if (widget.exerciseId != null) {
        // Update existing exercise
        result = await ref.read(exerciseListProvider.notifier).updateExercise(
              id: widget.exerciseId!,
              title: title,
              description: description,
              question: description, // Use description as question for now
              type: _selectedCategory,
              difficulty: _selectedDifficulty,
              level: 'Beginner', // Default level
              options: [], // Default empty options
              correctAnswer: '', // Default empty correct answer
              points: 10, // Default points
              timeLimit: timeLimit,
              imageFile: _selectedImage,
              audioFile: _selectedAudio,
            );
      } else {
        // Create new exercise
        result = await ref.read(exerciseListProvider.notifier).createExercise(
              title: title,
              description: description,
              question: description, // Use description as question for now
              type: _selectedCategory,
              difficulty: _selectedDifficulty,
              level: 'Beginner', // Default level
              options: [], // Default empty options
              correctAnswer: '', // Default empty correct answer
              points: 10, // Default points
              timeLimit: timeLimit,
              imageFile: _selectedImage,
              audioFile: _selectedAudio,
            );
      }

      if (result != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(widget.exerciseId != null
                ? 'Exercise updated successfully'
                : 'Exercise created successfully'),
            backgroundColor: Colors.green,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save exercise: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
            widget.exerciseId != null ? 'Edit Exercise' : 'Create Exercise'),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
        actions: [
          if (!_isLoading)
            TextButton(
              onPressed: _submitForm,
              child: const Text(
                'Save',
                style: TextStyle(color: Colors.white),
              ),
            ),
        ],
      ),
      body: _isLoading && _existingExercise == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Title field
                    TextFormField(
                      controller: _titleController,
                      decoration: const InputDecoration(
                        labelText: 'Title *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.title),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter a title';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Description field
                    TextFormField(
                      controller: _descriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Description *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.description),
                      ),
                      maxLines: 3,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter a description';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Difficulty and Category row
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedDifficulty,
                            decoration: const InputDecoration(
                              labelText: 'Difficulty',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.bar_chart),
                            ),
                            items: const [
                              DropdownMenuItem(
                                  value: 'EASY', child: Text('Easy')),
                              DropdownMenuItem(
                                  value: 'MEDIUM', child: Text('Medium')),
                              DropdownMenuItem(
                                  value: 'HARD', child: Text('Hard')),
                            ],
                            onChanged: (value) {
                              if (value != null) {
                                setState(() {
                                  _selectedDifficulty = value;
                                });
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedCategory,
                            decoration: const InputDecoration(
                              labelText: 'Category',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.category),
                            ),
                            items: const [
                              DropdownMenuItem(
                                  value: 'GENERAL', child: Text('General')),
                              DropdownMenuItem(
                                  value: 'LISTENING', child: Text('Listening')),
                              DropdownMenuItem(
                                  value: 'READING', child: Text('Reading')),
                              DropdownMenuItem(
                                  value: 'VOCABULARY',
                                  child: Text('Vocabulary')),
                              DropdownMenuItem(
                                  value: 'GRAMMAR', child: Text('Grammar')),
                            ],
                            onChanged: (value) {
                              if (value != null) {
                                setState(() {
                                  _selectedCategory = value;
                                });
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Time Limit field
                    TextFormField(
                      controller: _timeLimitController,
                      decoration: const InputDecoration(
                        labelText: 'Time Limit (minutes) *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.timer),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter time limit';
                        }
                        final timeLimit = int.tryParse(value);
                        if (timeLimit == null || timeLimit <= 0) {
                          return 'Please enter a valid time limit';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),

                    // Image section
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.image),
                                const SizedBox(width: 8),
                                const Text(
                                  'Image',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const Spacer(),
                                TextButton.icon(
                                  onPressed: _pickImage,
                                  icon: const Icon(Icons.add_photo_alternate),
                                  label: const Text('Pick Image'),
                                ),
                              ],
                            ),
                            if (_selectedImage != null) ...[
                              const SizedBox(height: 12),
                              Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: kIsWeb
                                        ? Image.network(
                                            _selectedImage!.path,
                                            height: 150,
                                            width: double.infinity,
                                            fit: BoxFit.cover,
                                            errorBuilder:
                                                (context, error, stackTrace) {
                                              return Container(
                                                height: 150,
                                                width: double.infinity,
                                                color: Colors.grey[300],
                                                child: const Icon(Icons.image,
                                                    size: 50),
                                              );
                                            },
                                          )
                                        : Image.file(
                                            _selectedImage!,
                                            height: 150,
                                            width: double.infinity,
                                            fit: BoxFit.cover,
                                          ),
                                  ),
                                  Positioned(
                                    top: 8,
                                    right: 8,
                                    child: CircleAvatar(
                                      backgroundColor: Colors.red,
                                      radius: 16,
                                      child: IconButton(
                                        onPressed: () {
                                          setState(() {
                                            _selectedImage = null;
                                          });
                                        },
                                        icon: const Icon(
                                          Icons.close,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ] else if (_existingExercise?.imageUrl != null) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.blue[50],
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.blue[200]!),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.image, color: Colors.blue),
                                    const SizedBox(width: 8),
                                    const Text('Current image will be kept'),
                                    const Spacer(),
                                    Text(
                                      'Replace?',
                                      style: TextStyle(
                                        color: Colors.blue[600],
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Audio section
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.audiotrack),
                                const SizedBox(width: 8),
                                const Text(
                                  'Audio',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const Spacer(),
                                TextButton.icon(
                                  onPressed: _pickAudio,
                                  icon: const Icon(Icons.audio_file),
                                  label: const Text('Pick Audio'),
                                ),
                              ],
                            ),
                            if (_selectedAudio != null) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.green[50],
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.green[200]!),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.audiotrack,
                                        color: Colors.green),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        _selectedAudio!.path.split('/').last,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.w500),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    IconButton(
                                      onPressed: () {
                                        setState(() {
                                          _selectedAudio = null;
                                        });
                                      },
                                      icon: const Icon(Icons.close,
                                          color: Colors.red),
                                    ),
                                  ],
                                ),
                              ),
                            ] else if (_existingExercise?.audioUrl != null) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.blue[50],
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.blue[200]!),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.audiotrack,
                                        color: Colors.blue),
                                    const SizedBox(width: 8),
                                    const Text('Current audio will be kept'),
                                    const Spacer(),
                                    Text(
                                      'Replace?',
                                      style: TextStyle(
                                        color: Colors.blue[600],
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Submit button
                    ElevatedButton(
                      onPressed: _isLoading ? null : _submitForm,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[600],
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Text(
                              widget.exerciseId != null
                                  ? 'Update Exercise'
                                  : 'Create Exercise',
                              style: const TextStyle(fontSize: 16),
                            ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
