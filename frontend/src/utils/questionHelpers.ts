import { Question, QuestionType } from '../types';

export const normalizeQuestion = (question: any): Question => {
  return {
    id: question.id,
    exerciseId: question.exerciseId || question.exercise_id,
    questionText: question.questionText || question.question_text || question.question,
    questionType: question.questionType || question.question_type || QuestionType.MULTIPLE_CHOICE,
    optionA: question.optionA || question.option_a,
    optionB: question.optionB || question.option_b,
    optionC: question.optionC || question.option_c,
    optionD: question.optionD || question.option_d,
    correctAnswer: question.correctAnswer || question.correct_answer,
    explanation: question.explanation,
    points: question.points || 10,
    questionOrder: question.questionOrder || question.question_order || question.orderIndex,
    isActive: question.isActive !== undefined ? question.isActive : true,
    createdAt: question.createdAt || question.created_at || new Date().toISOString(),
    updatedAt: question.updatedAt || question.updated_at || new Date().toISOString(),
    imageUrl: question.imageUrl || question.image_url,
    audioUrl: question.audioUrl || question.audio_url,
    difficulty: question.difficulty,
    
    // Computed fields
    options: [
      question.optionA || question.option_a,
      question.optionB || question.option_b, 
      question.optionC || question.option_c,
      question.optionD || question.option_d
    ].filter(Boolean),
    
    // Legacy compatibility
    question: question.questionText || question.question_text || question.question,
    orderIndex: question.questionOrder || question.question_order || question.orderIndex,
    type: question.questionType || question.question_type
  };
};

export const getQuestionOptions = (question: Question): string[] => {
  if (question.options && question.options.length > 0) {
    return question.options;
  }
  
  const options: string[] = [];
  if (question.optionA) options.push(question.optionA);
  if (question.optionB) options.push(question.optionB);
  if (question.optionC) options.push(question.optionC);
  if (question.optionD) options.push(question.optionD);
  
  return options;
};

export const validateQuestionData = (question: Question): boolean => {
  if (!question.id || !question.questionText || !question.correctAnswer) {
    console.error('❌ Question validation failed: Missing required fields', question);
    return false;
  }
  
  const options = getQuestionOptions(question);
  if (options.length < 2) {
    console.error('❌ Question validation failed: Not enough options', question);
    return false;
  }
  
  const validAnswers = ['A', 'B', 'C', 'D'];
  if (!validAnswers.includes(question.correctAnswer.toUpperCase())) {
    console.error('❌ Question validation failed: Invalid correct answer', question);
    return false;
  }
  
  return true;
};