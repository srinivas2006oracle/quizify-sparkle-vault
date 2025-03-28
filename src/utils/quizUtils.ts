
import { Quiz, Question, Choice } from "@/types/quiz";
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
    return await apiService.createQuiz(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// Update an existing quiz
export const updateQuiz = async (updatedQuiz: Quiz): Promise<Quiz> => {
  try {
    return await apiService.updateQuiz(updatedQuiz);
  } catch (error) {
    console.error(`Error updating quiz ${updatedQuiz.id}:`, error);
    throw error;
  }
};

// Delete a quiz
export const deleteQuiz = async (id: string): Promise<void> => {
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
    return await apiService.searchQuizzes(searchTerm);
  } catch (error) {
    console.error('Error searching quizzes:', error);
    return [];
  }
};
