
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Grid3X3, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PortfolioFilter from './PortfolioFilter';
import PortfolioGrid from './PortfolioGrid';

// Video-focused categories for the filter
const categories = ['All', 'Commercial', 'Nature', 'Entertainment', 'Cityscape', 'Events'];

const PortfolioPreview = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');
  const [isInView, setIsInView] = useState(false);
  
  // Intersection Observer to trigger animations when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById('portfolio-preview-section');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  return (
    <div id="portfolio-preview-section" className="container mx-auto">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header with animation */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gradient">Featured</span> Videos
            </motion.h2>
            <motion.p 
              className="text-white/70 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Browse our collection of cinematic videos showcasing both vertical reels 
              and widescreen productions that highlight our creative vision
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* View mode toggles */}
            <div className="border border-elvis-pink/30 rounded-lg p-1 flex">
              <Button
                variant="ghost"
                size="icon"
                className={`p-1 ${viewMode === 'featured' ? 'bg-elvis-pink/20' : ''}`}
                onClick={() => setViewMode('featured')}
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`p-1 ${viewMode === 'grid' ? 'bg-elvis-pink/20' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
            
            <Button asChild variant="link" className="text-elvis-pink flex items-center group">
              <Link to="/portfolio">
                View All Videos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Animated category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PortfolioFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>
        
        {/* Portfolio Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8"
        >
          <PortfolioGrid 
            category={activeCategory}
            gridClassName={viewMode === 'featured' ? 'grid-auto-featured' : ''}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
