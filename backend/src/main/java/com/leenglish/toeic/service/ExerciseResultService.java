package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.domain.Question;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.domain.UserExerciseResult;
import com.leenglish.toeic.domain.UserFeedback;
import com.leenglish.toeic.domain.UserQuestionAnswer;
import com.leenglish.toeic.dto.ExerciseResultDto;
import com.leenglish.toeic.dto.ExerciseSubmissionDto;
import com.leenglish.toeic.dto.FeedbackDto;
import com.leenglish.toeic.dto.QuestionAnswerRequest;
import com.leenglish.toeic.repository.ExerciseRepository;
import com.leenglish.toeic.repository.LessonRepository;
import com.leenglish.toeic.repository.QuestionRepository;
import com.leenglish.toeic.repository.UserExerciseResultRepository;
import com.leenglish.toeic.repository.UserFeedbackRepository;
import com.leenglish.toeic.repository.UserQuestionAnswerRepository;
import com.leenglish.toeic.repository.UserRepository;

@Service
public class ExerciseResultService {

    @Autowired
    private UserExerciseResultRepository userExerciseResultRepository;

    @Autowired
    private UserQuestionAnswerRepository userQuestionAnswerRepository;

    @Autowired
    private UserFeedbackRepository userFeedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public ExerciseResultDto submitExerciseResult(Long userId, ExerciseSubmissionDto submissionDto) {
        // Fetch necessary entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exercise exercise = exerciseRepository.findById(submissionDto.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        Lesson lesson = lessonRepository.findById(submissionDto.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Get questions and correct answers
        List<Question> questions = questionRepository
                .findByExerciseIdAndIsActiveTrueOrderByQuestionOrder(exercise.getId());

        // Calculate score
        int totalQuestions = questions.size();
        int answersCorrect = 0;

        List<QuestionAnswerRequest> answers = submissionDto.getAnswers();

        // Create and save result
        UserExerciseResult result = new UserExerciseResult();
        result.setUser(user);
        result.setExercise(exercise);
        result.setLesson(lesson);
        result.setTotalQuestions(totalQuestions);
        result.setTimeTaken(submissionDto.getTimeTaken());
        result.setCompletedAt(LocalDateTime.now());

        // Process each answer and calculate score
        List<UserQuestionAnswer> userAnswers = new ArrayList<>();
        List<ExerciseResultDto.QuestionResultDto> questionResults = new ArrayList<>();

        for (QuestionAnswerRequest answerRequest : answers) {
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answerRequest.getQuestionId()));

            String correctAnswer = question.getCorrectAnswer();
            boolean isCorrect = correctAnswer.equals(answerRequest.getSelectedAnswer());

            if (isCorrect) {
                answersCorrect++;
            }

            UserQuestionAnswer userAnswer = new UserQuestionAnswer();
            userAnswer.setQuestion(question);
            userAnswer.setSelectedAnswer(answerRequest.getSelectedAnswer());
            userAnswer.setIsCorrect(isCorrect);
            userAnswers.add(userAnswer);

            questionResults.add(new ExerciseResultDto.QuestionResultDto(
                    question.getId(),
                    answerRequest.getSelectedAnswer(),
                    correctAnswer,
                    isCorrect));
        }

        // Calculate final score (as a percentage)
        int score = (int) Math.round((double) answersCorrect / totalQuestions * 100);

        result.setAnswersCorrect(answersCorrect);
        result.setScore(score);

        // Save result
        UserExerciseResult savedResult = userExerciseResultRepository.save(result);

        // Save question answers
        for (UserQuestionAnswer answer : userAnswers) {
            answer.setResult(savedResult);
            userQuestionAnswerRepository.save(answer);
        }

        // Return result DTO
        return new ExerciseResultDto(
                savedResult.getId(),
                savedResult.getScore(),
                savedResult.getAnswersCorrect(),
                savedResult.getTotalQuestions(),
                savedResult.getTimeTaken(),
                savedResult.getCompletedAt(),
                questionResults);
    }

    @Transactional
    public void submitFeedback(Long userId, FeedbackDto feedbackDto) {
        // Fetch necessary entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = lessonRepository.findById(feedbackDto.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Create feedback entity
        UserFeedback feedback = new UserFeedback();
        feedback.setUser(user);
        feedback.setLesson(lesson);
        feedback.setRating(feedbackDto.getRating());
        feedback.setComment(feedbackDto.getComment());
        feedback.setSubmittedAt(LocalDateTime.now());

        // Set exercise if provided
        if (feedbackDto.getExerciseId() != null) {
            Exercise exercise = exerciseRepository.findById(feedbackDto.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercise not found"));
            feedback.setExercise(exercise);
        }

        // Save feedback
        userFeedbackRepository.save(feedback);
    }

    public List<ExerciseResultDto> getUserExerciseResults(Long userId, Long exerciseId) {
        List<UserExerciseResult> results = userExerciseResultRepository.findByUserIdAndExerciseId(userId, exerciseId);

        return results.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ExerciseResultDto convertToDto(UserExerciseResult result) {
        // Get question answers for this result
        List<UserQuestionAnswer> answers = userQuestionAnswerRepository.findByResultId(result.getId());

        // Convert to question result DTOs
        List<ExerciseResultDto.QuestionResultDto> questionResults = answers.stream()
                .map(answer -> {
                    Question question = answer.getQuestion();
                    return new ExerciseResultDto.QuestionResultDto(
                            question.getId(),
                            answer.getSelectedAnswer(),
                            question.getCorrectAnswer(),
                            answer.getIsCorrect());
                })
                .collect(Collectors.toList());

        // Create result DTO
        return new ExerciseResultDto(
                result.getId(),
                result.getScore(),
                result.getAnswersCorrect(),
                result.getTotalQuestions(),
                result.getTimeTaken(),
                result.getCompletedAt(),
                questionResults);
    }
}
