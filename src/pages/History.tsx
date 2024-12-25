import { PoemHistory } from "@/components/PoemHistory";
import { Heading, Subtitle } from "@/components/ui/typography";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 lg:p-12 space-y-10 bg-background text-foreground min-h-screen"
    >
      <div className="text-center space-y-2 mb-10">
        <Heading>Poetry Studio</Heading>
        <Subtitle className="text-primary">Create and preserve your poetic expressions</Subtitle>
      </div>

      <div className="max-w-4xl mx-auto">
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