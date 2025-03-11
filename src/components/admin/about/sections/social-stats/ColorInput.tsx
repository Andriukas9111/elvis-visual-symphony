
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorInputProps } from './types';

const ColorInput: React.FC<ColorInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '#FFFFFF' 
}) => {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: value }}
        />
        <Input
          value={value || placeholder}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default ColorInput;
