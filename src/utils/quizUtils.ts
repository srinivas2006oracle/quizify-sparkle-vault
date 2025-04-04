import { Quiz, Question, Choice, QuizGame } from "@/types/quiz";
import { apiService } from "@/services/apiService";

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Create a new empty choice
export const createEmptyChoice = (index: number): Choice => {
  return {
    choiceIndex: index,
    choiceText: "",
    choiceImageurl: "",
    choiceResponses: [],
    isCorrectChoice: false
  };
};

// Create a new empty question template
export const createEmptyQuestion = (): Question => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    questionText: "",
    questionTopicsList: [],
    choices: [
      createEmptyChoice(0),
      createEmptyChoice(1),
      createEmptyChoice(2),
      createEmptyChoice(3)
    ],
    answerExplanation: "",
    templateCategory: "",
    difficultyLevel: "Medium",
    questionLanguage: "English",
    validatedManually: false,
    createdAt: now,
    updatedAt: now,
    createdBy: "current-user",
    updatedBy: "current-user"
  };
};

// Create a new empty quiz template
export const createEmptyQuiz = (): Quiz => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    quizTitle: "",
    quizDescription: "",
    quizTopicsList: [],
    quizLanguage: "English",
    templateCategory: "",
    youtubeChannel: "",
    questions: [createEmptyQuestion()],
    readyForLive: false,
    createdAt: now,
    updatedAt: now,
    createdBy: "current-user",
    updatedBy: "current-user"
  };
};

// Create a new empty quiz game template
export const createEmptyQuizGame = (): QuizGame => {
  const now = new Date().toISOString();
  const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();
  
  return {
    id: generateId(),
    gameTitle: "",
    gameScheduledStart: now,
    gameScheduledEnd: oneHourLater,
    activeQuestionIndex: 0,
    isQuestionOpen: false,
    correctChoiceIndex: -1,
    isGameOpen: false,
    quizId: "",
    questions: [],
    introImage: ""
  };
};

// Helper function to get the correct ID from a quiz
export const getQuizId = (quiz: Quiz): string => {
  return quiz.id || quiz._id?.toString() || "";
};

// Helper function to get the correct ID from a quiz game
export const getQuizGameId = (game: QuizGame): string => {
  return game.id || game._id?.toString() || "";
};

// Load quizzes from API
export const loadQuizzes = async (): Promise<Quiz[]> => {
  try {
    return await apiService.getQuizzes();
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
};

// Get a specific quiz by ID
export const getQuiz = async (id: string): Promise<Quiz | undefined> => {
  if (!id) return undefined;
  
  try {
    return await apiService.getQuiz(id);
  } catch (error) {
    console.error(`Error getting quiz ${id}:`, error);
    return undefined;
  }
};

// Create a new quiz
export const createQuiz = async (quiz: Quiz): Promise<Quiz> => {
  try {
    // Process quiz questions before saving to ensure each has a correct choice
    const processedQuiz = {
      ...quiz,
      questions: quiz.questions.map(question => {
        const correctChoiceIndex = question.choices.findIndex(c => c.isCorrectChoice);
        return {
          ...question,
          correctChoiceIndex: correctChoiceIndex !== -1 ? correctChoiceIndex : undefined
        };
      })
    };
    
    return await apiService.createQuiz(processedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// Update an existing quiz
export const updateQuiz = async (updatedQuiz: Quiz): Promise<Quiz> => {
  const id = getQuizId(updatedQuiz);
  if (!id) {
    throw new Error('Quiz ID is missing for update operation');
  }
  
  try {
    // Process quiz questions before saving to ensure each has a correct choice
    const processedQuiz = {
      ...updatedQuiz,
      questions: updatedQuiz.questions.map(question => {
        const correctChoiceIndex = question.choices.findIndex(c => c.isCorrectChoice);
        return {
          ...question,
          correctChoiceIndex: correctChoiceIndex !== -1 ? correctChoiceIndex : question.correctChoiceIndex
        };
      })
    };
    
    return await apiService.updateQuiz(processedQuiz);
  } catch (error) {
    console.error(`Error updating quiz ${id}:`, error);
    throw error;
  }
};

// Partially update a quiz
export const patchQuiz = async (id: string, patchData: Partial<Quiz>): Promise<Quiz> => {
  if (!id) {
    throw new Error('Quiz ID is missing for patch operation');
  }
  
  try {
    return await apiService.patchQuiz(id, patchData);
  } catch (error) {
    console.error(`Error patching quiz ${id}:`, error);
    throw error;
  }
};

// Delete a quiz
export const deleteQuiz = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error('Quiz ID is missing for delete operation');
  }
  
  try {
    await apiService.deleteQuiz(id);
  } catch (error) {
    console.error(`Error deleting quiz ${id}:`, error);
    throw error;
  }
};

// Search quizzes by term (title, description, topics)
export const searchQuizzes = async (searchTerm: string): Promise<Quiz[]> => {
  try {
    console.log("Searching quizzes for term:", searchTerm);
    const results = await apiService.searchQuizzes(searchTerm);
    
    // Ensure all results have a valid id field
    return results.map(quiz => ({
      ...quiz,
      id: getQuizId(quiz)
    }));
  } catch (error) {
    console.error('Error searching quizzes:', error);
    return []; // Return empty array instead of throwing
  }
};

// Quiz Game Operations
export const createQuizGame = async (game: QuizGame): Promise<QuizGame> => {
  try {
    return await apiService.createQuizGame(game);
  } catch (error) {
    console.error('Error creating quiz game:', error);
    throw error;
  }
};

export const updateQuizGame = async (game: QuizGame): Promise<QuizGame> => {
  const id = getQuizGameId(game);
  if (!id) {
    throw new Error('Quiz game ID is missing for update operation');
  }
  
  try {
    return await apiService.updateQuizGame(game);
  } catch (error) {
    console.error(`Error updating quiz game ${id}:`, error);
    throw error;
  }
};

export const getQuizGame = async (id: string): Promise<QuizGame | undefined> => {
  if (!id) return undefined;
  
  try {
    return await apiService.getQuizGame(id);
  } catch (error) {
    console.error(`Error getting quiz game ${id}:`, error);
    return undefined;
  }
};

export const loadQuizGames = async (): Promise<QuizGame[]> => {
  try {
    return await apiService.getQuizGames();
  } catch (error) {
    console.error('Error loading quiz games:', error);
    return [];
  }
};

export const deleteQuizGame = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error('Quiz game ID is missing for delete operation');
  }
  
  try {
    await apiService.deleteQuizGame(id);
  } catch (error) {
    console.error(`Error deleting quiz game ${id}:`, error);
    throw error;
  }
};

export const startQuizGame = async (id: string): Promise<QuizGame> => {
  try {
    return await apiService.startQuizGame(id);
  } catch (error) {
    console.error(`Error starting quiz game ${id}:`, error);
    throw error;
  }
};

export const endQuizGame = async (id: string): Promise<QuizGame> => {
  try {
    return await apiService.endQuizGame(id);
  } catch (error) {
    console.error(`Error ending quiz game ${id}:`, error);
    throw error;
  }
};

export const startQuizGameQuestion = async (gameId: string, questionIndex: number): Promise<QuizGame> => {
  try {
    return await apiService.startQuizGameQuestion(gameId, questionIndex);
  } catch (error) {
    console.error(`Error starting question in quiz game ${gameId}:`, error);
    throw error;
  }
};

export const endQuizGameQuestion = async (gameId: string, questionIndex: number): Promise<QuizGame> => {
  try {
    return await apiService.endQuizGameQuestion(gameId, questionIndex);
  } catch (error) {
    console.error(`Error ending question in quiz game ${gameId}:`, error);
    throw error;
  }
};
