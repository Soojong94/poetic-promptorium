import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getRandomCardBackground } from "@/lib/randomStyles";
import { useEffect, useState } from "react";

interface PoemCardProps {
  title: string;
  content: string;
  date: string;
  className?: string;
  onClick?: () => void;
}

export function PoemCard({
  title,
  content,
  date,
  className,
  onClick
}: PoemCardProps) {
  const [cardBackground, setCardBackground] = useState("");
  
  useEffect(() => {
    setCardBackground(getRandomCardBackground());
  }, []);

  const formattedDate = format(new Date(date), "yyyy년 MM월 dd일 HH:mm:ss");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        rotate: -4,
        transition: {
          type: "spring",
          stiffness: 1000,
          damping: 50,
          duration: 0.2
        }
      }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={cn(
        "flex flex-col h-full p-5 rounded-lg text-card-foreground border border-border/50 hover:border-border transition-all cursor-pointer will-change-transform",
        "hover:shadow-lg backdrop-blur-none",
        cardBackground,
        className
      )}
    >
      <div className="relative z-10">
        <h3 className="text-lg font-medium mb-3 line-clamp-2 min-h-[3rem] transform-gpu">{title}</h3>
        <p className="text-base text-muted-foreground line-clamp-3 min-h-[4.5rem] flex-grow transform-gpu">{content}</p>
        <p className="text-sm text-muted-foreground mt-3 transform-gpu">{formattedDate}</p>
      </div>
    </motion.div>
  );
}