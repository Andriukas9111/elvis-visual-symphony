
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid3X3, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Portfolio categories
const categories = ['All', 'Commercial', 'Nature', 'Entertainment', 'Cityscape', 'Events'];

// Sample portfolio items (in a real app, these would come from a database)
const portfolioItems = [
  {
    id: 1,
    title: 'Mountain Sunset',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=1974&auto=format&fit=crop',
    type: 'video'
  },
  {
    id: 2,
    title: 'Urban Life',
    category: 'Cityscape',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop',
    type: 'photo'
  },
  {
    id: 3,
    title: 'Brand Commercial',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1559570278-eb8d71d06403?q=80&w=1973&auto=format&fit=crop',
    type: 'video'
  },
  {
    id: 4,
    title: 'Concert Highlights',
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    type: 'video'
  },
  {
    id: 5,
    title: 'Wedding Ceremony',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2069&auto=format&fit=crop',
    type: 'photo'
  },
  {
    id: 6,
    title: 'Forest Adventure',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1596328546171-77e37b5e8b3d?q=80&w=1974&auto=format&fit=crop',
    type: 'video'
  }
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);
  
  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="py-24 bg-elvis-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-elvis-purple/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-elvis-pink/10 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gradient">Featured</span> Projects
            </motion.h2>
            
            <motion.p 
              className="text-white/70 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Browse our collection of cinematic videos and photographs showcasing both vertical reels 
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
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Category filters */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category 
                  ? 'bg-elvis-pink text-white' 
                  : 'bg-elvis-darker/50 text-white/70 hover:bg-elvis-pink/20'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        {/* Portfolio grid */}
        <motion.div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
            viewMode === 'featured' ? 'md:grid-rows-2 md:grid-cols-3' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative group overflow-hidden rounded-xl ${
                viewMode === 'featured' && index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="aspect-video w-full h-full">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-xs font-medium text-elvis-pink mb-1">{item.category}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <Button 
                    asChild 
                    size="sm" 
                    variant="secondary"
                    className="mt-2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    <Link to="/portfolio">
                      View Project
                    </Link>
                  </Button>
                </div>
              </div>
              
              {item.type === 'video' && (
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm">
                  Video
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button asChild className="bg-elvis-gradient">
            <Link to="/portfolio">
              Explore Full Portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
