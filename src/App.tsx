import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import PoemDetail from "./pages/PoemDetail";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/history" element={<History />} />
        <Route path="/poem/:id" element={<PoemDetail />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;