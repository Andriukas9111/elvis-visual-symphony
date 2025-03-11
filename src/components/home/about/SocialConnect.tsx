
import React from 'react';
import { motion } from 'framer-motion';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const SocialConnect = () => {
  const { data: socialPlatforms, isLoading } = useSocialMedia();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToHireForm = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const platformColors: Record<string, string> = {
    facebook: 'bg-[#1877F2]',
    twitter: 'bg-[#1DA1F2]',
    instagram: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
    youtube: 'bg-[#FF0000]',
    linkedin: 'bg-[#0A66C2]',
    github: 'bg-[#333333]',
  };

  return (
    <div className="container mx-auto px-4 py-16" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Connect With Me</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow me on social media to stay updated with my latest work and announcements
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="w-full aspect-square bg-card/20 animate-pulse rounded-lg" />
          ))
        ) : (
          socialPlatforms?.map((platform, index) => (
            <motion.a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${platformColors[platform.platform.toLowerCase()] || 'bg-primary'} 
                rounded-lg flex items-center justify-center hover-scale`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              style={{ aspectRatio: '1/1' }}
            >
              <Icon name={platform.platform.toLowerCase()} className="w-8 h-8 text-white" />
            </motion.a>
          ))
        )}
      </div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          onClick={scrollToHireForm}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-lg"
        >
          Hire Me <Icon name="arrowRight" className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default SocialConnect;
