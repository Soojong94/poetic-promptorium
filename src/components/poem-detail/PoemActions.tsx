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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <Button
        variant="outline"
        onClick={handleBack}
        className="w-full md:w-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        목록으로
      </Button>
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <Button
          variant="outline"
          onClick={onEdit}
          className="w-full md:w-auto"
        >
          <Pencil className="w-4 h-4 mr-2" />
          수정
        </Button>
        <Button
          variant="outline"
          onClick={onAiEdit}
          className="w-full md:w-auto"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          AI 수정
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          className="w-full md:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  );
}