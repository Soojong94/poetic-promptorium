import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import History from "./pages/History";
import PoemDetail from "./pages/PoemDetail";
import { Toaster } from "@/components/ui/toaster";
import { getRandomBackground } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";  // supabase import 추가
import "./App.css";

// Router 밖에서는 useLocation을 사용할 수 없으므로 AppContent 컴포넌트 생성
function AppContent() {
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState(getRandomBackground());

  useEffect(() => {
    const loadBackgroundFromPath = async () => {
      if (location.pathname.startsWith('/poem/')) {
        const poemId = location.pathname.split('/')[2];
        const { data } = await supabase
          .from('poems')
          .select('background_image')
          .eq('id', poemId)
          .single();

        if (data?.background_image) {
          setBackgroundImage(data.background_image);
        }
      } else {
        setBackgroundImage(getRandomBackground());
      }
    };

    loadBackgroundFromPath();
  }, [location]);

  return (
    <div
      className="min-h-screen w-full fixed inset-0"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        zIndex: -1
      }}
    >
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/poem/:id" element={<PoemDetail />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;