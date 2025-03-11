
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';
import { SocialPlatformData } from './types';

interface ConnectWithMeProps {
  isInView: boolean;
}

const ConnectWithMe: React.FC<ConnectWithMeProps> = ({ isInView }) => {
  const { data: socialPlatforms, isLoading } = useSocialMedia();
  const navigate = useNavigate();

  const handleHireMeClick = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get icon based on platform name
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-6 h-6" />;
      case 'youtube':
        return <Youtube className="w-6 h-6" />;
      case 'twitter':
        return <Twitter className="w-6 h-6" />;
      case 'facebook':
        return <Facebook className="w-6 h-6" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6" />;
      default:
        return <Instagram className="w-6 h-6" />;
    }
  };

  // Get color class based on platform
  const getColorClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-br from-pink-500 to-purple-600';
      case 'youtube':
        return 'bg-gradient-to-br from-red-600 to-red-700';
      case 'twitter':
        return 'bg-gradient-to-br from-blue-400 to-blue-500';
      case 'facebook':
        return 'bg-gradient-to-br from-blue-600 to-blue-700';
      case 'linkedin':
        return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'tiktok':
        return 'bg-gradient-to-br from-gray-900 to-black';
      default:
        return 'bg-gradient-to-br from-gray-700 to-gray-900';
    }
  };

  // Fallback social platforms if none loaded from database
  const fallbackPlatforms: SocialPlatformData[] = [
    { id: '1', name: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', color: 'pink', sort_order: 1 },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com', icon: 'TikTok', color: 'black', sort_order: 2 },
    { id: '3', name: 'YouTube', url: 'https://youtube.com', icon: 'Youtube', color: 'red', sort_order: 3 },
    { id: '4', name: 'Twitter', url: 'https://twitter.com', icon: 'Twitter', color: 'blue', sort_order: 4 },
    { id: '5', name: 'Facebook', url: 'https://facebook.com', icon: 'Facebook', color: 'blue', sort_order: 5 },
    { id: '6', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', color: 'blue', sort_order: 6 }
  ];

  // Use data from API or fallback
  const platforms = socialPlatforms?.length ? socialPlatforms : fallbackPlatforms;

  // Sort platforms by sort_order
  const sortedPlatforms = [...platforms].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  if (isLoading) {
    return (
      <div className="mt-16">
        <div className="flex items-center mb-8">
          <div className="w-1 h-6 bg-purple-500 mr-3"></div>
          <h2 className="text-2xl font-bold text-white">Connect With Me</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 rounded-lg bg-elvis-light/20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex items-center mb-8">
        <div className="w-1 h-6 bg-purple-500 mr-3"></div>
        <h2 className="text-2xl font-bold text-white">Connect With Me</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {sortedPlatforms.map((platform, index) => (
          <motion.a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getColorClass(platform.name)} rounded-lg p-4 flex flex-col items-center justify-center text-white h-24 shadow-lg`}
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

      <div className="flex justify-center mt-8">
        <motion.button
          onClick={handleHireMeClick}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hire Me
        </motion.button>
      </div>
    </div>
  );
};

export default ConnectWithMe;
