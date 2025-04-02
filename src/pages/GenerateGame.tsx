
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import DateTimePicker from "@/components/DateTimePicker";
import { Quiz, QuizGame } from "@/types/quiz";
import { loadQuizzes, createQuizGame } from "@/utils/quizUtils";
import { useToast } from "@/hooks/use-toast";

const GenerateGame = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [gameTitle, setGameTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load available quizzes that are ready for live
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const allQuizzes = await loadQuizzes();
        // Filter quizzes that are ready for live
        const liveQuizzes = allQuizzes.filter(quiz => quiz.readyForLive);
        setQuizzes(liveQuizzes);
      } catch (error) {
        console.error("Error loading quizzes:", error);
        toast({
          title: "Error",
          description: "Failed to load quizzes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [toast]);

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizId(quizId);
    
    // Set game title based on selected quiz
    const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);
    if (selectedQuiz) {
      setGameTitle(`${selectedQuiz.quizTitle} Game`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedQuizId) {
      toast({
        title: "Quiz Required",
        description: "Please select a quiz to generate a game.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Dates Required",
        description: "Please select both start and end dates for the game.",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date cannot be earlier than start date.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the selected quiz to copy questions
      const selectedQuiz = quizzes.find(quiz => quiz.id === selectedQuizId);
      
      if (!selectedQuiz) {
        throw new Error("Selected quiz not found");
      }

      const newGame: QuizGame = {
        gameTitle: gameTitle,
        gameScheduledStart: startDate.toISOString(),
        gameScheduledEnd: endDate.toISOString(),
        activeQuestionIndex: 0,
        isQuestionOpen: false,
        correctChoiceIndex: 0,
        liveIDs: [],
        liveChatdIDs: [],
        isGameOpen: false,
        quizId: selectedQuizId,
        questions: selectedQuiz.questions,
      };

      const createdGame = await createQuizGame(newGame);
      
      toast({
        title: "Success!",
        description: "Quiz game created successfully.",
      });
      
      // Navigate to the home page or a game management page
      navigate("/");
    } catch (error) {
      console.error("Error creating quiz game:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-border p-6">
          <h1 className="text-2xl font-bold mb-6">Generate Quiz Game</h1>
          
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span className="ml-3">Loading quizzes...</span>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center p-8 space-y-4">
              <p className="text-muted-foreground">No quizzes are ready for live.</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quizSelect">Select Quiz</Label>
                <Select value={selectedQuizId} onValueChange={handleQuizSelect}>
                  <SelectTrigger id="quizSelect" className="w-full">
                    <SelectValue placeholder="Select a quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id || ""}>
                        {quiz.quizTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameTitle">Game Title</Label>
                <Input
                  id="gameTitle"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="Enter game title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date & Time</Label>
                  <DateTimePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                    label="Select start date and time" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date & Time</Label>
                  <DateTimePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                    label="Select end date and time" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit">Generate Game</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateGame;
