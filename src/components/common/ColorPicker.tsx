
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[4rem] h-[2rem] p-0"
            style={{ background: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={color} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
