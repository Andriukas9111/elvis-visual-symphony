
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/navbar/types';
import { useAuth } from '@/contexts/AuthContext';

interface DesktopNavProps {
  navLinks: NavLink[];
  scrollToContact: (e: React.MouseEvent) => void;
  scrollToTop: (e: React.MouseEvent) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navLinks, scrollToContact, scrollToTop }) => {
  const { user } = useAuth();
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navLinks.map(link => (
        <Link 
          key={link.name}
          to={link.href}
          onClick={
            link.name === 'Home' ? scrollToTop :
            link.name === 'Hire Me' ? scrollToContact : 
            undefined
          }
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
  );
};

export default DesktopNav;
