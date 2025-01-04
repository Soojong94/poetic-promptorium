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
    const isRandomSaved = localStorage.getItem('isRandomBackground') === 'true';
    if (isRandomSaved) {
      return 'random';
    }
    return localStorage.getItem('background') || getRandomBackground();
  });

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
    if (newBackground !== 'random') {
      localStorage.setItem('background', newBackground);
    }
  };

  useEffect(() => {
    if (background !== 'random') {
      document.body.style.backgroundImage = `url(${background})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, [background]);

  return (
    <Router>
      <div className="fixed top-4 right-4 z-50">
        <BackgroundPicker
          currentBackground={background}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>
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