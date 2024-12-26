import { Button } from "@/components/ui/button";
import { ArrowLeft, Wand2, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PoemActionsProps {
  onBack: () => void;
  onEdit: () => void;
  onAiEdit: () => void;
  onDelete: () => void;
  page: string;
}

export function PoemActions({ onBack, onEdit, onAiEdit, onDelete, page }: PoemActionsProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/history?page=${page}`);
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 w-full">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            onClick={onEdit}
            className="w-full"
          >
            <Pencil className="w-4 h-4 mr-2" />
            수정
          </Button>
          <Button
            variant="outline"
            onClick={onAiEdit}
            className="w-full"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI 수정
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}