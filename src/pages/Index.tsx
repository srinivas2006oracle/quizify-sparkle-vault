
import { useState, useEffect, useCallback } from "react";
import QuizSearch from "@/components/QuizSearch";
import QuizList from "@/components/QuizList";
import Header from "@/components/Header";
import { Quiz } from "@/types/quiz";
import { loadQuizzes, searchQuizzes, deleteQuiz } from "@/utils/quizUtils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchResults, setSearchResults] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Helper function to get the correct ID from a quiz
  const getQuizId = (quiz: Quiz): string => {
    return quiz.id || quiz._id?.toString() || "";
  };

  // Load quizzes on initial mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const data = await loadQuizzes();
        console.log("Loaded quizzes:", data);
        setQuizzes(data);
        setSearchResults(data);
      } catch (error) {
        console.error("Error loading quizzes:", error);
        toast({
          title: "Error",
          description: "Failed to load quizzes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [toast]);

  // Debounced search handler
  const handleSearch = useCallback(async (searchTerm: string) => {
    // If empty search term, reset to showing all quizzes
    if (!searchTerm.trim()) {
      setSearchResults(quizzes);
      return;
    }
    
    try {
      setIsSearching(true);
      const results = await searchQuizzes(searchTerm);
      console.log("Search results:", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching quizzes:", error);
      toast({
        title: "Error",
        description: "Failed to search quizzes. Please try again.",
        variant: "destructive",
      });
      // Fall back to showing all quizzes
      setSearchResults(quizzes);
    } finally {
      setIsSearching(false);
    }
  }, [quizzes, toast]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    try {
      await deleteQuiz(id);
      // After deletion, update both arrays using the correct ID
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => 
        getQuizId(quiz) !== id
      ));
      setSearchResults(prevResults => prevResults.filter(quiz => 
        getQuizId(quiz) !== id
      ));
      
      toast({
        title: "Quiz deleted",
        description: "The quiz has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="space-y-6">
          <div className="space-y-2 text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold">Quiz Management</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create, edit, and manage your quizzes for interactive learning experiences
            </p>
          </div>

          <QuizSearch onSearch={handleSearch} />

          {isLoading || isSearching ? (
            <div className="w-full bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-border p-8 text-center animate-pulse-subtle">
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse"></div>
                <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <QuizList 
              quizzes={searchResults} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
