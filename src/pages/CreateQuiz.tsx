
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizForm from "@/components/QuizForm";
import Header from "@/components/Header";
import { Quiz } from "@/types/quiz";
import { createEmptyQuiz, createQuiz } from "@/utils/quizUtils";
import { useToast } from "@/hooks/use-toast";

const CreateQuiz = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setQuiz(createEmptyQuiz());
  }, []);

  const handleSave = async (newQuiz: Quiz) => {
    try {
      await createQuiz(newQuiz);
      toast({
        title: "Quiz created",
        description: "The quiz has been successfully created.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!quiz) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="space-y-6">
          <div className="space-y-2 text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold">Create New Quiz</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Add details and questions for your new quiz
            </p>
          </div>

          <QuizForm 
            initialQuiz={quiz} 
            onSave={handleSave} 
            isEditing={false} 
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
