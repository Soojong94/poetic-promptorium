// components/BackgroundPicker.tsx
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
// import { useRandomBackground } from '@/hooks/useRandomBackground';
import { BACKGROUND_OPTIONS } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface BackgroundPickerProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
}

// components/BackgroundPicker.tsx
export function BackgroundPicker({ currentBackground, onBackgroundChange }: BackgroundPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const [isRandom, setIsRandom] = useRandomBackground();

  const handleBackgroundChange = (background: string) => {
    try {
      if (background === 'random') {
        //setIsRandom(true);
        localStorage.setItem('isRandomBackground', 'true');
      } else {
        // setIsRandom(false);
        localStorage.setItem('isRandomBackground', 'false');
        onBackgroundChange(background);
      }

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

  const content = (
    <div className="space-y-4">
      {/* Random 버튼 제거 */}
      {Object.entries(BACKGROUND_OPTIONS).map(([name, path]) => (
        name !== 'Random' && (
          <Button
            key={name}
            variant="outline"
            onClick={() => handleBackgroundChange(path)}
            className="w-full"
          >
            {name}
          </Button>
        )
      ))}
    </div>
  );

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
            {content}
          </div>
        </>
      )}
    </div>
  );
}