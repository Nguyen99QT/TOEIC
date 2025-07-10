// package com.leenglish.toeic.util;

// import java.util.Arrays;
// import java.util.List;
// import java.util.stream.Collectors;

// import com.leenglish.toeic.domain.Question;

// public class QuestionChecker {
//     /**
//      * Checks if the user's answer is correct for the given question.
//      * Supports single choice, multiple choice, and text-based questions.
//      * Extend this method for more complex logic (partial credit, synonyms, etc.).
//      */
//     public static boolean isCorrect(Question question, String userAnswer) {
//         if (question == null || userAnswer == null)
//             return false;
//         String correctAnswer = question.getCorrectAnswer();
//         if (correctAnswer == null)
//             return false;

//         // Example: handle multiple correct answers (comma-separated)
//         if (question.getType() != null && question.getType().equalsIgnoreCase("multiple")) {
//             List<String> correctList = Arrays.stream(correctAnswer.split(","))
//                     .map(String::trim).collect(Collectors.toList());
//             List<String> userList = Arrays.stream(userAnswer.split(","))
//                     .map(String::trim).collect(Collectors.toList());
//             return correctList.size() == userList.size() && correctList.containsAll(userList);
//         }

//         // Default: case-insensitive string match
//         return correctAnswer.trim().equalsIgnoreCase(userAnswer.trim());
//     }
// }
