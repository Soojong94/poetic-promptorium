import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { BACKGROUND_OPTIONS } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

interface BackgroundPickerProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
}

export function BackgroundPicker({ currentBackground, onBackgroundChange }: BackgroundPickerProps) {
  const handleBackgroundChange = (value: string) => {
    try {
      onBackgroundChange(value);

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
    <div className="bg-gray-900/70 p-2 rounded-lg">
      <Select
        value={currentBackground}
        onValueChange={handleBackgroundChange}
      >
        <SelectTrigger className="w-[200px] bg-transparent border-gray-700">
          <SelectValue placeholder="배경 선택" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BACKGROUND_OPTIONS).map(([name, path]) => (
            <SelectItem key={name} value={path}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}