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
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select card color">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${value.replace('/15', '/95')}`} />
            <span>{Object.entries(CARD_BACKGROUNDS).find(([_, v]) => v === value)?.[0]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CARD_BACKGROUNDS).map(([name, className]) => (
          <SelectItem key={name} value={className}>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${className.replace('/15', '/95')}`} />
              <span>{name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}