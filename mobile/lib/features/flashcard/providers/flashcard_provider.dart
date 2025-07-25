import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/flashcard_model.dart';
import 'package:toeic_mobile/core/services/flashcard_api_service.dart';

/// Provider cho FlashcardApiService
final flashcardApiServiceProvider = Provider<FlashcardApiService>((ref) {
  return FlashcardApiService();
});

/// State cho flashcard sets list
class FlashcardSetsState {
  final List<FlashcardSet> sets;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final int totalPages;
  final bool hasNextPage;

  FlashcardSetsState({
    this.sets = const [],
    this.isLoading = false,
    this.error,
    this.currentPage = 0,
    this.totalPages = 0,
    this.hasNextPage = false,
  });

  FlashcardSetsState copyWith({
    List<FlashcardSet>? sets,
    bool? isLoading,
    String? error,
    int? currentPage,
    int? totalPages,
    bool? hasNextPage,
  }) {
    return FlashcardSetsState(
      sets: sets ?? this.sets,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasNextPage: hasNextPage ?? this.hasNextPage,
    );
  }
}

/// Notifier cho flashcard sets list
class FlashcardSetsNotifier extends StateNotifier<FlashcardSetsState> {
  final FlashcardApiService _apiService;

  FlashcardSetsNotifier(this._apiService) : super(FlashcardSetsState());

  /// Load flashcard sets với pagination
  Future<void> loadSets({
    int page = 0,
    String? search,
    String? difficulty,
    String? category,
    bool refresh = false,
  }) async {
    if (refresh || page == 0) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final response = await _apiService.getFlashcardSets(
        page: page,
        search: search,
        difficulty: difficulty,
        category: category,
      );

      if (response.success && response.sets != null) {
        final sets = refresh || page == 0
            ? response.sets!
            : [...state.sets, ...response.sets!];

        state = state.copyWith(
          sets: sets,
          isLoading: false,
          currentPage: response.currentPage ?? page,
          totalPages: response.totalPages ?? 0,
          hasNextPage:
              (response.currentPage ?? page) < (response.totalPages ?? 0) - 1,
          error: null,
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.message ?? 'Failed to load flashcard sets',
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Refresh sets
  Future<void> refresh({
    String? search,
    String? difficulty,
    String? category,
  }) async {
    await loadSets(
      page: 0,
      search: search,
      difficulty: difficulty,
      category: category,
      refresh: true,
    );
  }

  /// Load more sets
  Future<void> loadMore({
    String? search,
    String? difficulty,
    String? category,
  }) async {
    if (state.hasNextPage && !state.isLoading) {
      await loadSets(
        page: state.currentPage + 1,
        search: search,
        difficulty: difficulty,
        category: category,
      );
    }
  }

  /// Tạo flashcard set mới
  Future<FlashcardSet?> createSet({
    required String title,
    required String description,
    required String category,
    required String difficulty,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final response = await _apiService.createFlashcardSet(
        title: title,
        description: description,
        category: category,
        difficulty: difficulty,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      if (response.success && response.data != null) {
        // Add to current list
        state = state.copyWith(
          sets: [response.data!, ...state.sets],
        );
        return response.data;
      } else {
        throw response.message ?? 'Failed to create flashcard set';
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Cập nhật flashcard set
  Future<FlashcardSet?> updateSet({
    required String id,
    required String title,
    required String description,
    required String category,
    required String difficulty,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final response = await _apiService.updateFlashcardSet(
        id: id,
        title: title,
        description: description,
        category: category,
        difficulty: difficulty,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      if (response.success && response.data != null) {
        // Update in current list
        final updatedSets = state.sets.map((set) {
          return set.id == id ? response.data! : set;
        }).toList();

        state = state.copyWith(sets: updatedSets);
        return response.data;
      } else {
        throw response.message ?? 'Failed to update flashcard set';
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Xóa flashcard set
  Future<bool> deleteSet(String id) async {
    try {
      final response = await _apiService.deleteFlashcardSet(id);

      if (response.success) {
        // Remove from current list
        final updatedSets = state.sets.where((set) {
          return set.id != id;
        }).toList();

        state = state.copyWith(sets: updatedSets);
        return true;
      } else {
        throw response.message ?? 'Failed to delete flashcard set';
      }
    } catch (e) {
      rethrow;
    }
  }
}

/// State cho flashcards in set
class FlashcardsState {
  final List<Flashcard> flashcards;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final int totalPages;
  final bool hasNextPage;

  FlashcardsState({
    this.flashcards = const [],
    this.isLoading = false,
    this.error,
    this.currentPage = 0,
    this.totalPages = 0,
    this.hasNextPage = false,
  });

  FlashcardsState copyWith({
    List<Flashcard>? flashcards,
    bool? isLoading,
    String? error,
    int? currentPage,
    int? totalPages,
    bool? hasNextPage,
  }) {
    return FlashcardsState(
      flashcards: flashcards ?? this.flashcards,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasNextPage: hasNextPage ?? this.hasNextPage,
    );
  }
}

/// Notifier cho flashcards in set
class FlashcardsNotifier extends StateNotifier<FlashcardsState> {
  final FlashcardApiService _apiService;
  final String setId;

  FlashcardsNotifier(this._apiService, this.setId) : super(FlashcardsState());

  /// Load flashcards trong set
  Future<void> loadFlashcards({
    int page = 0,
    bool refresh = false,
  }) async {
    if (refresh || page == 0) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final response = await _apiService.getFlashcardsInSet(
        setId: setId,
        page: page,
      );

      if (response.success && response.flashcards != null) {
        final flashcards = refresh || page == 0
            ? response.flashcards!
            : [...state.flashcards, ...response.flashcards!];

        state = state.copyWith(
          flashcards: flashcards,
          isLoading: false,
          currentPage: response.currentPage ?? page,
          totalPages: response.totalPages ?? 0,
          hasNextPage:
              (response.currentPage ?? page) < (response.totalPages ?? 0) - 1,
          error: null,
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.message ?? 'Failed to load flashcards',
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Tạo flashcard mới
  Future<Flashcard?> createFlashcard({
    required String front,
    required String back,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final response = await _apiService.createFlashcard(
        setId: setId,
        front: front,
        back: back,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      if (response.success && response.flashcard != null) {
        // Add to current list
        state = state.copyWith(
          flashcards: [response.flashcard!, ...state.flashcards],
        );
        return response.flashcard;
      } else {
        throw response.message ?? 'Failed to create flashcard';
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Cập nhật flashcard
  Future<Flashcard?> updateFlashcard({
    required String id,
    required String front,
    required String back,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final response = await _apiService.updateFlashcard(
        id: id,
        front: front,
        back: back,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      if (response.success && response.flashcard != null) {
        // Update in current list
        final updatedFlashcards = state.flashcards.map((flashcard) {
          return flashcard.id == id ? response.flashcard! : flashcard;
        }).toList();

        state = state.copyWith(flashcards: updatedFlashcards);
        return response.flashcard;
      } else {
        throw response.message ?? 'Failed to update flashcard';
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Xóa flashcard
  Future<bool> deleteFlashcard(String id) async {
    try {
      final response = await _apiService.deleteFlashcard(id);

      if (response.success) {
        // Remove from current list
        final updatedFlashcards = state.flashcards.where((flashcard) {
          return flashcard.id != id;
        }).toList();

        state = state.copyWith(flashcards: updatedFlashcards);
        return true;
      } else {
        throw response.message ?? 'Failed to delete flashcard';
      }
    } catch (e) {
      rethrow;
    }
  }
}

/// Provider cho flashcard sets list
final flashcardSetsProvider =
    StateNotifierProvider<FlashcardSetsNotifier, FlashcardSetsState>((ref) {
  final apiService = ref.watch(flashcardApiServiceProvider);
  return FlashcardSetsNotifier(apiService);
});

/// Provider cho flashcards in set
final flashcardsProvider =
    StateNotifierProvider.family<FlashcardsNotifier, FlashcardsState, String>(
        (ref, setId) {
  final apiService = ref.watch(flashcardApiServiceProvider);
  return FlashcardsNotifier(apiService, setId);
});

/// Provider cho single flashcard set detail
final flashcardSetDetailProvider =
    FutureProvider.family<FlashcardSet?, String>((ref, id) async {
  final apiService = ref.watch(flashcardApiServiceProvider);
  try {
    final response = await apiService.getFlashcardSetById(id);
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  } catch (e) {
    throw e.toString();
  }
});
