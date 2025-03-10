
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Facebook, Linkedin, Share2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { 
    name: 'Instagram', 
    icon: <Instagram size={20} />, 
    url: 'https://instagram.com/your-handle', 
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'YouTube', 
    icon: <Youtube size={20} />, 
    url: 'https://youtube.com/@your-channel', 
    color: 'from-red-600 to-red-700'
  },
  { 
    name: 'Twitter', 
    icon: <Twitter size={20} />, 
    url: 'https://twitter.com/your-handle', 
    color: 'from-blue-400 to-blue-600'
  },
  { 
    name: 'Facebook', 
    icon: <Facebook size={20} />, 
    url: 'https://facebook.com/your-page', 
    color: 'from-blue-600 to-blue-800'
  },
  { 
    name: 'LinkedIn', 
    icon: <Linkedin size={20} />, 
    url: 'https://linkedin.com/in/your-profile', 
    color: 'from-blue-700 to-blue-900'
  },
  { 
    name: 'Social', 
    icon: <Share2 size={20} />, 
    url: 'https://link-in-bio-url', 
    color: 'from-elvis-pink to-elvis-purple'
  }
];

interface SocialMediaLinksProps {
  isInView: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ isInView }) => {
  return (
    <div className="w-full glass-card rounded-xl border border-white/10 p-6 bg-elvis-dark/30">
      <div className="flex items-center mb-4">
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-2xl font-bold">Connect With Me</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
        {socialLinks.map((social, index) => (
          <motion.div
            key={social.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <a 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
            >
              <div className={`bg-gradient-to-br ${social.color} rounded-lg p-4 text-white aspect-square flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-lg`}>
                <div className="mb-2">
                  {social.icon}
                </div>
                <span className="text-xs font-medium">{social.name}</span>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          className="border-elvis-pink/30 text-elvis-pink hover:bg-elvis-pink/20 flex items-center gap-2"
          asChild
        >
          <a href="mailto:contact@yourdomain.com">
            <Mail size={16} />
            <span>Contact Me</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
