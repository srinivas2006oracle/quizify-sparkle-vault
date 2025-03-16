
import { useState, useEffect } from "react";
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const data = loadQuizzes();
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

  const handleSearch = (searchTerm: string) => {
    const results = searchQuizzes(searchTerm);
    setSearchResults(results);
  };

  const handleDelete = (id: string) => {
    try {
      deleteQuiz(id);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== id));
      setSearchResults(prevResults => prevResults.filter(quiz => quiz.id !== id));
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

          {isLoading ? (
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
