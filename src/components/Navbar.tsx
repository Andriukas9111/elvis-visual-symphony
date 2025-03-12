import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import ProfileMenu from '@/components/ProfileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut, isAdmin, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && profile) {
      console.log('Navbar - User profile:', { 
        email: user.email, 
        role: profile.role,
        isAdmin: isAdmin 
      });
    }
  }, [user, profile, isAdmin]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHireMe = () => {
    const hireMeSection = document.getElementById('contact');
    if (hireMeSection) {
      hireMeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { title: 'Home', path: '/', onClick: scrollToTop },
    { title: 'Portfolio', path: '/portfolio' },
    { title: 'Shop', path: '/shop' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9998] transition-all duration-300 px-6 md:px-10 py-4 ${
        isScrolled ? 'bg-elvis-dark/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={scrollToTop}
        >
          <img src="/lovable-uploads/6e0bc9cc-9ea9-49c7-8cc5-71cd5c487e4d.png" alt="Elvis Creative" className="h-8 md:h-10" />
        </div>

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
                  onClick={link.onClick}
                >
                  {link.title}
                </NavLink>
              ))}
              <button
                onClick={scrollToHireMe}
                className="navbar-link text-elvis-pink hover:opacity-80 transition-opacity"
              >
                Hire Me
              </button>
            </div>
            
            {user ? (
              <ProfileMenu />
            ) : (
              <AuthButton 
                asChild={true} 
                className="bg-elvis-gradient hover:opacity-90 transition-opacity shadow-pink-glow"
              >
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
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (link.onClick) link.onClick();
                }}
                className={({ isActive }) =>
                  `text-2xl font-medium ${isActive ? 'text-elvis-pink' : 'text-white'}`
                }
              >
                {link.title}
              </NavLink>
            ))}
            <button
              onClick={() => {
                scrollToHireMe();
                setIsMenuOpen(false);
              }}
              className="text-2xl font-medium text-elvis-pink"
            >
              Hire Me
            </button>
            
            {user ? (
              <div className="mt-4">
                <Link to="/dashboard" className="block text-2xl font-medium text-white mb-4" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block text-2xl font-medium text-white mb-4" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10 hover:text-white" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
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
