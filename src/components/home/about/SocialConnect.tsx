
import React from 'react';
import { motion } from 'framer-motion';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useAnimation } from '@/contexts/AnimationContext';

const SocialConnect = () => {
  const { data: socialLinks, isLoading } = useSocialMedia();
  const { prefersReducedMotion } = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const scrollToHireSection = () => {
    const hireSection = document.getElementById('contact');
    if (hireSection) {
      hireSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 w-64 mx-auto bg-gray-700 animate-pulse rounded mb-4"></div>
          <div className="h-4 w-96 mx-auto bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-20 bg-gray-700 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Connect With Me</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Follow me on social media for updates on my latest projects and behind-the-scenes content.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        variants={!prefersReducedMotion ? containerVariants : {}}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {socialLinks?.map((platform) => (
          <motion.a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={!prefersReducedMotion ? itemVariants : {}}
            style={{ 
              backgroundColor: platform.background_color || '#2A1E30',
              color: platform.text_color || '#FFFFFF'
            }}
            className="p-6 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 hover-scale"
          >
            <div className="mb-3">
              <Icon name={platform.icon} className="w-8 h-8" />
            </div>
            <span className="font-medium">{platform.platform}</span>
          </motion.a>
        ))}
      </motion.div>

      <div className="text-center">
        <Button 
          onClick={scrollToHireSection}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
          size="lg"
        >
          Hire Me
        </Button>
      </div>
    </div>
  );
};

export default SocialConnect;
