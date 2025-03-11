
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavLink } from '@/components/navbar/types';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
  navLinks: NavLink[];
  scrollToContact: (e: React.MouseEvent) => void;
  scrollToTop: (e: React.MouseEvent) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  closeMenu, 
  navLinks,
  scrollToContact,
  scrollToTop
}) => {
  const { user } = useAuth();
  
  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-elvis-dark z-[60] md:hidden pt-20"
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
                  onClick={
                    link.name === 'Home' ? scrollToTop :
                    link.name === 'Hire Me' ? scrollToContact : 
                    closeMenu
                  }
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
  );
};

export default MobileMenu;
