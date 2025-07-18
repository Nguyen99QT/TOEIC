import { Exercise } from "../types/Exercise";

export const getMockExercisesForLesson = (lessonId: string): Exercise[] => {
  if (lessonId === "1") {
    return [
      {
        id: 1,
        title: "Exercise 1",
        description: "Choose the correct greeting.",
        type: "multiple_choice",
        difficulty_level: "easy",
        time_limit_seconds: 60,
        points: 10,
        order_index: 1,
        question: "Which is a common English greeting?",
        options: ["A. Hello", "B. Goodbye", "C. Thanks", "D. Please"],
        is_active: true,
      },
      {
        id: 2,
        title: "Exercise 2",
        description: "Match the greeting with the language.",
        type: "matching",
        difficulty_level: "medium",
        time_limit_seconds: 120,
        points: 10,
        order_index: 2,
        question: "Match the greetings with their languages",
        options: [
          "Hello - English",
          "Bonjour - French",
          "Hola - Spanish",
          "Guten Tag - German",
        ],
        is_active: true,
      },
      {
        id: 3,
        title: "Exercise 3",
        description: "Fill in the blank with the correct greeting.",
        type: "fill_in_the_blank",
        difficulty_level: "easy",
        time_limit_seconds: 30,
        points: 10,
        order_index: 3,
        question: "_____ morning! How are you today?",
        options: ["Good", "Bad", "Nice", "Fine"],
        is_active: true,
      },
    ];
  }

  // Generic exercises for other lessons
  return [
    {
      id: parseInt(lessonId || "1") * 10 + 1,
      title: `Lesson ${lessonId} - Exercise 1`,
      description: "Vocabulary practice for this lesson",
      type: "multiple_choice",
      difficulty_level: "easy",
      time_limit_seconds: 300,
      points: 10,
      order_index: 1,
      question: `Choose the correct answer for lesson ${lessonId}`,
      options: ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      is_active: true,
    },
    {
      id: parseInt(lessonId || "1") * 10 + 2,
      title: `Lesson ${lessonId} - Exercise 2`,
      description: "Grammar practice for this lesson",
      type: "multiple_choice",
      difficulty_level: "medium",
      time_limit_seconds: 480,
      points: 15,
      order_index: 2,
      question: `Choose the correct grammar for lesson ${lessonId}`,
      options: ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      is_active: true,
    },
  ];
};
