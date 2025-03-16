
import { Quiz } from "@/types/quiz";

const API_BASE_URL = "https://api.example.com"; // Replace with your actual API URL

// Cache for search results to reduce API calls
const searchCache = new Map<string, { data: Quiz[], timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache TTL

export const apiService = {
  async getQuizzes(): Promise<Quiz[]> {
    try {
      console.log("Fetching all quizzes");
      const response = await fetch(`${API_BASE_URL}/quizzes`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
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
      
      // Cache the result
      searchCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
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
      return await response.json();
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error);
      throw error;
    }
  },

  async createQuiz(quiz: Quiz): Promise<Quiz> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  },

  async updateQuiz(quiz: Quiz): Promise<Quiz> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quiz.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating quiz ${quiz.id}:`, error);
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
