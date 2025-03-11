
import React from 'react';
import { SelectItem } from "@/components/ui/select";
import * as LucideIcons from 'lucide-react';

// Create a list of icon options for the select component
const socialIcons = ['Camera', 'Video', 'Users', 'Eye'];
const accomplishmentIcons = ['Award', 'Clock', 'Heart', 'Trophy', 'Star', 'Target'];

export const iconOptions = [...socialIcons, ...accomplishmentIcons].map(name => ({
  value: name,
  label: name
}));

// Helper function to get an icon by name
export const getIconByName = (iconName: string, className = "h-4 w-4"): React.ReactNode => {
  // @ts-ignore: Dynamic access to LucideIcons
  const Icon = LucideIcons[iconName];
  if (Icon) {
    return <Icon className={className} />;
  }
  return null;
};

const IconSelector: React.FC = () => {
  return (
    <>
      {iconOptions.map(icon => (
        <SelectItem key={icon.value} value={icon.value}>
          <div className="flex items-center gap-2">
            <div className="bg-secondary/30 p-1 rounded-md">
              {getIconByName(icon.value)}
            </div>
            <span>{icon.label}</span>
          </div>
        </SelectItem>
      ))}
    </>
  );
};

export default IconSelector;
