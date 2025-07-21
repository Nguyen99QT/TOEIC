export interface TestQuestion {
  questionId: number;
  partNumber: number;
  questionText: string;
  options: Array<{
    label: string;
    content: string;
  }>;
  correctAnswer: string;
  audioUrl?: string;
  imageUrl?: string;
  explanation?: string;
}

export interface TestResult {
  testId: number;
  testTitle: string;
  scoreListen: number;
  scoreRead: number;
  correctAnswers: number;
  totalQuestions: number;
}

// Mock TOEIC Test với 20 câu hỏi mẫu
export const mockTestQuestions: TestQuestion[] = [
  // LISTENING SECTION - Part 1: Photographs
  {
    questionId: 1,
    partNumber: 1,
    questionText: "Look at the picture and choose the best description.",
    options: [
      { label: "A", content: "The woman is reading a book in the library." },
      { label: "B", content: "The woman is typing on her computer." },
      { label: "C", content: "The woman is talking on the phone." },
      { label: "D", content: "The woman is writing in her notebook." }
    ],
    correctAnswer: "B",
    imageUrl: "/images/test/woman-computer.jpg",
    explanation: "The woman is clearly typing on her laptop computer."
  },
  
  {
    questionId: 2,
    partNumber: 1,
    questionText: "What do you see in this picture?",
    options: [
      { label: "A", content: "People are walking in the park." },
      { label: "B", content: "Cars are parked in the garage." },
      { label: "C", content: "Students are sitting in the classroom." },
      { label: "D", content: "Workers are having a meeting." }
    ],
    correctAnswer: "D",
    imageUrl: "/images/test/meeting-room.jpg",
    explanation: "The image shows business people in a conference room having a meeting."
  },

  // Part 2: Question-Response
  {
    questionId: 3,
    partNumber: 2,
    questionText: "You will hear a question followed by three responses. Choose the best response.",
    options: [
      { label: "A", content: "(Audio response A)" },
      { label: "B", content: "(Audio response B)" },
      { label: "C", content: "(Audio response C)" }
    ],
    correctAnswer: "A",
    audioUrl: "/audio/test/question3.mp3",
    explanation: "Response A directly answers the question about time."
  },

  {
    questionId: 4,
    partNumber: 2,
    questionText: "Listen and choose the best response.",
    options: [
      { label: "A", content: "(Audio response A)" },
      { label: "B", content: "(Audio response B)" },
      { label: "C", content: "(Audio response C)" }
    ],
    correctAnswer: "C",
    audioUrl: "/audio/test/question4.mp3",
    explanation: "Response C is the most appropriate reply to the question."
  },

  // Part 3: Short Conversations
  {
    questionId: 5,
    partNumber: 3,
    questionText: "What is the woman's problem?",
    options: [
      { label: "A", content: "She missed her flight." },
      { label: "B", content: "She lost her luggage." },
      { label: "C", content: "She can't find her ticket." },
      { label: "D", content: "She's running late for work." }
    ],
    correctAnswer: "A",
    audioUrl: "/audio/test/conversation1.mp3",
    explanation: "The woman mentions that her flight has already departed."
  },

  // READING SECTION - Part 5: Incomplete Sentences
  {
    questionId: 6,
    partNumber: 5,
    questionText: "The company _____ its employees excellent benefits.",
    options: [
      { label: "A", content: "provide" },
      { label: "B", content: "provides" },
      { label: "C", content: "providing" },
      { label: "D", content: "provided" }
    ],
    correctAnswer: "B",
    explanation: "Subject-verb agreement: 'The company' is singular, so we need 'provides'."
  },

  {
    questionId: 7,
    partNumber: 5,
    questionText: "Please _____ the form completely before submitting it.",
    options: [
      { label: "A", content: "fill out" },
      { label: "B", content: "fill up" },
      { label: "C", content: "fill in" },
      { label: "D", content: "fill down" }
    ],
    correctAnswer: "A",
    explanation: "'Fill out' is the correct phrasal verb for completing forms."
  },

  {
    questionId: 8,
    partNumber: 5,
    questionText: "The meeting has been _____ until next week.",
    options: [
      { label: "A", content: "postponed" },
      { label: "B", content: "advanced" },
      { label: "C", content: "promoted" },
      { label: "D", content: "proceeded" }
    ],
    correctAnswer: "A",
    explanation: "'Postponed' means delayed or moved to a later time."
  },

  {
    questionId: 9,
    partNumber: 5,
    questionText: "_____ the weather improves, we'll have the picnic outdoors.",
    options: [
      { label: "A", content: "Unless" },
      { label: "B", content: "If" },
      { label: "C", content: "Although" },
      { label: "D", content: "Because" }
    ],
    correctAnswer: "B",
    explanation: "'If' introduces a conditional clause about the weather improving."
  },

  {
    questionId: 10,
    partNumber: 5,
    questionText: "The new software is _____ efficient than the old version.",
    options: [
      { label: "A", content: "more" },
      { label: "B", content: "most" },
      { label: "C", content: "much" },
      { label: "D", content: "many" }
    ],
    correctAnswer: "A",
    explanation: "Comparative form: 'more efficient than' is correct."
  },

  // Part 6: Text Completion
  {
    questionId: 11,
    partNumber: 6,
    questionText: "Dear Ms. Johnson, We are pleased to _____ that your application has been approved.",
    options: [
      { label: "A", content: "inform" },
      { label: "B", content: "informing" },
      { label: "C", content: "informed" },
      { label: "D", content: "information" }
    ],
    correctAnswer: "A",
    explanation: "'Pleased to inform' is the correct infinitive form."
  },

  {
    questionId: 12,
    partNumber: 6,
    questionText: "The conference will _____ place in the main auditorium.",
    options: [
      { label: "A", content: "make" },
      { label: "B", content: "take" },
      { label: "C", content: "have" },
      { label: "D", content: "give" }
    ],
    correctAnswer: "B",
    explanation: "'Take place' is the correct collocation meaning 'happen' or 'occur'."
  },

  // Part 7: Reading Comprehension
  {
    questionId: 13,
    partNumber: 7,
    questionText: "According to the email, what is the main purpose of the meeting?",
    options: [
      { label: "A", content: "To discuss the quarterly budget" },
      { label: "B", content: "To introduce new team members" },
      { label: "C", content: "To review the marketing strategy" },
      { label: "D", content: "To plan the office renovation" }
    ],
    correctAnswer: "C",
    explanation: "The email specifically mentions reviewing and updating the marketing strategy."
  },

  {
    questionId: 14,
    partNumber: 7,
    questionText: "When is the deadline for submitting the report?",
    options: [
      { label: "A", content: "This Friday" },
      { label: "B", content: "Next Monday" },
      { label: "C", content: "End of the month" },
      { label: "D", content: "No deadline specified" }
    ],
    correctAnswer: "A",
    explanation: "The passage clearly states the report must be submitted by Friday."
  },

  {
    questionId: 15,
    partNumber: 7,
    questionText: "What does the advertisement offer to first-time customers?",
    options: [
      { label: "A", content: "Free delivery" },
      { label: "B", content: "20% discount" },
      { label: "C", content: "Extended warranty" },
      { label: "D", content: "Free installation" }
    ],
    correctAnswer: "B",
    explanation: "The ad mentions a 20% discount for new customers."
  },

  // Additional questions for a complete test
  {
    questionId: 16,
    partNumber: 5,
    questionText: "The restaurant is known _____ its excellent seafood dishes.",
    options: [
      { label: "A", content: "for" },
      { label: "B", content: "by" },
      { label: "C", content: "with" },
      { label: "D", content: "as" }
    ],
    correctAnswer: "A",
    explanation: "'Known for' is the correct preposition when talking about reputation."
  },

  {
    questionId: 17,
    partNumber: 5,
    questionText: "_____ arriving at the office, she checked her emails immediately.",
    options: [
      { label: "A", content: "Before" },
      { label: "B", content: "After" },
      { label: "C", content: "During" },
      { label: "D", content: "While" }
    ],
    correctAnswer: "B",
    explanation: "'After arriving' indicates the sequence of events."
  },

  {
    questionId: 18,
    partNumber: 5,
    questionText: "The project manager asked us to _____ the presentation by tomorrow.",
    options: [
      { label: "A", content: "finish" },
      { label: "B", content: "finishing" },
      { label: "C", content: "finished" },
      { label: "D", content: "finishes" }
    ],
    correctAnswer: "A",
    explanation: "'Asked us to finish' requires the infinitive form without 'to'."
  },

  {
    questionId: 19,
    partNumber: 7,
    questionText: "What is the recommended action for employees during the fire drill?",
    options: [
      { label: "A", content: "Stay at their desks" },
      { label: "B", content: "Exit through the nearest door" },
      { label: "C", content: "Wait for further instructions" },
      { label: "D", content: "Call the security office" }
    ],
    correctAnswer: "B",
    explanation: "Safety procedures require immediate evacuation through the nearest exit."
  },

  {
    questionId: 20,
    partNumber: 7,
    questionText: "According to the schedule, what time does the workshop begin?",
    options: [
      { label: "A", content: "9:00 AM" },
      { label: "B", content: "9:30 AM" },
      { label: "C", content: "10:00 AM" },
      { label: "D", content: "10:30 AM" }
    ],
    correctAnswer: "C",
    explanation: "The schedule clearly shows the workshop starts at 10:00 AM."
  }
];

// Mock test service functions
export const mockTestService = {
  getTestQuestions: async (testId: number): Promise<TestQuestion[]> => {
    console.log(`🧪 MOCK: Loading test questions for test ID: ${testId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockTestQuestions;
  },

  submitTest: async (submission: {
    userId: number;
    testId: number;
    answers: Array<{ questionId: number; selectedOption: string }>;
  }): Promise<TestResult> => {
    console.log('🧪 MOCK: Submitting test answers:', submission);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate scores
    let correctAnswers = 0;
    let listeningCorrect = 0;
    let readingCorrect = 0;
    let listeningTotal = 0;
    let readingTotal = 0;
    
    submission.answers.forEach(answer => {
      const question = mockTestQuestions.find(q => q.questionId === answer.questionId);
      if (question) {
        // Count totals by section
        if (question.partNumber <= 4) {
          listeningTotal++;
          if (question.correctAnswer === answer.selectedOption) {
            listeningCorrect++;
            correctAnswers++;
          }
        } else {
          readingTotal++;
          if (question.correctAnswer === answer.selectedOption) {
            readingCorrect++;
            correctAnswers++;
          }
        }
      }
    });
    
    // Calculate TOEIC scores (scaled)
    const listeningScore = Math.round((listeningCorrect / listeningTotal) * 495);
    const readingScore = Math.round((readingCorrect / readingTotal) * 495);
    
    return {
      testId: submission.testId,
      testTitle: `TOEIC Practice Test #${submission.testId}`,
      scoreListen: listeningScore,
      scoreRead: readingScore,
      correctAnswers,
      totalQuestions: mockTestQuestions.length
    };
  }
};