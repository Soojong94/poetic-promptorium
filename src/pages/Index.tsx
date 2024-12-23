import { motion } from "framer-motion";
import { PoemEditor } from "@/components/PoemEditor";
import { Heading, Subtitle } from "@/components/ui/typography";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 md:p-10 lg:p-7 space-y-12 bg-background text-foreground" // space-y와 패딩 값 축소
    >
      <div className="text-center space-y-4 mb-10">
        <Heading className="text-white">Poetry Studio</Heading>
        <Subtitle className="text-gray-300">Create and preserve your poetic expressions</Subtitle>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="editor" className="w-full mb-6">
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
        <PoemEditor />
      </div>
    </motion.div>
  );
}

export default Index;