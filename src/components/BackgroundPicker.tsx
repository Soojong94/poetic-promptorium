// components/BackgroundPicker.tsx
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { loadBackgroundImages } from '@/lib/storage';

interface BackgroundPickerProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
}

export function BackgroundPicker({ currentBackground, onBackgroundChange }: BackgroundPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBackgrounds() {
      setIsLoading(true);
      setError(null);
      try {
        const urls = await loadBackgroundImages();
        console.log('Loaded background URLs:', urls); // 디버깅용
        setBackgrounds(urls);
      } catch (error) {
        console.error('Error loading backgrounds:', error);
        setError('배경 이미지를 불러오는데 실패했습니다.');
        toast({
          title: "배경 로딩 실패",
          description: "배경 이미지를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBackgrounds();
  }, []);

  const handleBackgroundChange = (background: string) => {
    try {
      onBackgroundChange(background);

      toast({
        title: "배경 변경됨",
        description: "새로운 배경이 적용되었습니다.",
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Background change error:', error);
      toast({
        title: "에러",
        description: "배경 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="bg-gray-900/70"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed right-4 top-16 w-64 bg-background p-4 rounded-lg shadow-lg z-50 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">배경 선택</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-4">로딩중...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : backgrounds.length === 0 ? (
              <div className="text-center py-4">사용 가능한 배경이 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {backgrounds.map((url, index) => (
                  <Button
                    key={url}
                    variant="outline"
                    onClick={() => handleBackgroundChange(url)}
                    className="w-full"
                  >
                    {`Background ${index + 1}`}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}