
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Hire Me', href: '/#contact' },
    { name: 'Shop', href: '/shop' }
  ];
  
  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <header
      className={`fixed w-full top-0 left-0 z-[100] transition duration-300 py-4 ${
        scrolled ? 'bg-elvis-dark/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link 
              key={link.name}
              to={link.href}
              className="text-white hover:text-elvis-pink transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" className="border-elvis-pink text-white hover:bg-elvis-pink/10">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="border-elvis-pink text-white hover:bg-elvis-pink/10">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
        
        <button
          className="text-white md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-elvis-dark z-[101] md:hidden pt-20"
          >
            <div className="container mx-auto px-4">
              <button
                className="absolute top-4 right-4 text-white"
                onClick={closeMenu}
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
              
              <nav className="flex flex-col space-y-6 p-4">
                {navLinks.map(link => (
                  <Link 
                    key={link.name}
                    to={link.href}
                    className="text-2xl text-white hover:text-elvis-pink transition-colors"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <Link 
                    to="/dashboard"
                    className="text-2xl text-white hover:text-elvis-pink transition-colors"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    className="text-2xl text-white hover:text-elvis-pink transition-colors"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
