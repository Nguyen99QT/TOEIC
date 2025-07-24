// package com.leenglish.toeic.controller;

// import com.leenglish.toeic.domain.FlashcardSet;
// import com.leenglish.toeic.domain.Flashcard;
// import com.leenglish.toeic.domain.User;
// import com.leenglish.toeic.domain.Lesson;
// import com.leenglish.toeic.enums.Role;
// import com.leenglish.toeic.repository.FlashcardSetRepository;
// import com.leenglish.toeic.repository.FlashcardRepository;
// import com.leenglish.toeic.repository.UserRepository;
// import com.leenglish.toeic.repository.LessonRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDateTime;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api/debug")
// @CrossOrigin(origins = "*")
// public class DebugController {

//     @Autowired
//     private FlashcardSetRepository flashcardSetRepository;

//     @Autowired
//     private FlashcardRepository flashcardRepository;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private LessonRepository lessonRepository;

//     /**
//      * Create sample flashcard sets for testing
//      */
//     @PostMapping("/create-sample-flashcards")
//     public ResponseEntity<Map<String, Object>> createSampleFlashcards() {
//         try {
//             // Check if sample sets already exist
//             long existingSets = flashcardSetRepository.count();
//             if (existingSets >= 5) {
//                 return ResponseEntity.ok(Map.of(
//                         "success", true,
//                         "message", "Sample flashcard sets already exist",
//                         "count", existingSets));
//             }

//             // Get system user or create one
//             User systemUser = userRepository.findByEmail("system@toeic.com").orElse(null);
//             if (systemUser == null) {
//                 systemUser = new User();
//                 systemUser.setEmail("system@toeic.com");
//                 systemUser.setFullName("System User");
//                 systemUser.setUsername("system");
//                 systemUser.setRole(Role.ADMIN);
//                 systemUser.setIsActive(true);
//                 systemUser.setCreatedAt(LocalDateTime.now());
//                 systemUser.setUpdatedAt(LocalDateTime.now());
//                 systemUser = userRepository.save(systemUser);
//             }

//             // Create sample flashcard sets
//             for (int i = 1; i <= 5; i++) {
//                 FlashcardSet set = new FlashcardSet();
//                 set.setName("Sample Flashcard Set " + i);
//                 set.setDescription("A sample flashcard set for TOEIC preparation - Set " + i);
//                 set.setDifficultyLevel("BEGINNER");
//                 set.setCategory("vocabulary");
//                 set.setIsPublic(true);
//                 set.setCreatedBy(systemUser);
//                 set.setCreatedAt(LocalDateTime.now());
//                 set.setUpdatedAt(LocalDateTime.now());
//                 set.setIsActive(true);
//                 set.setViewCount(i * 10); // Different view counts for testing

//                 FlashcardSet savedSet = flashcardSetRepository.save(set);

//                 // Add some sample flashcards to each set
//                 for (int j = 1; j <= 5; j++) {
//                     Flashcard card = new Flashcard();
//                     card.setTerm("Word " + j + " Set " + i);
//                     card.setDefinition("Definition for word " + j + " in set " + i);
//                     card.setExample("Example sentence using word " + j + " in set " + i);
//                     card.setFlashcardSet(savedSet);
//                     card.setIsActive(true);
//                     card.setCreatedAt(LocalDateTime.now());
//                     card.setUpdatedAt(LocalDateTime.now());

//                     flashcardRepository.save(card);
//                 }
//             }

//             long totalSets = flashcardSetRepository.count();
//             long totalCards = flashcardRepository.count();

//             return ResponseEntity.ok(Map.of(
//                     "success", true,
//                     "message", "Sample flashcard sets created successfully",
//                     "totalSets", totalSets,
//                     "totalCards", totalCards));

//         } catch (Exception e) {
//             return ResponseEntity.status(500).body(Map.of(
//                     "success", false,
//                     "error", "Failed to create sample flashcards: " + e.getMessage()));
//         }
//     }

//     /**
//      * Debug endpoint to check flashcard data
//      */
//     @GetMapping("/flashcard-stats")
//     public ResponseEntity<Map<String, Object>> getFlashcardStats() {
//         try {
//             long totalSets = flashcardSetRepository.count();
//             long publicSets = flashcardSetRepository.findByIsPublicTrueAndIsActiveTrue().size();
//             long featuredSets = flashcardSetRepository.findFeaturedPublicSets(PageRequest.of(0, 10)).size();
//             long totalCards = flashcardRepository.count();
//             long totalLessons = lessonRepository.count();

//             Map<String, Object> stats = new HashMap<>();
//             stats.put("totalSets", totalSets);
//             stats.put("publicSets", publicSets);
//             stats.put("featuredSets", featuredSets);
//             stats.put("totalCards", totalCards);
//             stats.put("totalLessons", totalLessons);
//             stats.put("timestamp", LocalDateTime.now().toString());

//             return ResponseEntity.ok(stats);
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body(Map.of(
//                     "error", "Failed to get flashcard stats: " + e.getMessage()));
//         }
//     }

//     /**
//      * Create sample lessons for testing
//      */
//     @PostMapping("/create-sample-lessons")
//     public ResponseEntity<Map<String, Object>> createSampleLessons() {
//         try {
//             // Check if sample lessons already exist
//             long existingLessons = lessonRepository.count();
//             if (existingLessons >= 5) {
//                 return ResponseEntity.ok(Map.of(
//                         "success", true,
//                         "message", "Sample lessons already exist",
//                         "count", existingLessons));
//             }

//             // Get a test user (admin) for lesson creation
//             Optional<User> adminUser = userRepository.findByUsername("admin");
//             User creator = null;
//             if (adminUser.isPresent()) {
//                 creator = adminUser.get();
//             }

//             // Create sample lessons
//             Lesson[] sampleLessons = {
//                     createLesson("TOEIC Reading Strategies", 
//                             "Master effective reading techniques for TOEIC Part 7",
//                             "Learn how to quickly identify key information in passages, understand question types, and manage your time effectively during the reading section.",
//                             "INTERMEDIATE", "MEDIUM", 45),
                    
//                     createLesson("Business Vocabulary Essentials", 
//                             "Essential business terms for TOEIC success",
//                             "Comprehensive guide to business vocabulary commonly found in TOEIC tests. Includes terms related to meetings, finance, marketing, and workplace communication.",
//                             "BEGINNER", "EASY", 30),
                    
//                     createLesson("Listening Part 3 & 4 Mastery", 
//                             "Advanced strategies for TOEIC listening conversations and talks",
//                             "Develop skills to understand longer conversations and talks. Learn to predict questions, take effective notes, and handle various accents and speaking speeds.",
//                             "ADVANCED", "HARD", 60),
                    
//                     createLesson("Grammar for TOEIC", 
//                             "Essential grammar patterns and structures",
//                             "Cover the most important grammar points tested in TOEIC Part 5 and 6. Includes practice exercises and common mistake patterns to avoid.",
//                             "INTERMEDIATE", "MEDIUM", 40),
                    
//                     createLesson("Time Management Techniques", 
//                             "Optimize your TOEIC test-taking strategy",
//                             "Learn proven time management strategies for each section of the TOEIC test. Includes pacing techniques and priority-setting methods.",
//                             "ALL_LEVELS", "EASY", 25)
//             };

//             int createdCount = 0;
//             for (Lesson lesson : sampleLessons) {
//                 try {
//                     lesson.setCreatedAt(LocalDateTime.now());
//                     lesson.setUpdatedAt(LocalDateTime.now());
//                     lesson.setIsActive(true);
//                     lesson.setIsPublic(true);
//                     lessonRepository.save(lesson);
//                     createdCount++;
//                 } catch (Exception e) {
//                     System.err.println("Failed to create lesson: " + lesson.getTitle() + " - " + e.getMessage());
//                 }
//             }

//             return ResponseEntity.ok(Map.of(
//                     "success", true,
//                     "message", "Sample lessons created successfully",
//                     "created", createdCount,
//                     "total", lessonRepository.count()));

//         } catch (Exception e) {
//             return ResponseEntity.status(500).body(Map.of(
//                     "error", "Failed to create sample lessons: " + e.getMessage()));
//         }
//     }

//     /**
//      * Helper method to create a lesson with all required fields
//      */
//     private Lesson createLesson(String title, String description, String content, String level, String difficulty, Integer duration) {
//         Lesson lesson = new Lesson(title, description, content, level, false);
//         lesson.setDifficulty(difficulty);
//         lesson.setDuration(duration);
//         lesson.setType("GENERAL");
//         lesson.setIsActive(true);
//         lesson.setIsPublic(true);
//         lesson.setIsPremium(false);
//         lesson.setOrderIndex(0);
//         return lesson;
//     }
// }
