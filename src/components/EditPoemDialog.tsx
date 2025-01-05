import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ColorPicker";
import { Upload } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { toast } from "@/components/ui/use-toast";

interface EditPoemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, backgroundColor: string, imageUrl: string) => void;
  initialTitle: string;
  initialContent: string;
  initialBackgroundColor: string;
  initialImageUrl?: string;
}

export function EditPoemDialog({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialContent,
  initialBackgroundColor,
  initialImageUrl = "",
}: EditPoemDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    onSave(title, content, backgroundColor, imageUrl);
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB 제한
      toast({
        title: "파일 크기 초과",
        description: "5MB 이하의 이미지만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setImageUrl(url);
      toast({
        title: "이미지 업로드 완료",
        description: "이미지가 성공적으로 업로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "업로드 실패",
        description: "이미지 업로드에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Image:</label>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="relative overflow-hidden"
                  disabled={isUploading}
                >
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Upload className="w-4 h-4 mr-2" />
                  {imageUrl ? "Change Image" : "Upload Image"}
                </Button>
                {imageUrl && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setImageUrl("")}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="max-h-48 rounded-lg object-cover"
              />
            </div>
          )}
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