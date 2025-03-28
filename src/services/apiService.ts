
import { Quiz } from "@/types/quiz";

const API_BASE_URL = "http://localhost:5000/api"; // Change this to your actual API URL

// Cache for search results to reduce API calls
const searchCache = new Map<string, { data: Quiz[], timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache TTL

// Helper function to normalize quiz data (convert _id to id if needed)
const normalizeQuiz = (quiz: any): Quiz => {
  if (quiz._id && !quiz.id) {
    return { ...quiz, id: quiz._id };
  }
  return quiz;
};

export const apiService = {
  async getQuizzes(): Promise<Quiz[]> {
    try {
      console.log("Fetching all quizzes");
      const response = await fetch(`${API_BASE_URL}/quizzes`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const quizzes = await response.json();
      // Normalize each quiz by ensuring it has an id property
      return quizzes.map(normalizeQuiz);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      throw error;
    }
  },

  async searchQuizzes(searchTerm: string): Promise<Quiz[]> {
    // If empty search term, return empty results
    if (!searchTerm.trim()) {
      return [];
    }
    
    // Check cache first
    const cacheKey = searchTerm.trim().toLowerCase();
    const cachedResult = searchCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      console.log("Using cached search results for:", searchTerm);
      return cachedResult.data;
    }
    
    try {
      console.log("Searching quizzes for term:", searchTerm);
      const response = await fetch(`${API_BASE_URL}/quizzes/search?term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      // Normalize the quiz data
      const normalizedData = data.map(normalizeQuiz);
      
      // Cache the result
      searchCache.set(cacheKey, {
        data: normalizedData,
        timestamp: Date.now()
      });
      
      return normalizedData;
    } catch (error) {
      console.error("Error searching quizzes:", error);
      throw error;
    }
  },

  async getQuiz(id: string): Promise<Quiz> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
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
      
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
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
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const updatedQuiz = await response.json();
      return normalizeQuiz(updatedQuiz);
    } catch (error) {
      console.error(`Error updating quiz:`, error);
      throw error;
    }
  },

  async deleteQuiz(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error);
      throw error;
    }
  }
};
