
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

// Define icon categories for better organization
export interface IconOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface IconCategory {
  category: string;
  icons: IconOption[];
}

// Helper function to get an icon by name
export const getIconByName = (iconName: string, className = "h-4 w-4"): React.ReactNode => {
  // @ts-ignore: Dynamic access to LucideIcons
  const Icon = LucideIcons[iconName];
  if (Icon) {
    return <Icon className={className} />;
  }
  return null;
};

// Categorize icons into groups
const categorizeIcons = (): IconCategory[] => {
  // Basic categories for common icons
  const categories: Record<string, string[]> = {
    "Media & Communication": [
      "Camera", "Video", "Mail", "MessageCircle", "Phone", "BellRing", "Speaker",
      "Music", "Mic", "Headphones", "Radio", "Tv", "Film"
    ],
    "Business & Finance": [
      "Briefcase", "DollarSign", "CreditCard", "PieChart", "BarChart", "TrendingUp",
      "Building", "Calendar", "Clock", "Award", "Activity", "FileText"
    ],
    "Social Media": [
      "Instagram", "Facebook", "Twitter", "Youtube", "Linkedin", "Share2", "Send",
      "Globe", "Rss", "Link"
    ],
    "User Interface": [
      "Home", "Search", "Settings", "CheckCircle", "XCircle", "AlertCircle", "Info",
      "Lock", "Unlock", "Eye", "EyeOff", "Layers", "Filter", "Menu"
    ],
    "Weather & Nature": [
      "Sun", "Moon", "Cloud", "CloudRain", "Umbrella", "Wind", "Thermometer",
      "Droplet", "Zap", "Sunrise", "Sunset", "Flower", "Leaf"
    ],
    "Transportation": [
      "Car", "Truck", "Bus", "Train", "Plane", "Ship", "Bicycle", "Navigation",
      "MapPin", "Map", "Compass"
    ],
    "Technology": [
      "Smartphone", "Tablet", "Laptop", "Monitor", "Server", "Wifi", "Bluetooth",
      "Database", "HardDrive", "Code", "Terminal", "Command", "Cpu"
    ],
    "Shopping & E-commerce": [
      "ShoppingCart", "ShoppingBag", "Package", "Gift", "Tag", "Bookmark", "Percent"
    ],
    "Other Icons": [] // For all other icons
  };

  // Initialize result array with empty icon arrays
  const result: IconCategory[] = Object.keys(categories).map(category => ({
    category,
    icons: []
  }));

  // Add a category for "Other Icons" to catch any that don't match predefined categories
  const otherIconsCategory = result.find(cat => cat.category === "Other Icons")!;

  // Populate icon categories
  allIconNames.forEach(name => {
    // @ts-ignore: Dynamic access to LucideIcons
    const Icon = LucideIcons[name];
    const iconOption: IconOption = {
      value: name,
      label: name,
      icon: <Icon className="h-4 w-4" />
    };

    // Try to find a category that includes this icon
    let categorized = false;
    for (const categoryKey in categories) {
      if (categories[categoryKey].includes(name)) {
        const category = result.find(cat => cat.category === categoryKey)!;
        category.icons.push(iconOption);
        categorized = true;
        break;
      }
    }

    // If not found in any category, add to "Other Icons"
    if (!categorized) {
      otherIconsCategory.icons.push(iconOption);
    }
  });

  // Filter out empty categories and sort icons alphabetically within each category
  return result
    .filter(category => category.icons.length > 0)
    .map(category => ({
      ...category,
      icons: category.icons.sort((a, b) => a.label.localeCompare(b.label))
    }));
};

export const iconOptionsGrouped = categorizeIcons();

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
