
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Eye, Tag, Calendar } from "lucide-react";
import { Quiz } from "@/types/quiz";
import { formatDate } from "@/utils/quizUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface QuizListProps {
  quizzes: Quiz[];
  onDelete: (id: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/view/${id}`);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirmed = () => {
    if (deletingId) {
      onDelete(deletingId);
      toast({
        title: "Quiz deleted successfully",
        description: "The quiz has been permanently removed.",
        variant: "default"
      });
      setDeletingId(null);
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="w-full bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-border p-8 text-center animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">No quizzes found</h2>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any quizzes matching your search criteria. Try a different search or create a new quiz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="overflow-hidden bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 text-left">
                <th className="px-6 py-4 font-medium text-muted-foreground">Title</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Description</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden lg:table-cell">Topics</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden lg:table-cell">Questions</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Updated</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center">
                      <div 
                        className={`w-2 h-2 rounded-full mr-2 ${
                          quiz.readyForLive ? "bg-green-500" : "bg-amber-500"
                        }`} 
                      />
                      {quiz.quizTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                    <div className="max-w-xs truncate">{quiz.quizDescription}</div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {quiz.quizTopicsList.slice(0, 2).map((topic, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {topic}
                        </span>
                      ))}
                      {quiz.quizTopicsList.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          +{quiz.quizTopicsList.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-center">
                    <span className="rounded-full bg-muted px-3 py-1 text-sm">
                      {quiz.questions.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-muted-foreground text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(quiz.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(quiz.id)}
                        className="button-icon text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="View quiz"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(quiz.id)}
                        className="button-icon text-muted-foreground hover:text-primary hover:bg-primary/10"
                        aria-label="Edit quiz"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="button-icon text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            aria-label="Delete quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glassmorphic">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the quiz "{quiz.quizTitle}" and all its questions. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border border-border/50">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(quiz.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// For empty state
const Search = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default QuizList;
