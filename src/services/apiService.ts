
import { Quiz, QuizGame } from "@/types/quiz";

const API_BASE_URL = "http://localhost:5050/api"; // Change this to your actual API URL

// Helper function to normalize quiz data (convert _id to id if needed)
const normalizeQuiz = (quiz: any): Quiz => {
  if (quiz._id && !quiz.id) {
    return { ...quiz, id: quiz._id.toString() };
  }
  return quiz;
};

// Helper function to normalize quizGame data
const normalizeQuizGame = (game: any): QuizGame => {
  if (game._id && !game.id) {
    return { ...game, id: game._id.toString() };
  }
  return game;
};

// Generic error handler for API requests
const handleApiError = (error: any, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`Server responded with error ${error.response.status}:`, error.response.data);
    throw new Error(`Server error: ${error.response.data.message || error.message}`);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received from server:", error.request);
    throw new Error("No response from server. Please check your connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    throw error;
  }
};

export const apiService = {
  // QUIZ OPERATIONS
  async getQuizzes(): Promise<Quiz[]> {
    try {
      console.log("Fetching all quizzes");
      const response = await fetch(`${API_BASE_URL}/quizzes`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const quizzes = await response.json();
      return quizzes.map(normalizeQuiz);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return []; // Return empty array on error
    }
  },

  async searchQuizzes(searchTerm: string): Promise<Quiz[]> {
    try {
      const url = `${API_BASE_URL}/quizzes/search?term=${encodeURIComponent(searchTerm.trim())}`;
      console.log("Search URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Search error details:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Found ${data.length} quizzes for term: "${searchTerm}"`);
      
      return data.map(normalizeQuiz);
    } catch (error) {
      console.error("Error searching quizzes:", error);
      return []; // Return empty array on error
    }
  },

  async getQuiz(id: string): Promise<Quiz> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const quiz = await response.json();
      return normalizeQuiz(quiz);
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error);
      throw error;
    }
  },

  async createQuiz(quiz: Quiz): Promise<Quiz> {
    try {
      // Remove id if it's a new quiz as MongoDB will generate _id
      const { id, ...quizData } = quiz;
      
      // Ensure each question has a correct answer
      if (quizData.questions) {
        for (const question of quizData.questions) {
          if (!question.choices.some(choice => choice.isCorrectChoice)) {
            throw new Error('Each question must have at least one correct answer marked');
          }
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const createdQuiz = await response.json();
      return normalizeQuiz(createdQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  },

  async updateQuiz(quiz: Quiz): Promise<Quiz> {
    try {
      // Use _id if available, otherwise use id
      const quizId = quiz._id || quiz.id;
      
      // Create a copy without id/_id to avoid conflicts
      const { id, _id, ...quizData } = quiz;
      
      // Ensure each question has a correct answer
      if (quizData.questions) {
        for (const question of quizData.questions) {
          if (!question.choices.some(choice => choice.isCorrectChoice)) {
            throw new Error('Each question must have at least one correct answer marked');
          }
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const updatedQuiz = await response.json();
      return normalizeQuiz(updatedQuiz);
    } catch (error) {
      console.error(`Error updating quiz:`, error);
      throw error;
    }
  },

  async patchQuiz(id: string, patchData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const updatedQuiz = await response.json();
      return normalizeQuiz(updatedQuiz);
    } catch (error) {
      console.error(`Error patching quiz ${id}:`, error);
      throw error;
    }
  },

  async deleteQuiz(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error);
      throw error;
    }
  },

  // QUIZ GAME OPERATIONS
  async getQuizGames(): Promise<QuizGame[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const games = await response.json();
      return games.map(normalizeQuizGame);
    } catch (error) {
      console.error("Error fetching quiz games:", error);
      return []; // Return empty array on error
    }
  },

  async searchQuizGames(searchTerm: string): Promise<QuizGame[]> {
    try {
      const url = `${API_BASE_URL}/quizgames/search?term=${encodeURIComponent(searchTerm.trim())}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data.map(normalizeQuizGame);
    } catch (error) {
      console.error("Error searching quiz games:", error);
      return []; // Return empty array on error
    }
  },

  async getQuizGame(id: string): Promise<QuizGame> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const game = await response.json();
      return normalizeQuizGame(game);
    } catch (error) {
      console.error(`Error fetching quiz game ${id}:`, error);
      throw error;
    }
  },

  async createQuizGame(game: QuizGame): Promise<QuizGame> {
    try {
      // Remove id if it's a new game as MongoDB will generate _id
      const { id, ...gameData } = game;
      
      const response = await fetch(`${API_BASE_URL}/quizgames`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const createdGame = await response.json();
      return normalizeQuizGame(createdGame);
    } catch (error) {
      console.error("Error creating quiz game:", error);
      throw error;
    }
  },

  async updateQuizGame(game: QuizGame): Promise<QuizGame> {
    try {
      // Use _id if available, otherwise use id
      const gameId = game._id || game.id;
      
      // Create a copy without id/_id to avoid conflicts
      const { id, _id, ...gameData } = game;
      
      const response = await fetch(`${API_BASE_URL}/quizgames/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const updatedGame = await response.json();
      return normalizeQuizGame(updatedGame);
    } catch (error) {
      console.error(`Error updating quiz game:`, error);
      throw error;
    }
  },

  async patchQuizGame(id: string, patchData: Partial<QuizGame>): Promise<QuizGame> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const updatedGame = await response.json();
      return normalizeQuizGame(updatedGame);
    } catch (error) {
      console.error(`Error patching quiz game ${id}:`, error);
      throw error;
    }
  },

  async deleteQuizGame(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting quiz game ${id}:`, error);
      throw error;
    }
  },

  async startQuizGame(id: string): Promise<QuizGame> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const game = await response.json();
      return normalizeQuizGame(game);
    } catch (error) {
      console.error(`Error starting quiz game ${id}:`, error);
      throw error;
    }
  },

  async endQuizGame(id: string): Promise<QuizGame> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${id}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const game = await response.json();
      return normalizeQuizGame(game);
    } catch (error) {
      console.error(`Error ending quiz game ${id}:`, error);
      throw error;
    }
  },

  async startQuizGameQuestion(gameId: string, questionIndex: number): Promise<QuizGame> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${gameId}/question/${questionIndex}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const game = await response.json();
      return normalizeQuizGame(game);
    } catch (error) {
      console.error(`Error starting question in quiz game ${gameId}:`, error);
      throw error;
    }
  },

  async endQuizGameQuestion(gameId: string, questionIndex: number): Promise<QuizGame> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizgames/${gameId}/question/${questionIndex}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const game = await response.json();
      return normalizeQuizGame(game);
    } catch (error) {
      console.error(`Error ending question in quiz game ${gameId}:`, error);
      throw error;
    }
  }
};
