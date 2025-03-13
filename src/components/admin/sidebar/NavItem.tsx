
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  currentTab: string;
  onClick: (value: string) => void;
  badgeCount?: number;
  badgeColor?: string;
  collapsed?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  value, 
  currentTab, 
  onClick, 
  badgeCount,
  badgeColor = "bg-elvis-pink",
  collapsed = false
}) => {
  const isActive = currentTab === value;
  
  const navContent = (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors",
        "hover:bg-white/10",
        isActive 
          ? "bg-white/15 text-white font-medium" 
          : "text-white/70"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-grow text-left">{label}</span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <Badge 
              className={cn("text-xs rounded-full", badgeColor)} 
              variant="outline"
            >
              {badgeCount}
            </Badge>
          )}
          {isActive && <ChevronRight size={16} className="flex-shrink-0 text-white/70" />}
        </>
      )}
    </button>
  );
  
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            {navContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-elvis-dark border-elvis-light text-white">
            {label}
            {badgeCount !== undefined && badgeCount > 0 && (
              <Badge className={cn("ml-2 text-xs rounded-full", badgeColor)} variant="outline">
                {badgeCount}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return navContent;
};

export default NavItem;
