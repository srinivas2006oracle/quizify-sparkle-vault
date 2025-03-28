
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface QuizSearchProps {
  onSearch: (term: string) => void;
}

const QuizSearch = ({ onSearch }: QuizSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Create a memoized debounced search function
  const debouncedSearch = useCallback((term: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      console.log("Initiating search for term:", term);
      onSearch(term);
    }, 500); // Increased debounce time to 500ms
  }, [onSearch]);

  // Only search when the searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    
    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debouncedSearch]);

  const handleCreateNew = () => {
    navigate("/create");
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 animate-fade-in">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div 
          className={`relative flex-1 rounded-xl transition-all duration-300 ${
            isFocused 
              ? "ring-2 ring-primary/30 shadow-lg shadow-primary/5" 
              : "shadow-sm border border-border"
          }`}
        >
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search quizzes by title, description, or topic..."
            className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm rounded-xl focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchTerm && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <Button 
          onClick={handleCreateNew}
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Quiz</span>
        </Button>
      </div>
    </div>
  );
};

export default QuizSearch;
