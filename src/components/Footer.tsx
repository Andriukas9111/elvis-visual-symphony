
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Mail, ArrowRight, Instagram, Twitter, Youtube, Linkedin, Send } from 'lucide-react';
import { useAddSubscriber } from '@/hooks/useSupabase';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  
  const addSubscriber = useAddSubscriber({
    onSuccess: () => {
      setEmail('');
    },
    onError: (error) => {
      console.error('Subscription error:', error);
    }
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    
    // Use the mutation from useSupabase
    addSubscriber.mutate({ email });
  };

  return (
    <footer className="bg-elvis-darker text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-elvis-purple/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-elvis-pink/10 rounded-full blur-[120px]"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-elvis-gradient">
                Elvis Media
              </h2>
            </Link>
            <p className="text-white/70">
              Professional videography, editing and media production services.
              Turning visions into stunning visual experiences.
            </p>
          </div>
          
          {/* Column 2: Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-white/70 hover:text-elvis-pink transition-colors">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@elvismedia.com">contact@elvismedia.com</a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-white/70 hover:text-elvis-pink transition-colors"
                >
                  Get a quote
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/portfolio" 
                  className="text-white/70 hover:text-elvis-pink transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-white/70 hover:text-elvis-pink transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="text-white/70 hover:text-elvis-pink transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white/70 hover:text-elvis-pink transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-3">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-elvis-dark border-white/10 focus:border-elvis-pink"
              />
              <Button 
                type="submit" 
                disabled={addSubscriber.isPending}
                className="bg-elvis-gradient hover:shadow-pink-glow transition-all"
              >
                {addSubscriber.isPending ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Elvis Media. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-white/70 hover:text-elvis-pink transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-elvis-pink transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-elvis-pink transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-elvis-pink transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
