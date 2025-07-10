package com.leenglish.toeic.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.domain.Question;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.domain.UserActivity;
import com.leenglish.toeic.dto.QuestionAnswerRequest;
import com.leenglish.toeic.dto.QuestionDto;
import com.leenglish.toeic.enums.ActivityType;
import com.leenglish.toeic.repository.ExerciseRepository;
import com.leenglish.toeic.repository.QuestionRepository;
import com.leenglish.toeic.repository.UserActivityRepository;
import com.leenglish.toeic.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuestionService {

        @Autowired
        private QuestionRepository questionRepository;
        private final ExerciseRepository exerciseRepository;
        private final UserRepository userRepository;
        private final UserActivityRepository userActivityRepository;

        // ================================================================
        // CHỈ 3 METHODS CỐT LÕI NHẤT
        // ================================================================

        /**
         * 1. Lấy questions của exercise (QUAN TRỌNG NHẤT)
         */
        @Transactional(readOnly = true)
        public List<QuestionDto> getQuestionsByExercise(Long exerciseId) {
                List<Question> questions = questionRepository
                                .findByExerciseIdAndIsActiveTrueOrderByQuestionOrder(exerciseId);
                return questions.stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        /**
         * 2. Submit answers và chấm điểm (QUAN TRỌNG NHẤT)
         */
        public Map<String, Object> submitExerciseAnswers(Long exerciseId,
                        List<QuestionAnswerRequest> answers,
                        String username) {
                // 1. Lấy user và exercise
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Exercise exercise = exerciseRepository.findById(exerciseId)
                                .orElseThrow(() -> new RuntimeException("Exercise not found"));

                // 2. Lấy tất cả questions của exercise
                List<Question> questions = questionRepository
                                .findByExerciseIdAndIsActiveTrueOrderByQuestionOrder(exerciseId);

                int totalQuestions = questions.size();
                int correctAnswers = 0;

                // ================================================================
                // KIỂM TRA CÂU CHƯA TRẢ LỜI - NHẮC USER
                // ================================================================
                List<Long> submittedQuestionIds = answers.stream()
                                .map(QuestionAnswerRequest::getQuestionId)
                                .collect(Collectors.toList());

                List<Long> allQuestionIds = questions.stream()
                                .map(Question::getId)
                                .collect(Collectors.toList());

                List<Long> unansweredQuestionIds = allQuestionIds.stream()
                                .filter(id -> !submittedQuestionIds.contains(id))
                                .collect(Collectors.toList());

                // Nếu có câu chưa trả lời
                if (!unansweredQuestionIds.isEmpty()) {
                        List<String> unansweredQuestions = questions.stream()
                                        .filter(q -> unansweredQuestionIds.contains(q.getId()))
                                        .map(q -> "Question " + q.getQuestionOrder() + ": " +
                                                        (q.getQuestionText().length() > 50
                                                                        ? q.getQuestionText().substring(0, 50) + "..."
                                                                        : q.getQuestionText()))
                                        .collect(Collectors.toList());

                        return Map.of(
                                        "success", false,
                                        "message", "You have unanswered questions!",
                                        "unansweredCount", unansweredQuestionIds.size(),
                                        "totalQuestions", totalQuestions,
                                        "unansweredQuestions", unansweredQuestions,
                                        "warning",
                                        String.format("Please answer %d remaining question(s) before submitting",
                                                        unansweredQuestionIds.size()));
                }

                // 3. CHẤM ĐIỂM - So sánh đáp án
                for (QuestionAnswerRequest answer : answers) {
                        Question question = questions.stream()
                                        .filter(q -> q.getId().equals(answer.getQuestionId()))
                                        .findFirst()
                                        .orElse(null);

                        // So sánh đáp án user với đáp án đúng
                        if (question != null
                                        && question.getCorrectAnswer().equalsIgnoreCase(answer.getSelectedAnswer())) {
                                correctAnswers++;
                        }
                }

                // 4. Tính điểm phần trăm
                double scorePercentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0;

                // 5. LƯU VÀO DATABASE cho Dashboard
                logExerciseCompletion(user, exercise, correctAnswers, totalQuestions, scorePercentage);

                // 6. Trả kết quả về cho Frontend
                return Map.of(
                                "success", true,
                                "exerciseId", exerciseId,
                                "totalQuestions", totalQuestions,
                                "correctAnswers", correctAnswers,
                                "scorePercentage", scorePercentage,
                                "message", String.format("Completed successfully! Score: %d/%d (%.1f%%)",
                                                correctAnswers, totalQuestions, scorePercentage));
        }

        /**
         * 3. Free questions cho guests
         */
        @Transactional(readOnly = true)
        public List<QuestionDto> getFreeQuestions(Integer limit) {
                List<Question> questions = questionRepository.findByExercise_IsFreeTrue();
                return questions.stream()
                                .limit(limit != null ? limit : 5)
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        // ================================================================
        // HELPER METHODS - TỐI THIỂU
        // ================================================================

        private void logExerciseCompletion(User user, Exercise exercise, int correctAnswers,
                        int totalQuestions, double scorePercentage) {
                UserActivity activity = UserActivity.builder()
                                .user(user)
                                .type(ActivityType.EXERCISE_COMPLETED)
                                .title("Completed: " + exercise.getTitle())
                                .description(String.format("Score: %d/%d (%.1f%%)", correctAnswers, totalQuestions,
                                                scorePercentage))
                                .score((int) scorePercentage)
                                .pointsEarned(correctAnswers * 5)
                                .exerciseId(exercise.getId())
                                .isActive(true)
                                .build();

                userActivityRepository.save(activity);
        }

        private QuestionDto convertToDto(Question question) {
                return QuestionDto.builder()
                                .id(question.getId())
                                .exerciseId(question.getExercise().getId())
                                .questionText(question.getQuestionText())
                                .optionA(question.getOptionA())
                                .optionB(question.getOptionB())
                                .optionC(question.getOptionC())
                                .optionD(question.getOptionD())
                                .explanation(question.getExplanation())
                                .points(question.getPoints())
                                .questionOrder(question.getQuestionOrder())
                                .build();
        }

        public QuestionDto getQuestionById(Long questionId) {
                Question question = questionRepository.findById(questionId)
                                .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));
                return convertToDto(question);
        }
}
