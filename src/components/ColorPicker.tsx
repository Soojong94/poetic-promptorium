// components/ColorPicker.tsx
import { CARD_BACKGROUNDS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";  // 경로를 @/components/ui/select로 수정

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select card color" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CARD_BACKGROUNDS).map(([name, className]) => (
          <SelectItem key={name} value={className}>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${className}`} />
              <span>{name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}