
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(value || 'lucide-camera');
  
  useEffect(() => {
    setSelectedIcon(value || 'lucide-camera');
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
  
  // Function to render the icon preview
  const renderIcon = (iconName: string) => {
    // Check if it's a Lucide icon
    if (iconName.startsWith('lucide-')) {
      const iconKey = iconName.replace('lucide-', '');
      // Convert kebab-case to PascalCase for Lucide icons
      const pascalCaseIcon = iconKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      const IconComponent = LucideIcons[pascalCaseIcon as keyof typeof LucideIcons] as React.FC<any>;
      
      if (IconComponent) {
        return <IconComponent size={16} />;
      }
      
      // Return a placeholder for the icon name if component not found
      return <span className="text-xs">{iconName}</span>;
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
        <div className="w-10 h-10 flex items-center justify-center border border-input rounded bg-background">
          {renderIcon(selectedIcon)}
        </div>
        
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search icons..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      
      <div className="mt-2 mb-4 grid grid-cols-6 gap-2 h-[180px] overflow-y-auto border border-input rounded p-2">
        {filteredIcons.length > 0 ? (
          filteredIcons.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => handleIconChange(icon)}
              className={`flex items-center justify-center h-10 w-full border border-input rounded hover:bg-accent cursor-pointer ${
                selectedIcon === icon ? 'bg-elvis-pink/20 border-elvis-pink' : ''
              }`}
            >
              {renderIcon(icon)}
            </button>
          ))
        ) : (
          <div className="col-span-6 py-4 text-center text-muted-foreground">
            No icons found matching '{searchTerm}'
          </div>
        )}
      </div>
      
      <div>
        <Label>Icon Name</Label>
        <Input 
          value={selectedIcon} 
          onChange={(e) => handleIconChange(e.target.value)} 
          className="bg-elvis-medium" 
        />
        <p className="text-xs text-muted-foreground mt-1">
          For Lucide icons use format 'lucide-icon-name', for Font Awesome icons use 'fab/fas/far fa-icon-name'
        </p>
      </div>
    </div>
  );
};

export default IconSelector;
