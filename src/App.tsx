// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import History from "./pages/History";
import PoemDetail from "./pages/PoemDetail";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import { BACKGROUND_OPTIONS, getRandomBackground } from "@/lib/constants";
import "./App.css";

function App() {
  const [background, setBackground] = useState(() => {
    return localStorage.getItem('background') || getRandomBackground();
  });

  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
    localStorage.setItem('background', background);
  }, [background]);

  return (
    <Router>
      <div className="fixed top-4 right-4 z-50">
        <BackgroundPicker
          currentBackground={background}
          onBackgroundChange={setBackground}
        />
      </div>
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      />
      <div className="relative">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/poem/:id" element={<PoemDetail />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;