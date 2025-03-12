import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';
import { Button } from '@/components/ui/button';

interface ConnectWithMeProps {
  isInView: boolean;
}

// Custom TikTok icon component
const CustomTiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    <path d="M15 8v8"/>
    <path d="M9 12a4 4 0 0 0 6 3.6V5.5A5.5 5.5 0 0 0 20.5 11"/>
  </svg>
);

const ConnectWithMe: React.FC<ConnectWithMeProps> = ({ isInView }) => {
  const { data: socialPlatforms, isLoading } = useSocialMedia();
  
  // Default platforms if none found in database
  const defaultPlatforms = [
    { id: '1', name: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', color: 'bg-gradient-to-br from-pink-500 to-purple-600' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com', icon: 'TikTok', color: 'bg-gray-900' },
    { id: '3', name: 'YouTube', url: 'https://youtube.com', icon: 'Youtube', color: 'bg-gradient-to-br from-red-600 to-red-700' },
    { id: '4', name: 'Twitter', url: 'https://twitter.com', icon: 'Twitter', color: 'bg-gradient-to-br from-blue-400 to-blue-500' },
    { id: '5', name: 'Facebook', url: 'https://facebook.com', icon: 'Facebook', color: 'bg-gradient-to-br from-blue-600 to-blue-700' },
    { id: '6', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', color: 'bg-gradient-to-br from-blue-500 to-blue-600' }
  ];
  
  // Use platforms from the database or fallback to defaults
  const displayPlatforms = socialPlatforms && socialPlatforms.length > 0 ? 
    socialPlatforms.slice(0, 6) : defaultPlatforms;
  
  // Get icon based on platform name
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-6 w-6" />;
      case 'TikTok':
        return <CustomTiktokIcon />;
      case 'YouTube':
        return <Youtube className="h-6 w-6" />;
      case 'Twitter':
        return <Twitter className="h-6 w-6" />;
      case 'Facebook':
        return <Facebook className="h-6 w-6" />;
      case 'LinkedIn':
        return <Linkedin className="h-6 w-6" />;
      default:
        return <Instagram className="h-6 w-6" />;
    }
  };
  
  // Get color class based on platform
  const getColorClass = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'bg-gradient-to-br from-pink-500 to-purple-600';
      case 'TikTok':
        return 'bg-gray-900';
      case 'YouTube':
        return 'bg-gradient-to-br from-red-600 to-red-700';
      case 'Twitter':
        return 'bg-gradient-to-br from-blue-400 to-blue-500';
      case 'Facebook':
        return 'bg-gradient-to-br from-blue-600 to-blue-700';
      case 'LinkedIn':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      default:
        return 'bg-gray-800';
    }
  };
  
  const handleHireClick = () => {
    // Scroll to hire-me section
    const hireSection = document.getElementById('hire-me-section');
    if (hireSection) {
      hireSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Connect With Me
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {displayPlatforms.map((platform, index) => (
          <motion.a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getColorClass(platform.name)} rounded-xl p-5 flex flex-col items-center justify-center text-white aspect-square`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            {getIcon(platform.name)}
            <p className="mt-2 text-sm font-medium">{platform.name}</p>
          </motion.a>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center mt-8"
      >
        <Button 
          onClick={handleHireClick}
          className="bg-elvis-pink hover:bg-elvis-pink/90 text-white px-6 py-5 rounded-lg flex items-center gap-2"
        >
          <Mail className="h-5 w-5" />
          Hire Me
        </Button>
      </motion.div>
    </div>
  );
};

export default ConnectWithMe;
