
import { Quiz, Question } from "@/types/quiz";
import { sampleQuizzes } from "@/data/sampleQuizzes";

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

// Create a new empty question template
export const createEmptyQuestion = (): Question => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    questionText: "",
    questionTopicsList: [],
    choices: ["", "", "", ""],
    correctChoiceIndex: 0,
    correctAnswer: "",
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

// In a real application, these would connect to an API
// For now, we'll use local storage to persist changes

// Load quizzes from storage or use sample data
export const loadQuizzes = (): Quiz[] => {
  try {
    const storedQuizzes = localStorage.getItem('quizzes');
    if (storedQuizzes) {
      return JSON.parse(storedQuizzes);
    }
    // Initialize with sample data if nothing is stored
    localStorage.setItem('quizzes', JSON.stringify(sampleQuizzes));
    return sampleQuizzes;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return sampleQuizzes;
  }
};

// Save quizzes to storage
export const saveQuizzes = (quizzes: Quiz[]): void => {
  try {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  } catch (error) {
    console.error('Error saving quizzes:', error);
  }
};

// Get a specific quiz by ID
export const getQuiz = (id: string): Quiz | undefined => {
  const quizzes = loadQuizzes();
  return quizzes.find(quiz => quiz.id === id);
};

// Create a new quiz
export const createQuiz = (quiz: Quiz): Quiz => {
  const quizzes = loadQuizzes();
  const newQuiz = { ...quiz, id: generateId() };
  saveQuizzes([...quizzes, newQuiz]);
  return newQuiz;
};

// Update an existing quiz
export const updateQuiz = (updatedQuiz: Quiz): Quiz => {
  const quizzes = loadQuizzes();
  const updatedQuizzes = quizzes.map(quiz => 
    quiz.id === updatedQuiz.id ? updatedQuiz : quiz
  );
  saveQuizzes(updatedQuizzes);
  return updatedQuiz;
};

// Delete a quiz
export const deleteQuiz = (id: string): void => {
  const quizzes = loadQuizzes();
  const filteredQuizzes = quizzes.filter(quiz => quiz.id !== id);
  saveQuizzes(filteredQuizzes);
};

// Search quizzes by term (title, description, topics)
export const searchQuizzes = (searchTerm: string): Quiz[] => {
  const quizzes = loadQuizzes();
  if (!searchTerm.trim()) return quizzes;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return quizzes.filter(quiz => 
    quiz.quizTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
    quiz.quizDescription.toLowerCase().includes(lowerCaseSearchTerm) ||
    quiz.quizTopicsList.some(topic => topic.toLowerCase().includes(lowerCaseSearchTerm))
  );
};
