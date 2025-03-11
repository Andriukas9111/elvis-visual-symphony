
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialPlatformData } from './types';
import { useContent } from '@/hooks/api/useContent';
import { Link } from 'react-router-dom';

export interface SocialMediaLinksProps {
  isInView: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ isInView }) => {
  const [socialLinks, setSocialLinks] = useState<SocialPlatformData[]>([]);
  const [hireButtonText, setHireButtonText] = useState('Hire Me');
  const { data: contentData } = useContent('social');
  
  // Fetch social media links from database
  const { data: socialData, isLoading } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      
      // Map database format to component format
      return data.map(link => ({
        id: link.id,
        name: link.platform,
        url: link.url,
        icon: link.icon,
        color: link.color,
        sort_order: link.sort_order
      })) as SocialPlatformData[];
    }
  });

  // Get icon component by name
  const getIconByName = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Instagram: <Instagram className="h-5 w-5" />,
      Youtube: <Youtube className="h-5 w-5" />,
      Twitter: <Twitter className="h-5 w-5" />,
      Facebook: <Facebook className="h-5 w-5" />,
      Globe: <Globe className="h-5 w-5" />,
      Mail: <Mail className="h-5 w-5" />
    };
    
    return icons[iconName] || <Globe className="h-5 w-5" />;
  };
  
  // Get button text from content data
  useEffect(() => {
    if (contentData) {
      const buttonTextData = contentData.find(item => item.title === 'hire_button_text');
      if (buttonTextData) {
        setHireButtonText(buttonTextData.content || 'Hire Me');
      }
    }
    
    if (socialData) {
      setSocialLinks(socialData);
    }
  }, [contentData, socialData]);
  
  // Fallback links if no data from database
  const fallbackSocialLinks = [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/elviscreative', icon: 'Instagram', color: 'from-purple-500 to-pink-500' },
    { id: '2', name: 'YouTube', url: 'https://youtube.com/@elviscreative', icon: 'Youtube', color: 'from-red-500 to-pink-500' },
    { id: '3', name: 'Twitter', url: 'https://twitter.com/elviscreative', icon: 'Twitter', color: 'from-blue-400 to-blue-600' },
    { id: '4', name: 'Facebook', url: 'https://facebook.com/elviscreative', icon: 'Facebook', color: 'from-blue-500 to-blue-700' },
    { id: '5', name: 'Website', url: 'https://elviscreative.com', icon: 'Globe', color: 'from-gray-500 to-gray-700' },
  ];
  
  const linksToDisplay = socialLinks.length > 0 ? socialLinks : fallbackSocialLinks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6"
    >
      <h3 className="text-lg font-medium text-white mb-4">Connect With Me</h3>
      <div className="flex flex-wrap gap-3 mb-5">
        {linksToDisplay.map((link, index) => (
          <Button
            key={link.id}
            variant="outline"
            size="sm"
            className="bg-elvis-dark/50 border-elvis-medium/50 hover:bg-elvis-medium/20 transition-colors"
            asChild
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {getIconByName(link.icon)}
              <span>{link.name}</span>
            </a>
          </Button>
        ))}
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-elvis-pink to-elvis-purple hover:opacity-90 transition-opacity"
        size="lg"
        asChild
      >
        <a href="#contact" className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          <span>{hireButtonText}</span>
        </a>
      </Button>
    </motion.div>
  );
};

export default SocialMediaLinks;
