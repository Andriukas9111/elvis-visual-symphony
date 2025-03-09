
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import AuthButton from '@/components/auth/AuthButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Portfolio', path: '/portfolio' },
    { title: 'Shop', path: '/shop' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-10 py-4 ${
        isScrolled ? 'bg-elvis-dark/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/6e0bc9cc-9ea9-49c7-8cc5-71cd5c487e4d.png" alt="Elvis Creative" className="h-8 md:h-10" />
        </Link>

        {!isMobile ? (
          <div className="flex items-center space-x-8">
            <div className="flex space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'text-elvis-pink after:w-full' : ''}`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
            </div>
            
            {user ? (
              <Button 
                variant="outline" 
                className="border-white/20 hover:bg-white/10 hover:text-white" 
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <AuthButton asChild className="bg-elvis-gradient hover:opacity-90 transition-opacity shadow-pink-glow">
                <Link to="#">Sign In</Link>
              </AuthButton>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-elvis-dark z-40 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-2xl font-medium ${isActive ? 'text-elvis-pink' : 'text-white'}`
                }
              >
                {link.title}
              </NavLink>
            ))}
            
            {user ? (
              <Button 
                variant="outline" 
                className="border-white/20 hover:bg-white/10 hover:text-white mt-4" 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
              >
                Sign Out
              </Button>
            ) : (
              <AuthButton 
                className="bg-elvis-gradient hover:opacity-90 transition-opacity mt-4 shadow-pink-glow"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </AuthButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
