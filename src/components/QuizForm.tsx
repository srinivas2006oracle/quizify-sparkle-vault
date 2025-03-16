import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Save, X, ArrowLeft, Check } from "lucide-react";
import { Quiz, Question } from "@/types/quiz";
import { createEmptyQuestion } from "@/utils/quizUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuizFormProps {
  initialQuiz: Quiz;
  onSave: (quiz: Quiz) => void;
  isEditing: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ initialQuiz, onSave, isEditing }) => {
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const [activeTab, setActiveTab] = useState("details");
  const [newTopic, setNewTopic] = useState("");
  const [newQuestionTopic, setNewQuestionTopic] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setQuiz(initialQuiz);
  }, [initialQuiz]);

  const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleReadyForLiveChange = (checked: boolean) => {
    setQuiz((prev) => ({
      ...prev,
      readyForLive: checked,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTopic.trim()) {
      e.preventDefault();
      if (!quiz.quizTopicsList.includes(newTopic.trim())) {
        setQuiz((prev) => ({
          ...prev,
          quizTopicsList: [...prev.quizTopicsList, newTopic.trim()],
          updatedAt: new Date().toISOString(),
        }));
      }
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setQuiz((prev) => ({
      ...prev,
      quizTopicsList: prev.quizTopicsList.filter(topic => topic !== topicToRemove),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddQuestion = () => {
    const newQuestion = createEmptyQuestion();
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    }));
    setActiveQuestionIndex(quiz.questions.length);
    setActiveTab("questions");
  };

  const handleRemoveQuestion = (index: number) => {
    if (quiz.questions.length <= 1) {
      toast({
        title: "Cannot remove question",
        description: "A quiz must have at least one question.",
        variant: "destructive",
      });
      return;
    }

    setQuiz((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return {
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      };
    });

    if (activeQuestionIndex >= index && activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    setQuiz((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value,
        updatedAt: new Date().toISOString(),
      };

      if (field === "correctChoiceIndex") {
        const choiceIndex = value as number;
        if (choiceIndex >= 0 && choiceIndex < newQuestions[index].choices.length) {
          newQuestions[index].correctAnswer = newQuestions[index].choices[choiceIndex];
        }
      }

      return {
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleChoiceChange = (questionIndex: number, choiceIndex: number, value: string) => {
    setQuiz((prev) => {
      const newQuestions = [...prev.questions];
      const newChoices = [...newQuestions[questionIndex].choices];
      newChoices[choiceIndex] = value;

      if (choiceIndex === newQuestions[questionIndex].correctChoiceIndex) {
        newQuestions[questionIndex].correctAnswer = value;
      }

      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        choices: newChoices,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleAddChoice = (questionIndex: number) => {
    setQuiz((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        choices: [...newQuestions[questionIndex].choices, ""],
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleRemoveChoice = (questionIndex: number, choiceIndex: number) => {
    if (quiz.questions[questionIndex].choices.length <= 4) {
      toast({
        title: "Cannot remove choice",
        description: "A question must have at least 4 choices.",
        variant: "destructive",
      });
      return;
    }

    setQuiz((prev) => {
      const newQuestions = [...prev.questions];
      const newChoices = [...newQuestions[questionIndex].choices];
      newChoices.splice(choiceIndex, 1);

      let newCorrectChoiceIndex = newQuestions[questionIndex].correctChoiceIndex;
      if (choiceIndex === newCorrectChoiceIndex) {
        newCorrectChoiceIndex = 0;
        newQuestions[questionIndex].correctAnswer = newChoices[0];
      } else if (choiceIndex < newCorrectChoiceIndex) {
        newCorrectChoiceIndex--;
      }

      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        choices: newChoices,
        correctChoiceIndex: newCorrectChoiceIndex,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleAddQuestionTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newQuestionTopic.trim()) {
      e.preventDefault();
      const currentTopics = quiz.questions[activeQuestionIndex].questionTopicsList || [];
      
      if (!currentTopics.includes(newQuestionTopic.trim())) {
        setQuiz((prev) => {
          const newQuestions = [...prev.questions];
          newQuestions[activeQuestionIndex] = {
            ...newQuestions[activeQuestionIndex],
            questionTopicsList: [...currentTopics, newQuestionTopic.trim()],
            updatedAt: new Date().toISOString(),
          };
          return {
            ...prev,
            questions: newQuestions,
            updatedAt: new Date().toISOString(),
          };
        });
      }
      setNewQuestionTopic("");
    }
  };

  const handleRemoveQuestionTopic = (topicToRemove: string) => {
    setQuiz((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[activeQuestionIndex] = {
        ...newQuestions[activeQuestionIndex],
        questionTopicsList: newQuestions[activeQuestionIndex].questionTopicsList.filter(
          topic => topic !== topicToRemove
        ),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        questions: newQuestions,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleSave = () => {
    if (!quiz.quizTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a quiz title.",
        variant: "destructive",
      });
      setActiveTab("details");
      return;
    }

    const invalidQuestionIndex = quiz.questions.findIndex(q => !q.questionText.trim());
    if (invalidQuestionIndex !== -1) {
      toast({
        title: "Missing information",
        description: `Question ${invalidQuestionIndex + 1} is missing text.`,
        variant: "destructive",
      });
      setActiveTab("questions");
      setActiveQuestionIndex(invalidQuestionIndex);
      return;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const emptyChoiceIndex = question.choices.findIndex(c => !c.trim());
      if (emptyChoiceIndex !== -1) {
        toast({
          title: "Missing information",
          description: `Question ${i + 1} has an empty choice at position ${emptyChoiceIndex + 1}.`,
          variant: "destructive",
        });
        setActiveTab("questions");
        setActiveQuestionIndex(i);
        return;
      }
    }

    onSave(quiz);
    toast({
      title: `Quiz ${isEditing ? "updated" : "created"} successfully`,
      description: `"${quiz.quizTitle}" has been ${isEditing ? "updated" : "saved"}.`,
    });
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-border p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={handleCancel}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </button>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-border/50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">Questions ({quiz.questions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="animate-in fade-in-50 slide-in-from-left-5">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quizTitle">Quiz Title</Label>
              <Input
                id="quizTitle"
                name="quizTitle"
                value={quiz.quizTitle}
                onChange={handleQuizChange}
                placeholder="Enter quiz title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quizDescription">Description</Label>
              <Textarea
                id="quizDescription"
                name="quizDescription"
                value={quiz.quizDescription}
                onChange={handleQuizChange}
                placeholder="Enter quiz description"
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeChannel">YouTube Channel</Label>
              <Input
                id="youtubeChannel"
                name="youtubeChannel"
                value={quiz.youtubeChannel}
                onChange={handleQuizChange}
                placeholder="Enter YouTube channel"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateCategory">Category</Label>
              <Input
                id="templateCategory"
                name="templateCategory"
                value={quiz.templateCategory}
                onChange={handleQuizChange}
                placeholder="Enter quiz category"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quizLanguage">Language</Label>
              <Input
                id="quizLanguage"
                name="quizLanguage"
                value={quiz.quizLanguage}
                onChange={handleQuizChange}
                placeholder="Enter quiz language"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topics">Topics</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quiz.quizTopicsList.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="newTopic"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={handleAddTopic}
                placeholder="Type a topic and press Enter"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Press Enter to add a topic
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="readyForLive"
                checked={quiz.readyForLive}
                onCheckedChange={handleReadyForLiveChange}
              />
              <Label htmlFor="readyForLive">Ready for live</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="animate-in fade-in-50 slide-in-from-right-5">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage the questions for this quiz
                </p>
              </div>
              <Button 
                onClick={handleAddQuestion}
                className="bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 space-y-2">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Question List</h4>
                  <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                    {quiz.questions.map((question, index) => (
                      <button
                        key={question.id}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeQuestionIndex === index
                            ? "bg-primary/20 text-primary font-medium"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setActiveQuestionIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate max-w-[180px]">
                            {question.questionText || `Question ${index + 1}`}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveQuestion(index);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                {quiz.questions.length > 0 && (
                  <div className="space-y-4 bg-white border border-border rounded-lg p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${activeQuestionIndex}-text`}>Question Text</Label>
                      <Textarea
                        id={`question-${activeQuestionIndex}-text`}
                        value={quiz.questions[activeQuestionIndex].questionText}
                        onChange={(e) => handleQuestionChange(activeQuestionIndex, "questionText", e.target.value)}
                        placeholder="Enter question text"
                        className="w-full min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-${activeQuestionIndex}-image`}>Image URL (Optional)</Label>
                      <Input
                        id={`question-${activeQuestionIndex}-image`}
                        value={quiz.questions[activeQuestionIndex].questionImageUrl || ""}
                        onChange={(e) => handleQuestionChange(activeQuestionIndex, "questionImageUrl", e.target.value)}
                        placeholder="Enter image URL"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Answer Choices</Label>
                      <div className="space-y-3">
                        {quiz.questions[activeQuestionIndex].choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex items-center gap-2">
                            <div 
                              className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                                quiz.questions[activeQuestionIndex].correctChoiceIndex === choiceIndex
                                  ? "bg-primary border-primary text-white"
                                  : "border-muted-foreground"
                              }`}
                              onClick={() => handleQuestionChange(activeQuestionIndex, "correctChoiceIndex", choiceIndex)}
                            >
                              {quiz.questions[activeQuestionIndex].correctChoiceIndex === choiceIndex && (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                            <Input
                              value={choice}
                              onChange={(e) => handleChoiceChange(activeQuestionIndex, choiceIndex, e.target.value)}
                              placeholder={`Choice ${choiceIndex + 1}`}
                              className="flex-1"
                            />
                            <button
                              onClick={() => handleRemoveChoice(activeQuestionIndex, choiceIndex)}
                              className="text-muted-foreground hover:text-destructive"
                              disabled={quiz.questions[activeQuestionIndex].choices.length <= 4}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => handleAddChoice(activeQuestionIndex)}
                          className="w-full mt-2"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add Choice
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-${activeQuestionIndex}-explanation`}>Answer Explanation</Label>
                      <Textarea
                        id={`question-${activeQuestionIndex}-explanation`}
                        value={quiz.questions[activeQuestionIndex].answerExplanation}
                        onChange={(e) => handleQuestionChange(activeQuestionIndex, "answerExplanation", e.target.value)}
                        placeholder="Explain why the answer is correct"
                        className="w-full min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Question Topics</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {quiz.questions[activeQuestionIndex].questionTopicsList.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
                            {topic}
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestionTopic(topic)}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        value={newQuestionTopic}
                        onChange={(e) => setNewQuestionTopic(e.target.value)}
                        onKeyDown={handleAddQuestionTopic}
                        placeholder="Type a topic and press Enter"
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Press Enter to add a topic to this question
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${activeQuestionIndex}-difficulty`}>Difficulty Level</Label>
                        <select
                          id={`question-${activeQuestionIndex}-difficulty`}
                          value={quiz.questions[activeQuestionIndex].difficultyLevel}
                          onChange={(e) => handleQuestionChange(activeQuestionIndex, "difficultyLevel", e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`question-${activeQuestionIndex}-category`}>Category</Label>
                        <Input
                          id={`question-${activeQuestionIndex}-category`}
                          value={quiz.questions[activeQuestionIndex].templateCategory}
                          onChange={(e) => handleQuestionChange(activeQuestionIndex, "templateCategory", e.target.value)}
                          placeholder="Question category"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizForm;
