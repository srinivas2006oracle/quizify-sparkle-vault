
import { Quiz } from "@/types/quiz";

const API_BASE_URL = "https://api.example.com"; // Replace with your actual API URL

export const apiService = {
  async getQuizzes(): Promise<Quiz[]> {
    try {
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
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/search?term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
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
