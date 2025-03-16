
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Quiz } from "@/types/quiz";
import { getQuiz } from "@/utils/quizUtils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Check, Tag, Calendar } from "lucide-react";
import { formatDate } from "@/utils/quizUtils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ViewQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const quizData = getQuiz(id);
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
    }
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleEdit = () => {
    if (id) {
      navigate(`/edit/${id}`);
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
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <button 
              onClick={() => navigate("/")}
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quizzes
            </button>
            <Button 
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Quiz
            </Button>
          </div>

          <div className="w-full bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-border p-6 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${quiz.readyForLive ? "bg-green-500" : "bg-amber-500"}`} 
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {quiz.readyForLive ? "Ready for Live" : "Draft"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">{quiz.quizTitle}</h1>
                  <p className="text-muted-foreground mt-2">{quiz.quizDescription}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Last updated: {formatDate(quiz.updatedAt)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Tag className="w-3.5 h-3.5" />
                    Category: {quiz.templateCategory || "Uncategorized"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {quiz.quizTopicsList.map((topic, index) => (
                  <Badge key={index} variant="secondary">{topic}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-medium mb-1">Language</div>
                  <div>{quiz.quizLanguage}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-medium mb-1">YouTube Channel</div>
                  <div>{quiz.youtubeChannel || "Not specified"}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-medium mb-1">Questions</div>
                  <div>{quiz.questions.length}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-4">Questions</h2>
                
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div 
                      key={question.id} 
                      className="bg-white border border-border rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md animate-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">
                          {index + 1}. {question.questionText}
                        </h3>
                        <Badge variant="outline" className="ml-2">
                          {question.difficultyLevel}
                        </Badge>
                      </div>

                      {question.questionImageUrl && (
                        <div className="mb-4">
                          <img 
                            src={question.questionImageUrl} 
                            alt={`Question ${index + 1}`} 
                            className="rounded-md max-h-48 object-contain"
                          />
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        {question.choices.map((choice, choiceIndex) => (
                          <div 
                            key={choiceIndex} 
                            className={`flex items-center gap-3 p-3 rounded-md ${
                              question.correctChoiceIndex === choiceIndex
                                ? "bg-green-50 border border-green-200"
                                : "bg-muted/30"
                            }`}
                          >
                            <div 
                              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                question.correctChoiceIndex === choiceIndex
                                  ? "bg-green-500 text-white"
                                  : "bg-muted"
                              }`}
                            >
                              {question.correctChoiceIndex === choiceIndex && (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                            <span>{choice}</span>
                          </div>
                        ))}
                      </div>

                      {question.answerExplanation && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                          <div className="text-sm font-medium text-blue-800 mb-1">Explanation:</div>
                          <div className="text-sm text-blue-700">{question.answerExplanation}</div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {question.questionTopicsList.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
