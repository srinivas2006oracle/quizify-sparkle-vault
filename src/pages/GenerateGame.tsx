
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import DateTimePicker from "@/components/DateTimePicker";
import { Quiz, QuizGame } from "@/types/quiz";
import { loadQuizzes, createQuizGame, loadQuizGames, deleteQuizGame, formatDate } from "@/utils/quizUtils";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const GenerateGame = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizGames, setQuizGames] = useState<QuizGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [gameTitle, setGameTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState<string>("");
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

  // Load existing quiz games
  useEffect(() => {
    const fetchQuizGames = async () => {
      try {
        const games = await loadQuizGames();
        setQuizGames(games);
      } catch (error) {
        console.error("Error loading quiz games:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz games. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingGames(false);
      }
    };

    fetchQuizGames();
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

    if (!gameTitle.trim()) {
      toast({
        title: "Game Title Required",
        description: "Please enter a title for the game.",
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
        gameStartedAt: undefined,
        gameEndedAt: undefined,
        activeQuestionIndex: 0,
        questionStartedAt: undefined,
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
      
      // Refresh the list of quiz games
      setQuizGames(prev => [createdGame, ...prev]);
      
      // Reset the form
      setSelectedQuizId("");
      setGameTitle("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      console.error("Error creating quiz game:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (confirm("Are you sure you want to delete this quiz game?")) {
      try {
        await deleteQuizGame(id);
        setQuizGames(quizGames.filter(game => game.id !== id));
        toast({
          title: "Success",
          description: "Quiz game deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting quiz game:", error);
        toast({
          title: "Error",
          description: "Failed to delete quiz game. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Filter quiz games based on search term
  const filteredQuizGames = quizGames.filter(game => 
    game.gameTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-border p-6 mb-8">
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

        {/* Quiz Games List Section */}
        <div className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-2xl font-bold mb-6">Existing Quiz Games</h2>
          
          {/* Search Input */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search quiz games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {loadingGames ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span className="ml-3">Loading quiz games...</span>
            </div>
          ) : filteredQuizGames.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No quiz games match your search." : "No quiz games have been created yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Title</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.gameTitle}</TableCell>
                      <TableCell>{formatDate(game.gameScheduledStart)}</TableCell>
                      <TableCell>{formatDate(game.gameScheduledEnd)}</TableCell>
                      <TableCell>
                        {game.isGameOpen ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                            Active
                          </span>
                        ) : game.gameEndedAt ? (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            Ended
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                            Scheduled
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGame(game.id || "")}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateGame;
