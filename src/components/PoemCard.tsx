// components/PoemCard.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PoemCardProps {
  title: string;
  content: string;
  date: string;
  backgroundColor: string;
  className?: string;
  onClick?: () => void;
  imageUrl?: string;
}

export function PoemCard({
  title,
  content,
  date,
  backgroundColor,
  className,
  imageUrl,
  onClick
}: PoemCardProps) {
  const formattedDate = format(new Date(date), "yyyy년 MM월 dd일 HH:mm:ss");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        rotate: -2,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 12,
          duration: 0.2
        }
      }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={cn(
        "flex flex-col h-full p-5 rounded-lg text-card-foreground border border-border/30 hover:border-border/70 transition-all cursor-pointer will-change-transform",
        "backdrop-blur-md bg-opacity-20", // 추가된 부분
        backgroundColor,
        className
      )}
    >
      <div className="relative z-10 bg-opacity-20">
        <h3 className="text-lg font-medium mb-3 line-clamp-2 min-h-[3rem] transform-gpu text-white">
          {title}
        </h3>
        <p className="text-base text-gray-200 line-clamp-3 min-h-[4.5rem] flex-grow transform-gpu">
          {content}
        </p>
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
        <p className="text-sm text-gray-300 mt-3 transform-gpu">
          {formattedDate}
        </p>
      </div>
    </motion.div>
  );
}