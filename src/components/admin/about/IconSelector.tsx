
import React, { useState, useEffect } from 'react';
import { 
  Camera, Code, Film, Video, Users, Heart, Award, TrendingUp, Gift, 
  Tv, Map, Globe, Music, Play, Mic, Star, Pen, Layout, Image, FileText,
  Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, Youtube,
  Database, Monitor, Cloud, Compass, Edit, Zap, Aperture, Square, PenTool,
  Layers, Coffee, Feather, MessageCircle, BookOpen, Upload, Download, Send,
  Briefcase, Calendar, CheckCircle, Clock, DollarSign, Home, Settings, Search,
  ShoppingBag, ShoppingCart, Smile, ThumbsUp, User, UserPlus, UserCheck,
  Trophy, Target, Zap as ZapAlt
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface IconOption {
  name: string;
  icon: React.ReactNode;
  className: string;
}

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>(value || "");
  const [open, setOpen] = useState(false);
  
  const iconOptions: IconOption[] = [
    { name: "lucide-camera", icon: <Camera />, className: "lucide-camera" },
    { name: "lucide-code", icon: <Code />, className: "lucide-code" },
    { name: "lucide-film", icon: <Film />, className: "lucide-film" },
    { name: "lucide-video", icon: <Video />, className: "lucide-video" },
    { name: "lucide-users", icon: <Users />, className: "lucide-users" },
    { name: "lucide-heart", icon: <Heart />, className: "lucide-heart" },
    { name: "lucide-award", icon: <Award />, className: "lucide-award" },
    { name: "lucide-trending-up", icon: <TrendingUp />, className: "lucide-trending-up" },
    { name: "lucide-gift", icon: <Gift />, className: "lucide-gift" },
    { name: "lucide-tv", icon: <Tv />, className: "lucide-tv" },
    { name: "lucide-map", icon: <Map />, className: "lucide-map" },
    { name: "lucide-globe", icon: <Globe />, className: "lucide-globe" },
    { name: "lucide-music", icon: <Music />, className: "lucide-music" },
    { name: "lucide-play", icon: <Play />, className: "lucide-play" },
    { name: "lucide-mic", icon: <Mic />, className: "lucide-mic" },
    { name: "lucide-star", icon: <Star />, className: "lucide-star" },
    { name: "lucide-pen", icon: <Pen />, className: "lucide-pen" },
    { name: "lucide-layout", icon: <Layout />, className: "lucide-layout" },
    { name: "lucide-image", icon: <Image />, className: "lucide-image" },
    { name: "lucide-file-text", icon: <FileText />, className: "lucide-file-text" },
    { name: "lucide-mail", icon: <Mail />, className: "lucide-mail" },
    { name: "lucide-phone", icon: <Phone />, className: "lucide-phone" },
    { name: "lucide-map-pin", icon: <MapPin />, className: "lucide-map-pin" },
    { name: "lucide-instagram", icon: <Instagram />, className: "lucide-instagram" },
    { name: "lucide-facebook", icon: <Facebook />, className: "lucide-facebook" },
    { name: "lucide-twitter", icon: <Twitter />, className: "lucide-twitter" },
    { name: "lucide-linkedin", icon: <Linkedin />, className: "lucide-linkedin" },
    { name: "lucide-youtube", icon: <Youtube />, className: "lucide-youtube" },
    { name: "lucide-database", icon: <Database />, className: "lucide-database" },
    { name: "lucide-monitor", icon: <Monitor />, className: "lucide-monitor" },
    { name: "lucide-cloud", icon: <Cloud />, className: "lucide-cloud" },
    { name: "lucide-compass", icon: <Compass />, className: "lucide-compass" },
    { name: "lucide-edit", icon: <Edit />, className: "lucide-edit" },
    { name: "lucide-zap", icon: <Zap />, className: "lucide-zap" },
    { name: "lucide-aperture", icon: <Aperture />, className: "lucide-aperture" },
    { name: "lucide-square", icon: <Square />, className: "lucide-square" },
    { name: "lucide-pen-tool", icon: <PenTool />, className: "lucide-pen-tool" },
    { name: "lucide-layers", icon: <Layers />, className: "lucide-layers" },
    { name: "lucide-coffee", icon: <Coffee />, className: "lucide-coffee" },
    { name: "lucide-feather", icon: <Feather />, className: "lucide-feather" },
    { name: "lucide-message-circle", icon: <MessageCircle />, className: "lucide-message-circle" },
    { name: "lucide-book-open", icon: <BookOpen />, className: "lucide-book-open" },
    { name: "lucide-upload", icon: <Upload />, className: "lucide-upload" },
    { name: "lucide-download", icon: <Download />, className: "lucide-download" },
    { name: "lucide-send", icon: <Send />, className: "lucide-send" },
    { name: "lucide-briefcase", icon: <Briefcase />, className: "lucide-briefcase" },
    { name: "lucide-calendar", icon: <Calendar />, className: "lucide-calendar" },
    { name: "lucide-check-circle", icon: <CheckCircle />, className: "lucide-check-circle" },
    { name: "lucide-clock", icon: <Clock />, className: "lucide-clock" },
    { name: "lucide-dollar-sign", icon: <DollarSign />, className: "lucide-dollar-sign" },
    { name: "lucide-home", icon: <Home />, className: "lucide-home" },
    { name: "lucide-settings", icon: <Settings />, className: "lucide-settings" },
    { name: "lucide-search", icon: <Search />, className: "lucide-search" },
    { name: "lucide-shopping-bag", icon: <ShoppingBag />, className: "lucide-shopping-bag" },
    { name: "lucide-shopping-cart", icon: <ShoppingCart />, className: "lucide-shopping-cart" },
    { name: "lucide-smile", icon: <Smile />, className: "lucide-smile" },
    { name: "lucide-thumbs-up", icon: <ThumbsUp />, className: "lucide-thumbs-up" },
    { name: "lucide-user", icon: <User />, className: "lucide-user" },
    { name: "lucide-user-plus", icon: <UserPlus />, className: "lucide-user-plus" },
    { name: "lucide-user-check", icon: <UserCheck />, className: "lucide-user-check" },
    { name: "lucide-trophy", icon: <Trophy />, className: "lucide-trophy" },
    { name: "lucide-target", icon: <Target />, className: "lucide-target" },
    { name: "lucide-zap-alt", icon: <ZapAlt />, className: "lucide-zap-alt" },
  ];
  
  // Filter icons based on search input
  const filteredIcons = iconOptions.filter(
    icon => icon.name.toLowerCase().includes(search.toLowerCase())
  );
  
  // Function to render the currently selected icon
  const renderSelectedIcon = () => {
    const selectedOption = iconOptions.find(option => option.className === selectedIcon);
    if (selectedOption) {
      return React.cloneElement(selectedOption.icon as React.ReactElement, {
        className: "h-5 w-5"
      });
    }
    return <div className="h-5 w-5 border border-dashed border-gray-400 rounded flex items-center justify-center text-xs">?</div>;
  };
  
  const handleSelect = (iconClass: string) => {
    console.log('Icon selected:', iconClass);
    setSelectedIcon(iconClass);
    onChange(iconClass);
    setOpen(false);
  };
  
  // Update the internal state when the external value changes
  useEffect(() => {
    console.log('IconSelector received value:', value);
    setSelectedIcon(value);
  }, [value]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-elvis-medium hover:bg-elvis-light border-elvis-light flex items-center justify-between w-full"
          onClick={() => console.log('Icon selector opened with current value:', selectedIcon)}
        >
          <span className="flex items-center">
            <span className="mr-2">{renderSelectedIcon()}</span>
            <span className="truncate">
              {selectedIcon ? selectedIcon.replace('lucide-', '') : 'Select an icon'}
            </span>
          </span>
          <span className="text-xs opacity-70">▼</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 bg-elvis-medium border-elvis-light"
          />
          <ScrollArea className="h-[300px] rounded-md border p-2">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2">
              {filteredIcons.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className={`h-16 flex flex-col items-center justify-center p-2 gap-1 ${
                    selectedIcon === option.className ? 'border-elvis-pink bg-elvis-pink/20' : 'border-elvis-light'
                  }`}
                  onClick={() => handleSelect(option.className)}
                >
                  <div>{option.icon}</div>
                  <span className="text-[10px] truncate w-full text-center">
                    {option.name.replace('lucide-', '')}
                  </span>
                </Button>
              ))}
              {filteredIcons.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No icons found matching your search
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconSelector;
