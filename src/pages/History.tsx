import { PoemHistory } from "@/components/PoemHistory";
import { Heading, Subtitle } from "@/components/ui/typography";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { RandomBackground } from "@/components/RandomBackground";

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      // 아래 클래스에서 bg-background 제거
      className="p-6 md:p-8 lg:p-12 space-y-10 text-foreground"
    >
      <RandomBackground />
      <div className="text-center space-y-2 mb-10">
        {/* 타이틀 부분 배경도 투명하게 */}
        <Heading className="text-white">Poetry Studio</Heading>
        <Subtitle className="text-gray-300">Create and preserve your poetic expressions</Subtitle>
      </div>

      <div className="max-w-4xl mx-auto backdrop-blur-none"> {/* backdrop-blur 제거 */}
        <Tabs defaultValue="history" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="editor"
              onClick={() => navigate("/")}
              className={location.pathname === "/" ? "data-[state=active]" : ""}
            >
              Write New Poem
            </TabsTrigger>
            <TabsTrigger
              value="history"
              onClick={() => navigate("/history")}
              className={location.pathname === "/history" ? "data-[state=active]" : ""}
            >
              View History
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <PoemHistory />
      </div>
    </motion.div>
  );
}