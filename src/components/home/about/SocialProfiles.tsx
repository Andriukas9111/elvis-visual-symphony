
import React from 'react';
import { motion } from 'framer-motion';
import { useSocialProfiles } from '@/hooks/api/useSocialProfiles';
import SocialProfileCard from '@/components/ui/about/SocialProfileCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer } from '@/types/about.types';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const SocialProfiles: React.FC = () => {
  const { data: profiles = [], isLoading } = useSocialProfiles();
  
  // Default profiles in case database is empty
  const defaultProfiles = [
    {
      id: '1',
      platform: 'Instagram',
      username: 'elviscreative',
      url: 'https://instagram.com/elviscreative',
      icon_name: 'Instagram',
      color: 'pink',
      sort_order: 0,
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      platform: 'YouTube',
      username: 'elviscreative',
      url: 'https://youtube.com/@elviscreative',
      icon_name: 'Youtube',
      color: 'red',
      sort_order: 1,
      created_at: '',
      updated_at: ''
    },
    {
      id: '3',
      platform: 'Twitter',
      username: 'elviscreative',
      url: 'https://twitter.com/elviscreative',
      icon_name: 'Twitter',
      color: 'blue',
      sort_order: 2,
      created_at: '',
      updated_at: ''
    },
    {
      id: '4',
      platform: 'LinkedIn',
      username: 'elviscreative',
      url: 'https://linkedin.com/in/elviscreative',
      icon_name: 'Linkedin',
      color: 'blue',
      sort_order: 3,
      created_at: '',
      updated_at: ''
    }
  ];
  
  // Use profiles from database or fallback to default
  const displayProfiles = profiles.length > 0 ? profiles : defaultProfiles;
  
  if (isLoading) {
    return (
      <div>
        <div className="bg-elvis-medium/20 h-10 w-48 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-20"></div>
          ))}
        </div>
        <div className="bg-elvis-medium/20 rounded-xl h-12 w-full"></div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading 
        title="Connect With Me" 
        subtitle="Follow me on social media to see my latest work"
        accent="pink"
      />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {displayProfiles.map((profile, index) => (
          <SocialProfileCard 
            key={profile.id} 
            profile={profile} 
            index={index}
          />
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <Button 
          className="w-full bg-gradient-to-r from-elvis-pink to-elvis-purple hover:opacity-90 transition-opacity"
          size="lg"
          asChild
        >
          <a href="#contact" className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            <span>Hire Me For Your Next Project</span>
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default SocialProfiles;
