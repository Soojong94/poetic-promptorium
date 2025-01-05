import { format } from "date-fns";
import { useEffect } from "react";

interface PoemContentProps {
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
}

export function PoemContent({ title, content, createdAt, imageUrl }: PoemContentProps) {
  useEffect(() => {
    if (imageUrl) {
      console.log('Image URL in PoemContent:', imageUrl);
    }
  }, [imageUrl]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 h-[70vh] overflow-y-auto">
      <h1 className="text-3xl font-medium break-words">{title}</h1>
      <p className="text-sm text-muted-foreground">
        {format(new Date(createdAt), "yyyy년 MM월 dd일 HH:mm:ss")}
      </p>
      <div className="mt-8 whitespace-pre-wrap leading-relaxed break-words">
        {content}
      </div>
      {imageUrl && (
        <div className="mt-8">
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-h-96 object-contain rounded-lg"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}