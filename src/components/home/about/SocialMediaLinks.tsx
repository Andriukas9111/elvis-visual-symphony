
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Globe, 
  Share2,
  Phone,
  Play
} from 'lucide-react';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';

interface SocialMediaLinksProps {
  isInView: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ isInView }) => {
  const { data: socialMedia, isLoading } = useSocialMedia();
  
  // Fallback social media links in case none are in the database
  const fallbackLinks = [
    {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com/username',
      icon: 'Instagram',
      color: '#E1306C'
    },
    {
      id: '2',
      platform: 'YouTube',
      url: 'https://youtube.com/@username',
      icon: 'Youtube',
      color: '#FF0000'
    },
    {
      id: '3',
      platform: 'Twitter',
      url: 'https://twitter.com/username',
      icon: 'Twitter',
      color: '#1DA1F2'
    }
  ];
  
  const displayLinks = socialMedia && socialMedia.length > 0 ? socialMedia : fallbackLinks;
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Instagram': return <Instagram size={20} />;
      case 'Youtube': return <Youtube size={20} />;
      case 'Twitter': return <Twitter size={20} />;
      case 'Facebook': return <Facebook size={20} />;
      case 'Linkedin': return <Linkedin size={20} />;
      case 'Mail': return <Mail size={20} />;
      case 'Globe': return <Globe size={20} />;
      case 'Share2': return <Share2 size={20} />;
      case 'Phone': return <Phone size={20} />;
      case 'Play': return <Play size={20} />;
      default: return <Globe size={20} />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="pt-4 animate-pulse">
        <div className="flex items-center mb-4">
          <span className="h-6 w-1 bg-elvis-pink/30 rounded-full mr-3"></span>
          <div className="h-7 w-40 bg-white/10 rounded"></div>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-10 rounded-full bg-white/10"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-4">
      <div className="flex items-center mb-4">
        <span className="h-6 w-1 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-xl font-bold">Connect With Me</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {displayLinks.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full p-2.5 transition-all duration-300"
            style={{ 
              backgroundColor: link.color || '#000000',
              color: '#ffffff'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView 
              ? { opacity: 1, y: 0, transition: { delay: 0.2 + (index * 0.1) } } 
              : { opacity: 0, y: 20 }
            }
            whileHover={{ 
              scale: 1.1, 
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' 
            }}
            title={link.platform}
          >
            {getIconComponent(link.icon)}
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
