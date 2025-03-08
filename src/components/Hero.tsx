
import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !textRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Parallax effect for the background
      heroRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      
      // Subtle text movement
      textRef.current.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-elvis-dark flex items-center justify-center">
      {/* Background with parallax effect */}
      <div 
        ref={heroRef}
        className="absolute inset-0 z-0 w-[110%] h-[110%] bg-gradient-to-br from-elvis-darker via-elvis-medium to-elvis-dark transition-transform duration-200 ease-out"
      >
        <div className="absolute inset-0 opacity-30">
          {/* Abstract pattern overlay */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-elvis-purple/20 blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-elvis-pink/20 blur-[100px] animate-float animation-delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-elvis-purple/30 blur-[70px] animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={textRef}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto transition-transform duration-200 ease-out"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter">
          <span className="text-white">Elevate Your Vision with </span>
          <span className="text-gradient font-script">Elvis Creative</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Premium Photography & Videography Solutions for Creators Who Demand Excellence
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button asChild className="bg-elvis-gradient text-white rounded-full px-8 py-6 text-lg shadow-pink-glow hover:shadow-purple-glow transition-all duration-300 group">
            <Link to="/portfolio">
              Explore Our Work
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-elvis-pink text-white rounded-full px-8 py-6 text-lg hover:bg-elvis-pink/10 transition-all duration-300">
            <Link to="/shop">Shop LUTs</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer animate-bounce"
        onClick={scrollToNextSection}
      >
        <ArrowDown className="h-8 w-8 text-white/80" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-[5]"></div>
    </div>
  );
};

export default Hero;
