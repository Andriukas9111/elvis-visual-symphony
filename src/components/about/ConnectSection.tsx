
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';
import { Instagram, Linkedin, Facebook, Youtube, Twitter } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

const ConnectSection: React.FC = () => {
  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as SocialLink[];
    }
  });
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };
  
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Map platform names to Lucide icons
  const getIconComponent = (platform: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'instagram': <Instagram />,
      'tiktok': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.946c-.851-.946-1.159-1.918-1.359-2.745h.006c-.08-.314-.128-.629-.128-.946V.398h-3.91V16.27c0 1.868-1.538 3.398-3.399 3.398c-1.87 0-3.399-1.53-3.399-3.398c0-1.868 1.538-3.398 3.399-3.398c.374 0 .734.059 1.074.17v-3.969a7.5 7.5 0 0 0-1.074-.077C4.534 9.007.853 12.696.853 17.127C.853 21.557 4.535 25.245 8.95 25.245c4.424 0 8.097-3.688 8.097-8.118V8.855c1.38.966 2.946 1.475 4.6 1.475V6.402c-.993 0-1.93-.345-2.682-.84" transform="translate(1.25 -.622) scale(.9375)"/></svg>,
      'youtube': <Youtube />,
      'twitter': <Twitter />,
      'facebook': <Facebook />,
      'linkedin': <Linkedin />
    };
    
    return iconMap[platform.toLowerCase()] || platform;
  };

  // Fallback social links if none are available from the database
  const fallbackLinks = [
    {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      background_color: '#BC5BD8',
      text_color: '#FFFFFF',
      order_index: 1
    },
    {
      id: '2',
      platform: 'TikTok',
      url: 'https://tiktok.com',
      icon: 'tiktok',
      background_color: '#1C212D',
      text_color: '#FFFFFF',
      order_index: 2
    },
    {
      id: '3',
      platform: 'YouTube',
      url: 'https://youtube.com',
      icon: 'youtube',
      background_color: '#D93025',
      text_color: '#FFFFFF',
      order_index: 3
    },
    {
      id: '4',
      platform: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
      background_color: '#1D9BF0',
      text_color: '#FFFFFF',
      order_index: 4
    },
    {
      id: '5',
      platform: 'Facebook',
      url: 'https://facebook.com',
      icon: 'facebook',
      background_color: '#1877F2',
      text_color: '#FFFFFF',
      order_index: 5
    },
    {
      id: '6',
      platform: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin',
      background_color: '#0A66C2',
      text_color: '#FFFFFF',
      order_index: 6
    }
  ];
  
  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container max-w-7xl mx-auto px-4">
        <SectionHeading title="Connect With Me" />
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {isLoading ? (
            // Skeleton placeholders
            Array(6).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="h-28 rounded-lg bg-elvis-medium animate-pulse"
              />
            ))
          ) : (
            (socialLinks?.length ? socialLinks : fallbackLinks).map(link => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={item}
                className="rounded-lg p-4 flex flex-col items-center justify-center text-center h-28 hover:scale-105 transition-transform"
                style={{ 
                  backgroundColor: link.background_color, 
                  color: link.text_color || '#FFFFFF'
                }}
              >
                <div className="text-3xl mb-2">
                  {getIconComponent(link.icon || link.platform)}
                </div>
                <h3 className="text-sm font-medium">{link.platform}</h3>
              </motion.a>
            ))
          )}
        </motion.div>
        
        <div className="flex justify-center">
          <Button 
            className="bg-elvis-pink hover:bg-elvis-pink/90 text-white px-8 py-2 rounded-full"
            onClick={scrollToContact}
          >
            Contact Me
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
