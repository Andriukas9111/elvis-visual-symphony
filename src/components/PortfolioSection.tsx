
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { MagneticButton } from '@/components/buttons/MagneticButton';
import { CameraIcon, FilmIcon } from '@/components/icons/VideographyIcons';

// Mock portfolio data
const portfolioItems = [
  {
    id: 1,
    title: 'Mountain Sunrise',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1682685797660-3d847763691e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    featured: true
  },
  {
    id: 2,
    title: 'Urban Style',
    category: 'Videography',
    image: 'https://images.unsplash.com/photo-1661956602153-23384936a1d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    video: true
  },
  {
    id: 3,
    title: 'Ocean Horizon',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1682685797229-b2930538da47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: 4,
    title: 'Night City',
    category: 'Videography',
    image: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    video: true
  }
];

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={`py-20 px-6 md:px-12 lg:px-24 bg-elvis-medium section-animate ${isVisible ? 'animate-in' : ''}`}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <CameraIcon className="text-elvis-pink" />
              <FilmIcon className="text-elvis-purple" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
              <span className="text-gradient">Featured</span> Work
            </h2>
            <p className="text-white/70 max-w-lg">
              Explore our collection of visually stunning photography and videography projects that push creative boundaries.
            </p>
          </div>
          
          <MagneticButton 
            variant="link" 
            className="text-elvis-pink mt-4 md:mt-0 flex items-center group"
            asChild
          >
            <Link to="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioItems.map((item, index) => (
            <div 
              key={item.id}
              className="portfolio-item group cursor-pointer perspective-container"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animation: isVisible ? `fade-in 0.5s ease-out ${index * 0.1}s forwards` : 'none'
              }}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/5] transform-3d hover-rotate-y">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {item.video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-elvis-pink/30 backdrop-blur-md flex items-center justify-center">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                )}
                
                <div className="portfolio-caption">
                  <span className="text-sm text-elvis-pink font-medium">{item.category}</span>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;
