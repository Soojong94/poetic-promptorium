// components/EditPoemDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,  // 이 줄 추가
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ColorPicker";

interface EditPoemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, backgroundColor: string) => void;
  initialTitle: string;
  initialContent: string;
  initialBackgroundColor: string;
}

export function EditPoemDialog({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialContent,
  initialBackgroundColor,
}: EditPoemDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor);

  const handleSave = () => {
    onSave(title, content, backgroundColor);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/95 border-slate-800">
        <DialogHeader>
          <DialogTitle>시 수정</DialogTitle>
          <DialogDescription>
            시의 내용을 수정하실 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Card Color:</label>
            <ColorPicker
              value={backgroundColor}
              onChange={setBackgroundColor}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}