import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Linkedin, Share2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/hooks/api/useContent';

interface SocialMediaLinksProps {
  isInView: boolean;
}

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
  hoverGradient: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ isInView }) => {
  const { data: socialData } = useContent('social');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Default social links
  const defaultSocialLinks: SocialLink[] = [
    { 
      name: 'Instagram', 
      icon: <Instagram size={24} />, 
      url: 'https://instagram.com/your-handle', 
      color: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-600 to-pink-600',
    },
    { 
      name: 'TikTok', 
      icon: <Share2 size={24} />, // Using Share2 as a replacement for TikTok
      url: 'https://tiktok.com/@your-handle',
      color: 'from-gray-900 to-gray-800',
      hoverGradient: 'from-gray-800 to-gray-700',
    },
    { 
      name: 'YouTube', 
      icon: <Youtube size={24} />, 
      url: 'https://youtube.com/@your-channel', 
      color: 'from-red-600 to-red-700',
      hoverGradient: 'from-red-700 to-red-800',
    },
    { 
      name: 'Twitter', 
      icon: <Twitter size={24} />, 
      url: 'https://twitter.com/your-handle', 
      color: 'from-blue-400 to-blue-600',
      hoverGradient: 'from-blue-500 to-blue-700',
    },
    { 
      name: 'Facebook', 
      icon: <Facebook size={24} />, 
      url: 'https://facebook.com/your-page', 
      color: 'from-blue-600 to-blue-800',
      hoverGradient: 'from-blue-700 to-blue-900',
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={24} />, 
      url: 'https://linkedin.com/in/your-profile', 
      color: 'from-blue-700 to-blue-900',
      hoverGradient: 'from-blue-800 to-blue-950',
    }
  ];

  // Parse social links from database if available
  const socialLinks = React.useMemo(() => {
    if (!socialData || socialData.length === 0) return defaultSocialLinks;
    
    // Try to find social links data in content data
    const linksData = socialData.find(item => item.content && typeof item.content === 'string');
    
    if (!linksData) return defaultSocialLinks;
    
    try {
      const parsedData = JSON.parse(linksData.content);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData.map((link: any) => {
          // Map icon name to component
          let iconComponent;
          switch (link.icon) {
            case 'Instagram': iconComponent = <Instagram size={24} />; break;
            case 'TikTok': iconComponent = <Share2 size={24} />; break;
            case 'Youtube': iconComponent = <Youtube size={24} />; break;
            case 'Twitter': iconComponent = <Twitter size={24} />; break;
            case 'Facebook': iconComponent = <Facebook size={24} />; break;
            case 'Linkedin': iconComponent = <Linkedin size={24} />; break;
            case 'Share2': iconComponent = <Share2 size={24} />; break;
            default: iconComponent = <Share2 size={24} />;
          }
          
          return {
            ...link,
            icon: iconComponent,
            // If no gradient defined, use some defaults based on the platform
            color: link.color || defaultSocialLinks.find(i => i.name === link.name)?.color || 'from-elvis-pink to-elvis-purple',
            hoverGradient: link.hoverGradient || 'from-elvis-pink/90 to-elvis-purple/90'
          };
        });
      }
      return defaultSocialLinks;
    } catch (error) {
      console.error("Error parsing social links data:", error);
      return defaultSocialLinks;
    }
  }, [socialData]);

  // Get contact email
  const contactEmail = React.useMemo(() => {
    if (!socialData || socialData.length === 0) return 'contact@yourdomain.com';
    
    const emailData = socialData.find(item => item.title === 'contact_email');
    return emailData?.content || 'contact@yourdomain.com';
  }, [socialData]);

  return (
    <div className="w-full glass-card rounded-xl border border-white/10 p-8 bg-elvis-dark/30 backdrop-blur-lg">
      <div className="flex items-center mb-6">
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-2xl font-bold">Connect With Me</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
        {socialLinks.map((social, index) => (
          <motion.div
            key={social.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <a 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
              aria-label={`Visit ${social.name}`}
            >
              <motion.div 
                className={`bg-gradient-to-br ${social.color} rounded-lg p-6 text-white aspect-square flex flex-col items-center justify-center transform transition-all duration-300`}
                whileHover={{ 
                  scale: 1.05,
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }}
                animate={hoveredIndex === index ? {
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                } : {}}
              >
                <div className="mb-3 transition-transform duration-300">
                  {social.icon}
                </div>
                <span className="text-sm font-medium">{social.name}</span>
                
                {/* Particle effect on hover */}
                {hoveredIndex === index && (
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white/40 animate-ping"></div>
                    <div className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-white/30 animate-ping" style={{ animationDelay: '300ms' }}></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-white/20 animate-ping" style={{ animationDelay: '600ms' }}></div>
                  </motion.div>
                )}
              </motion.div>
            </a>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          variant="outline" 
          className="border-elvis-pink/30 text-elvis-pink hover:bg-elvis-pink/20 flex items-center gap-2"
          asChild
        >
          <a href={`mailto:${contactEmail}`}>
            <Mail size={18} />
            <span>Contact Me</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
