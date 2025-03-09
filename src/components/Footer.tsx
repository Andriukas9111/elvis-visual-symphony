
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError('Invalid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Subscribed successfully!",
        description: "You'll receive updates and special offers in your inbox.",
        variant: "default",
      });
      setEmail('');
    }, 1500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="bg-elvis-darker text-white/70">
      <div className="container mx-auto pt-16 pb-8 px-6 md:px-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Logo and Description */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src="/lovable-uploads/6e0bc9cc-9ea9-49c7-8cc5-71cd5c487e4d.png" alt="Elvis Creative" className="h-8 mb-6" />
            </motion.div>
            <p className="mb-6">
              Premium photography and videography solutions for creators who demand excellence.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-white/60 hover:text-elvis-pink transition-colors"
                whileHover={{ y: -4, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-white/60 hover:text-elvis-pink transition-colors"
                whileHover={{ y: -4, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Youtube size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-white/60 hover:text-elvis-pink transition-colors"
                whileHover={{ y: -4, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link to="/" className="hover:text-elvis-pink transition-colors inline-block">Home</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link to="/portfolio" className="hover:text-elvis-pink transition-colors inline-block">Portfolio</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link to="/shop" className="hover:text-elvis-pink transition-colors inline-block">Shop</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link to="/login" className="hover:text-elvis-pink transition-colors inline-block">Login</Link>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <a href="#" className="hover:text-elvis-pink transition-colors inline-block">Photography</a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <a href="#" className="hover:text-elvis-pink transition-colors inline-block">Videography</a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <a href="#" className="hover:text-elvis-pink transition-colors inline-block">Color Grading</a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <a href="#" className="hover:text-elvis-pink transition-colors inline-block">Post-Production</a>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Newsletter Signup */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-sm text-white/60 mb-4">
              Subscribe to receive updates, special offers, and creative tips.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={handleEmailChange}
                  className={`bg-elvis-medium/50 border-elvis-medium pl-10 ${
                    error ? 'border-red-500' : 'focus:border-elvis-pink'
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-elvis-pink/60">
                  <Mail size={16} />
                </div>
                {error && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                    <AlertCircle size={16} />
                  </div>
                )}
              </div>
              
              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-elvis-pink hover:bg-elvis-pink/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
            
            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <MapPin size={16} className="text-elvis-pink mr-2 flex-shrink-0" />
                  <span>Los Angeles, CA 90210</span>
                </li>
                <li className="flex items-center text-sm">
                  <Phone size={16} className="text-elvis-pink mr-2 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center text-sm">
                  <Mail size={16} className="text-elvis-pink mr-2 flex-shrink-0" />
                  <span>hello@elviscreative.com</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Elvis Creative. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-white/50">
            <a href="#" className="hover:text-elvis-pink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-elvis-pink transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
