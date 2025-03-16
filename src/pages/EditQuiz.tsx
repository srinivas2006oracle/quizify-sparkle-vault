
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizForm from "@/components/QuizForm";
import Header from "@/components/Header";
import { Quiz } from "@/types/quiz";
import { getQuiz, updateQuiz, createEmptyQuiz } from "@/utils/quizUtils";
import { useToast } from "@/hooks/use-toast";

const EditQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (id) {
        try {
          const quizData = await getQuiz(id);
          if (quizData) {
            setQuiz(quizData);
          } else {
            toast({
              title: "Quiz not found",
              description: "The requested quiz could not be found.",
              variant: "destructive",
            });
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching quiz:", error);
          toast({
            title: "Error",
            description: "Failed to load quiz. Please try again.",
            variant: "destructive",
          });
          navigate("/");
        }
      } else {
        setQuiz(createEmptyQuiz());
      }
      setIsLoading(false);
    };

    fetchQuiz();
  }, [id, navigate, toast]);

  const handleSave = async (updatedQuiz: Quiz) => {
    try {
      await updateQuiz(updatedQuiz);
      toast({
        title: "Quiz updated",
        description: "The quiz has been successfully updated.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to update quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="container mx-auto pt-24 pb-16 px-4">
          <div className="w-full bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-border p-8 text-center animate-pulse-subtle">
            <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="container mx-auto pt-24 pb-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Quiz not found</h1>
            <p className="text-muted-foreground">The requested quiz could not be found.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="space-y-6">
          <div className="space-y-2 text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold">Edit Quiz</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Update your quiz details and questions
            </p>
          </div>

          <QuizForm 
            initialQuiz={quiz} 
            onSave={handleSave} 
            isEditing={true} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
