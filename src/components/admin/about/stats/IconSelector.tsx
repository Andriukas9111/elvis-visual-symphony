
import React from 'react';
import { Check } from 'lucide-react';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  // This is a placeholder component as the about section has been removed
  return (
    <div>
      <p className="text-sm text-red-500">Icon selector has been removed with the About section</p>
    </div>
  );
};

export default IconSelector;
