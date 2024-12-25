import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BACKGROUND_OPTIONS, getRandomBackground } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

export function BackgroundPicker() {
  const [selectedBackground, setSelectedBackground] = useState(() => {
    return localStorage.getItem('background') || BACKGROUND_OPTIONS.Random;
  });

  // 컴포넌트 마운트 시 저장된 배경 적용
  useEffect(() => {
    const savedBackground = localStorage.getItem('background');
    if (savedBackground) {
      applyBackground(savedBackground);
    }
  }, []);

  const applyBackground = (background: string) => {
    const backgroundUrl = background === 'random' ? getRandomBackground() : background;
    document.body.style.backgroundImage = `url(${backgroundUrl})`;
  };

  const handleApplyBackground = () => {
    try {
      applyBackground(selectedBackground);
      localStorage.setItem('background', selectedBackground);

      toast({
        title: "배경 변경됨",
        description: "새로운 배경이 적용되었습니다.",
      });
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
    <div className="flex items-center gap-2 w-full max-w-xs">
      <Select
        value={selectedBackground}
        onValueChange={setSelectedBackground}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select background" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BACKGROUND_OPTIONS).map(([name, path]) => (
            <SelectItem key={name} value={path}>
              <span>{name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleApplyBackground}
        variant="secondary"
        className="whitespace-nowrap flex-shrink-0"
      >
        이 배경 사용하기
      </Button>
    </div>
  );
}