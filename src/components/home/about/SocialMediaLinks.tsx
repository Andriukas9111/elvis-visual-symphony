
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SocialMediaLinksProps {
  isInView: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ isInView }) => {
  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, url: 'https://instagram.com/elviscreative', label: 'Instagram' },
    { icon: <Youtube className="h-5 w-5" />, url: 'https://youtube.com/@elviscreative', label: 'YouTube' },
    { icon: <Twitter className="h-5 w-5" />, url: 'https://twitter.com/elviscreative', label: 'Twitter' },
    { icon: <Facebook className="h-5 w-5" />, url: 'https://facebook.com/elviscreative', label: 'Facebook' },
    { icon: <Globe className="h-5 w-5" />, url: 'https://elviscreative.com', label: 'Website' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6"
    >
      <h3 className="text-lg font-medium text-white mb-4">Connect With Me</h3>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="bg-elvis-dark/50 border-elvis-medium/50 hover:bg-elvis-medium/20 transition-colors"
            asChild
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {link.icon}
              <span>{link.label}</span>
            </a>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialMediaLinks;
