
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavGroupProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
};

const NavGroup: React.FC<NavGroupProps> = ({ 
  title, 
  children,
  defaultOpen = true,
  collapsed = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // If collapsed, we don't show the title or the expand/collapse UI
  if (collapsed) {
    return (
      <div className="py-1">
        {children}
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs uppercase tracking-wider text-white/50 font-medium hover:text-white/70 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown 
          size={14} 
          className={cn(
            "transition-transform duration-200",
            isOpen ? "transform rotate-0" : "transform rotate-180"
          )}
        />
      </button>
      
      <div className={cn(
        "space-y-1 overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        {children}
      </div>
    </div>
  );
};

export default NavGroup;
