
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(value || 'lucide-star');
  
  useEffect(() => {
    setSelectedIcon(value || 'lucide-star');
  }, [value]);

  // Get all Lucide icons
  const lucideIconNames = Object.keys(LucideIcons)
    // Filter out non-icon exports
    .filter(name => 
      typeof LucideIcons[name as keyof typeof LucideIcons] === 'function' && 
      name !== 'createLucideIcon' && 
      name !== 'Icon'
    )
    // Convert PascalCase to kebab-case for consistency
    .map(name => {
      const kebabCase = name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      return `lucide-${kebabCase}`;
    });
  
  // Some common Font Awesome icons for legacy support
  const fontAwesomeIcons = [
    'fas fa-camera',
    'fas fa-user',
    'fas fa-heart',
    'fas fa-star',
    'fas fa-video',
    'fas fa-film',
    'fas fa-photo-video',
    'fab fa-youtube',
    'fab fa-instagram',
    'fab fa-tiktok',
    'fab fa-facebook',
    'fab fa-twitter'
  ];
  
  // Combine all icons
  const allIcons = [...lucideIconNames, ...fontAwesomeIcons];
  
  // Filter icons based on search term
  const filteredIcons = searchTerm 
    ? allIcons.filter(icon => icon.toLowerCase().includes(searchTerm.toLowerCase()))
    : allIcons;
  
  // Function to render the icon
  const renderIcon = (iconName: string) => {
    // Check if it's a Lucide icon
    if (iconName.startsWith('lucide-')) {
      const iconKey = iconName.replace('lucide-', '');
      // Convert kebab-case to PascalCase for Lucide icons
      const pascalCaseIcon = iconKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      const IconComponent = (LucideIcons as any)[pascalCaseIcon];
      
      if (IconComponent) {
        return <IconComponent size={16} />;
      }
    }
    
    // Fallback to Font Awesome or other class-based icons
    return <i className={iconName}></i>;
  };
  
  const handleIconChange = (newIcon: string) => {
    setSelectedIcon(newIcon);
    onChange(newIcon);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 flex items-center justify-center border border-input rounded bg-background">
          {renderIcon(selectedIcon)}
        </div>
        
        <Select value={selectedIcon} onValueChange={handleIconChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search icons..."
                className="w-full p-2 mb-2 border border-input rounded bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-5 gap-1 p-2">
              {filteredIcons.map((icon) => (
                <SelectItem 
                  key={icon} 
                  value={icon}
                  className="flex items-center justify-center h-10 w-10 border border-input rounded hover:bg-accent cursor-pointer"
                >
                  {renderIcon(icon)}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IconSelector;
