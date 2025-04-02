
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Database, PlayCircle } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

const Header = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1">
            <Database className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Quiz Builder</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/generate-game")}
            className="gap-1"
          >
            <PlayCircle className="h-4 w-4" />
            {!isMobile && "Generate Game"}
          </Button>
          
          <Button
            onClick={() => navigate("/create")}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            {!isMobile && "Create Quiz"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
