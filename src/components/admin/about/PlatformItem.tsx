
import React from 'react';
import { cn } from "@/lib/utils";

interface PlatformItemProps {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const PlatformItem: React.FC<PlatformItemProps> = ({
  name,
  isSelected = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {name}
    </button>
  );
};

export default PlatformItem;
