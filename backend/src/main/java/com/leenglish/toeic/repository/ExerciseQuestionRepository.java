// package com.leenglish.toeic.repository;

// import com.leenglish.toeic.domain.Question;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface ExerciseQuestionRepository extends JpaRepository<Question, Long> {

//     // Find questions by exercise
//     List<Question> findByExerciseId(Long exerciseId);

//     List<Question> findByExerciseIdOrderById(Long exerciseId);

//     // Find questions by type
//     List<Question> findByType(String type);

//     // Search questions by keyword
//     @Query("SELECT eq FROM Question eq WHERE eq.questionText LIKE %:keyword%")
//     List<Question> searchByKeyword(@Param("keyword") String keyword);

//     // Find questions with audio
//     @Query("SELECT eq FROM Question eq WHERE eq.audioUrl IS NOT NULL AND eq.audioUrl != ''")
//     List<Question> findQuestionsWithAudio();

//     // Find questions with images
//     @Query("SELECT eq FROM Question eq WHERE eq.imageUrl IS NOT NULL AND eq.imageUrl != ''")
//     List<Question> findQuestionsWithImages();

//     // Count questions by exercise
//     @Query("SELECT COUNT(eq) FROM Question eq WHERE eq.exerciseId = :exerciseId")
//     Long countByExerciseId(@Param("exerciseId") Long exerciseId);

//     // Count questions by type
//     @Query("SELECT COUNT(eq) FROM Question eq WHERE eq.type = :type")
//     Long countByType(@Param("type") String type);

//     // Find questions by exercise and type
//     @Query("SELECT eq FROM Question eq WHERE eq.exerciseId = :exerciseId AND eq.type = :type")
//     List<Question> findByExerciseIdAndType(@Param("exerciseId") Long exerciseId, @Param("type") String type);

//     // Delete questions by exercise
//     void deleteByExerciseId(Long exerciseId);

//     // Find questions by exercise ordered by order index
//     List<Question> findByExerciseIdOrderByOrderIndexAsc(Long exerciseId);
// }
