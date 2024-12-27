// PoemContent.tsx
import { format } from "date-fns";

interface PoemContentProps {
  title: string;
  content: string;
  createdAt: string;
}

export function PoemContent({ title, content, createdAt }: PoemContentProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 h-[70vh] overflow-y-auto">
      <h1 className="text-3xl font-medium break-words">{title}</h1>
      <p className="text-sm text-muted-foreground">
        {format(new Date(createdAt), "yyyy년 MM월 dd일 HH:mm:ss")}
      </p>
      <div className="mt-8 whitespace-pre-wrap leading-relaxed break-words">
        {content}
      </div>
    </div>
  );
}