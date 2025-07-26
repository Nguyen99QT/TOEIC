import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:toeic_mobile/core/models/lesson_model.dart';
import 'package:toeic_mobile/features/lessons/providers/lesson_provider.dart';

class LessonFormScreen extends ConsumerStatefulWidget {
  final String? lessonId;

  const LessonFormScreen({
    super.key,
    this.lessonId,
  });

  @override
  ConsumerState<LessonFormScreen> createState() => _LessonFormScreenState();
}

class _LessonFormScreenState extends ConsumerState<LessonFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _contentController = TextEditingController();
  final _estimatedTimeController = TextEditingController();
  final _imageUrlController = TextEditingController();
  final _audioUrlController = TextEditingController();

  String _selectedDifficulty = 'EASY';
  String _selectedCategory = 'GENERAL';
  bool _isPublic = true;
  File? _selectedImage;
  File? _selectedAudio;
  bool _isLoading = false;
  Lesson? _existingLesson;

  @override
  void initState() {
    super.initState();
    _estimatedTimeController.text = '30';

    if (widget.lessonId != null) {
      _loadLesson();
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _contentController.dispose();
    _estimatedTimeController.dispose();
    _imageUrlController.dispose();
    _audioUrlController.dispose();
    super.dispose();
  }

  Future<void> _loadLesson() async {
    setState(() => _isLoading = true);

    try {
      final lessonAsync = ref.read(lessonDetailProvider(widget.lessonId!));
      lessonAsync.when(
        data: (lesson) {
          _existingLesson = lesson;
          if (_existingLesson != null) {
            _titleController.text = _existingLesson!.title;
            _descriptionController.text = _existingLesson!.description;
            _contentController.text = _existingLesson!.content;
            _estimatedTimeController.text =
                _existingLesson!.estimatedTime.toString();
            _selectedDifficulty = _existingLesson!.difficulty;
            _selectedCategory = _existingLesson!.category;
            _isPublic = _existingLesson!.isPublic;
          }
        },
        loading: () => {},
        error: (error, stack) => throw error,
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load lesson: $e'),
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
      if (kIsWeb) {
        // On web, show URL input dialog
        String? imageUrl = await _showUrlInputDialog(
          context: context,
          title: 'Add Image URL',
          hintText: 'Enter image URL (e.g., https://example.com/image.jpg)',
        );

        if (imageUrl != null && imageUrl.isNotEmpty) {
          _imageUrlController.text = imageUrl;
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Image URL added successfully'),
                backgroundColor: Colors.green,
              ),
            );
          }
        }
        return;
      }

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
      if (kIsWeb) {
        // On web, show URL input dialog
        String? audioUrl = await _showUrlInputDialog(
          context: context,
          title: 'Add Audio URL',
          hintText: 'Enter audio URL (e.g., https://example.com/audio.mp3)',
        );

        if (audioUrl != null && audioUrl.isNotEmpty) {
          _audioUrlController.text = audioUrl;
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Audio URL added successfully'),
                backgroundColor: Colors.green,
              ),
            );
          }
        }
        return;
      }

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

  Future<String?> _showUrlInputDialog({
    required BuildContext context,
    required String title,
    required String hintText,
  }) async {
    final TextEditingController urlController = TextEditingController();

    return showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: TextField(
            controller: urlController,
            decoration: InputDecoration(
              hintText: hintText,
              border: const OutlineInputBorder(),
            ),
            keyboardType: TextInputType.url,
            autofocus: true,
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(null),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                final url = urlController.text.trim();
                if (url.isNotEmpty) {
                  Navigator.of(context).pop(url);
                } else {
                  Navigator.of(context).pop(null);
                }
              },
              child: const Text('Add'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final title = _titleController.text.trim();
      final description = _descriptionController.text.trim();
      final content = _contentController.text.trim();
      final estimatedTime = int.parse(_estimatedTimeController.text);

      // Get URL values for web platform
      final imageUrl = _imageUrlController.text.trim();
      final audioUrl = _audioUrlController.text.trim();

      Lesson? result;

      if (widget.lessonId != null) {
        // Update existing lesson
        result = await ref.read(lessonsProvider.notifier).updateLesson(
              id: widget.lessonId!,
              title: title,
              description: description,
              content: content,
              difficulty: _selectedDifficulty,
              category: _selectedCategory,
              estimatedTime: estimatedTime,
              imageFile: _selectedImage,
              audioFile: _selectedAudio,
              imageUrl: imageUrl.isNotEmpty ? imageUrl : null,
              audioUrl: audioUrl.isNotEmpty ? audioUrl : null,
              isPublic: _isPublic,
            );
      } else {
        // Create new lesson
        result = await ref.read(lessonsProvider.notifier).createLesson(
              title: title,
              description: description,
              content: content,
              difficulty: _selectedDifficulty,
              category: _selectedCategory,
              estimatedTime: estimatedTime,
              imageFile: _selectedImage,
              audioFile: _selectedAudio,
              imageUrl: imageUrl.isNotEmpty ? imageUrl : null,
              audioUrl: audioUrl.isNotEmpty ? audioUrl : null,
              isPublic: _isPublic,
            );
      }

      if (result != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(widget.lessonId != null
                ? 'Lesson updated successfully'
                : 'Lesson created successfully'),
            backgroundColor: Colors.green,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save lesson: $e'),
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
        title: Text(widget.lessonId != null ? 'Edit Lesson' : 'Create Lesson'),
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
      body: _isLoading && _existingLesson == null
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

                    // Content field
                    TextFormField(
                      controller: _contentController,
                      decoration: const InputDecoration(
                        labelText: 'Content *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.article),
                        hintText: 'Enter the lesson content...',
                      ),
                      maxLines: 6,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter lesson content';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Difficulty, Category, and Time row
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

                    // Estimated Time field
                    TextFormField(
                      controller: _estimatedTimeController,
                      decoration: const InputDecoration(
                        labelText: 'Estimated Time (minutes) *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.timer),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter estimated time';
                        }
                        final time = int.tryParse(value);
                        if (time == null || time <= 0) {
                          return 'Please enter a valid time';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Public/Private toggle
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            const Icon(Icons.visibility),
                            const SizedBox(width: 16),
                            const Expanded(
                              child: Text(
                                'Make lesson public',
                                style: TextStyle(fontSize: 16),
                              ),
                            ),
                            Switch(
                              value: _isPublic,
                              onChanged: (value) {
                                setState(() {
                                  _isPublic = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
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
                                  label:
                                      Text(kIsWeb ? 'Add URL' : 'Pick Image'),
                                ),
                              ],
                            ),
                            if (kIsWeb) ...[
                              const SizedBox(height: 12),
                              TextFormField(
                                controller: _imageUrlController,
                                decoration: const InputDecoration(
                                  labelText: 'Image URL',
                                  hintText: 'https://example.com/image.jpg',
                                  border: OutlineInputBorder(),
                                  prefixIcon: Icon(Icons.link),
                                ),
                                keyboardType: TextInputType.url,
                              ),
                            ],
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
                            ] else if (_existingLesson?.imageUrl != null) ...[
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
                                  label:
                                      Text(kIsWeb ? 'Add URL' : 'Pick Audio'),
                                ),
                              ],
                            ),
                            if (kIsWeb) ...[
                              const SizedBox(height: 12),
                              TextFormField(
                                controller: _audioUrlController,
                                decoration: const InputDecoration(
                                  labelText: 'Audio URL',
                                  hintText: 'https://example.com/audio.mp3',
                                  border: OutlineInputBorder(),
                                  prefixIcon: Icon(Icons.link),
                                ),
                                keyboardType: TextInputType.url,
                              ),
                            ],
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
                            ] else if (_existingLesson?.audioUrl != null) ...[
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
                              widget.lessonId != null
                                  ? 'Update Lesson'
                                  : 'Create Lesson',
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
