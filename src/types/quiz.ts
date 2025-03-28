
export interface Response {
  ytChannelId?: string;
  ytProfilePicUrl?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  ytTimeStamp?: string;
  systemTimeStamp?: string;
  responseTime?: string;
}

export interface Choice {
  choiceIndex: number;
  choiceText: string;
  choiceImageurl?: string;
  choiceResponses?: Response[];
  isCorrectChoice: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  questionImageUrl?: string;
  questionTopicsList: string[];
  choices: Choice[];
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

export interface QuizGame {
  id: string;
  gameTitle: string;
  gameScheduledStart: string;
  gameScheduledEnd: string;
  gameStartedAt?: string;
  gameEndedAt?: string;
  activeQuestionIndex: number;
  questionStartedAt?: string;
  isQuestionOpen: boolean;
  correctChoiceIndex: number;
  liveIDs: string[];
  liveChatdIDs: string[];
  isGameOpen: boolean;
  quizId: string;
  questions: Question[];
}
