import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Pencil, Trash2, Wand2 } from "lucide-react";
import { format } from "date-fns";

interface PoemCardProps {
  title: string;
  content: string;
  date: string;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onAiEdit?: () => void;
  onClick?: () => void;
}

export function PoemCard({ 
  title, 
  content, 
  date, 
  className, 
  onEdit, 
  onDelete, 
  onAiEdit,
  onClick 
}: PoemCardProps) {
  const formattedDate = format(new Date(date), "yyyy년 MM월 dd일 HH:mm:ss");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col h-full p-6 rounded-lg bg-card text-card-foreground border border-border/50 hover:border-border transition-all min-w-[400px]",
        className
      )}
    >
      <div onClick={onClick} className="flex-1 cursor-pointer">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">{content}</p>
        <p className="text-xs text-muted-foreground mt-4">{formattedDate}</p>
      </div>
      
      <div className="flex flex-wrap justify-end gap-2 mt-4 pt-4 border-t border-border/50">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-1" />
          수정
        </Button>
        <Button variant="outline" size="sm" onClick={onAiEdit}>
          <Wand2 className="w-4 h-4 mr-1" />
          AI 수정
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-1" />
          삭제
        </Button>
      </div>
    </motion.div>
  );
}