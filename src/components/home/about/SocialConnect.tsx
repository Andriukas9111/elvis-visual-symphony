
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const SocialConnect = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialPlatforms = [
    { id: '1', name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com', color: '#E1306C' },
    { id: '2', name: 'YouTube', icon: 'Youtube', url: 'https://youtube.com', color: '#FF0000' },
    { id: '3', name: 'Facebook', icon: 'Facebook', url: 'https://facebook.com', color: '#1877F2' },
    { id: '4', name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
    { id: '5', name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com', color: '#0A66C2' },
    { id: '6', name: 'TikTok', icon: 'TikTok', url: 'https://tiktok.com', color: '#000000' },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Connect With Me</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow my creative journey on social media or get in touch for collaborations
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
        {socialPlatforms.map((platform, index) => (
          <motion.a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: `${platform.color}20` }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: platform.color }}
            >
              <Icon name={platform.icon} className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium">{platform.name}</span>
          </motion.a>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={scrollToContact}
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-white px-8"
        >
          Hire Me
          <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialConnect;
