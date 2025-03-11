
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '@/components/navbar/types';
import Logo from '@/components/Logo';
import MenuToggle from '@/components/navbar/MenuToggle';
import MobileMenu from '@/components/navbar/MobileMenu';
import DesktopNav from '@/components/navbar/DesktopNav';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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
  
  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Hire Me', href: '/#contact' },
    { name: 'Shop', href: '/shop' }
  ];

  const scrollToTop = (e: React.MouseEvent) => {
    // Only apply special handling for home page
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    // Only apply special handling for current page
    if (location.pathname === '/') {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      closeMenu();
    }
  };
  
  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition duration-300 py-4 ${
        scrolled ? 'bg-elvis-dark/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" onClick={scrollToTop} className="flex-shrink-0">
          <Logo />
        </Link>
        
        <DesktopNav 
          navLinks={navLinks} 
          scrollToContact={scrollToContact}
          scrollToTop={scrollToTop}
        />
        
        <MenuToggle toggleMenu={toggleMenu} />
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen}
        closeMenu={closeMenu}
        navLinks={navLinks}
        scrollToContact={scrollToContact}
        scrollToTop={scrollToTop}
      />
    </header>
  );
};

export default Navbar;
