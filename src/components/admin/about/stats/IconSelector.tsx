
import React from 'react';
import { SelectItem } from "@/components/ui/select";
import * as LucideIcons from 'lucide-react';

// Extract all icon components from lucide-react
const allIconNames = Object.keys(LucideIcons).filter(
  key => key !== 'createLucideIcon' && key !== 'default'
);

// Create a list of icon options for the select component
export const iconOptions = allIconNames.map(name => ({
  value: name,
  label: name
}));

export const getAllIcons = () => {
  const icons: { [key: string]: React.ReactNode } = {};
  
  allIconNames.forEach(name => {
    // @ts-ignore: Dynamic access to LucideIcons
    const Icon = LucideIcons[name];
    if (Icon) {
      icons[name] = <Icon />;
    }
  });
  
  return icons;
};

export const IconSelector: React.FC = () => {
  return (
    <>
      {iconOptions.map(icon => (
        <SelectItem key={icon.value} value={icon.value} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="bg-secondary/30 p-1 rounded-md">
              {React.createElement(
                // @ts-ignore: Dynamic access to LucideIcons
                LucideIcons[icon.value],
                { className: "h-4 w-4" }
              )}
            </div>
            <span>{icon.label}</span>
          </div>
        </SelectItem>
      ))}
    </>
  );
};
