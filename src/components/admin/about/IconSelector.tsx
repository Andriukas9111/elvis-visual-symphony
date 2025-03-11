
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getIconNamesList, getDynamicIcon } from '@/utils/iconUtils';

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ onSelect, selectedIcon }) => {
  const iconNames = getIconNamesList();
  const [search, setSearch] = React.useState('');
  
  const filteredIcons = iconNames.filter(
    (name) => name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder="Search icons..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandEmpty>No icon found.</CommandEmpty>
      <ScrollArea className="h-64">
        <CommandGroup>
          {filteredIcons.map((name) => {
            const Icon = getDynamicIcon(name);
            return (
              <CommandItem
                key={name}
                value={name}
                onSelect={() => onSelect(name)}
                className={selectedIcon === name ? 'bg-accent' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{name}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

export const getIconPreview = (iconName: string, className = "h-4 w-4") => {
  if (!iconName) return null;
  const Icon = getDynamicIcon(iconName);
  return <Icon className={className} />;
};

export default IconSelector;
