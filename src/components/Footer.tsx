
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-elvis-darker text-white/70">
      <div className="container mx-auto py-16 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <img src="/lovable-uploads/6e0bc9cc-9ea9-49c7-8cc5-71cd5c487e4d.png" alt="Elvis Creative" className="h-8 mb-6" />
            <p className="mb-6">
              Premium photography and videography solutions for creators who demand excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-elvis-pink transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-elvis-pink transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-elvis-pink transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-elvis-pink transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-elvis-pink transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-elvis-pink transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-elvis-pink transition-colors">Login</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-elvis-pink transition-colors">Photography</a>
              </li>
              <li>
                <a href="#" className="hover:text-elvis-pink transition-colors">Videography</a>
              </li>
              <li>
                <a href="#" className="hover:text-elvis-pink transition-colors">Color Grading</a>
              </li>
              <li>
                <a href="#" className="hover:text-elvis-pink transition-colors">Post-Production</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-elvis-pink mr-3 mt-1 flex-shrink-0" />
                <span>123 Creative Ave, Studio 4B<br />Los Angeles, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-elvis-pink mr-3 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-elvis-pink mr-3 flex-shrink-0" />
                <span>hello@elviscreative.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Elvis Creative. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-white/50">
            <a href="#" className="hover:text-elvis-pink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-elvis-pink transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
