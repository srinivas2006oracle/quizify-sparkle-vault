
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import ViewQuiz from "./pages/ViewQuiz";
import GenerateGame from "./pages/GenerateGame";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/edit/:id" element={<EditQuiz />} />
            <Route path="/view/:id" element={<ViewQuiz />} />
            <Route path="/generate-game" element={<GenerateGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
