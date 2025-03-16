
export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  questionImageUrl?: string;
  questionTopicsList: string[];
  choices: string[];
  correctChoiceIndex: number;
  correctAnswer: string;
  answerExplanation: string;
  templateCategory: string;
  difficultyLevel: string;
  questionLanguage: string;
  validatedManually: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Quiz {
  id: string;
  quizTitle: string;
  quizDescription: string;
  quizTopicsList: string[];
  quizLanguage: string;
  templateCategory: string;
  youtubeChannel: string;
  questions: Question[];
  readyForLive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
