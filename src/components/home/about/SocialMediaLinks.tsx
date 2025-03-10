
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Linkedin, Share2, Mail, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/hooks/api/useContent';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';
import { Link as ScrollLink } from 'react-scroll';

interface SocialMediaLinksProps {
  isInView: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ isInView }) => {
  const { data: socialLinks } = useSocialMedia();
  const { data: socialData } = useContent('social');

  const contactEmail = React.useMemo(() => {
    if (!socialData || socialData.length === 0) return 'contact@yourdomain.com';
    
    const emailData = socialData.find(item => item.title === 'contact_email');
    return emailData?.content || 'contact@yourdomain.com';
  }, [socialData]);

  const hireButtonText = React.useMemo(() => {
    if (!socialData || socialData.length === 0) return 'Hire Me';
    
    const buttonData = socialData.find(item => item.title === 'hire_button_text');
    return buttonData?.content || 'Hire Me';
  }, [socialData]);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Instagram: <Instagram size={24} />,
      Youtube: <Youtube size={24} />,
      Twitter: <Twitter size={24} />,
      Facebook: <Facebook size={24} />,
      Linkedin: <Linkedin size={24} />,
      Share2: <Share2 size={24} />,
    };
    
    return icons[iconName] || <Share2 size={24} />;
  };

  return (
    <div className="w-full glass-card rounded-xl border border-white/10 p-8 bg-elvis-dark/30 backdrop-blur-lg">
      <div className="flex items-center mb-6">
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-2xl font-bold">Connect With Me</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
        {socialLinks && socialLinks.map((social, index) => (
          <motion.div
            key={social.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="mb-3 transition-transform duration-300">
                  {getIconComponent(social.icon)}
                </div>
                <span className="text-sm font-medium">{social.name}</span>
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
          <ScrollLink 
            to="hire-me-section" 
            smooth={true} 
            duration={800} 
            offset={-100}
            className="cursor-pointer flex items-center gap-2"
          >
            <ArrowDownToLine size={18} />
            <span>{hireButtonText}</span>
          </ScrollLink>
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
