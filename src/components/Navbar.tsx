
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/AuthContext';

import logo from '/placeholder.svg';

const navItems = [
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Shop', href: '/shop' },
  { name: 'Contact', href: '#' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, signOut } = useAuth();

  return (
    <div className="bg-elvis-darker fixed w-full top-0 z-50">
      <div className="container mx-auto py-4 px-6 md:px-12 lg:px-0 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Elvis Creative Logo" className="h-8 mr-2" />
          <span className="font-script text-2xl text-white">Elvis Creative</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.name} to={item.href} className="text-white/80 hover:text-white transition-colors">
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <Button 
              variant="outline" 
              className="ml-4 border-white/20 hover:bg-white/10 hover:text-white"
              onClick={signOut}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <AuthButton 
                variant="ghost" 
                defaultTab="login"
                className="text-white hover:text-white hover:bg-white/10"
              />
              <AuthButton 
                variant="outline" 
                defaultTab="register" 
                className="ml-2 border-white/20 hover:bg-white/10 hover:text-white"
              >
                Get Started
              </AuthButton>
            </>
          )}
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-elvis-medium text-white">
            <SheetHeader className="border-b border-white/20 pb-4">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="sm" className="absolute right-4 top-4 text-white hover:text-white">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block py-2 text-lg text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-white/20 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <AuthButton 
                    variant="outline" 
                    defaultTab="login"
                    className="w-full border-white/20 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </AuthButton>
                  <AuthButton 
                    defaultTab="register" 
                    className="w-full bg-elvis-gradient hover:opacity-90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </AuthButton>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
              <p>&copy; {new Date().getFullYear()} Elvis Creative. All rights reserved.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
