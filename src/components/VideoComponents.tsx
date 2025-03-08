
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParallax } from '@/hooks/use-gsap';
import AnimatedSection, { AnimatedItem } from './layout/AnimatedSection';
import Grid from './layout/Grid';
import FilmLoader from './videography/FilmLoader';
import ShutterButton from './videography/ShutterButton';
import CameraCard from './videography/CameraCard';
import VideographyIcon from './videography/VideographyIcon';
import MagneticButton from './videography/MagneticButton';
import CameraModel3D from './videography/CameraModel3D';

const VideoComponents = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const model3DRef = useRef<HTMLDivElement>(null);

  // Use parallax effect on background
  useParallax(parallaxRef, 0.2);

  // Scroll-based transformations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={sectionRef}
      className="py-20 px-6 md:px-12 lg:px-24 bg-elvis-dark overflow-hidden relative"
    >
      {/* Parallax background grid */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 bg-neon-grid bg-grid-lg opacity-20 pointer-events-none"
      />

      <div className="container mx-auto">
        <AnimatedSection variant="fadeInUp" className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient">Videography</span> Components
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explore our custom-designed videography-themed components with advanced animation effects.
          </p>
        </AnimatedSection>

        {/* Loading Indicators */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.2}
          className="mb-16 glass-card p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-elvis-pink">Loading Indicators</h3>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="flex flex-col items-center">
              <FilmLoader size="sm" color="#ff00ff" />
              <p className="mt-2 text-sm">Small</p>
            </div>
            <div className="flex flex-col items-center">
              <FilmLoader size="md" color="#ff00ff" />
              <p className="mt-2 text-sm">Medium</p>
            </div>
            <div className="flex flex-col items-center">
              <FilmLoader size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Large</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Icons */}
        <AnimatedSection 
          variant="slideUp" 
          delay={0.3}
          className="mb-16 glass-card p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-elvis-pink">Videography Icons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            <div className="flex flex-col items-center">
              <VideographyIcon type="camera" size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Camera</p>
            </div>
            <div className="flex flex-col items-center">
              <VideographyIcon type="clapperboard" size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Clapperboard</p>
            </div>
            <div className="flex flex-col items-center">
              <VideographyIcon type="lens" size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Lens</p>
            </div>
            <div className="flex flex-col items-center">
              <VideographyIcon type="film" size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Film</p>
            </div>
            <div className="flex flex-col items-center">
              <VideographyIcon type="microphone" size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Microphone</p>
            </div>
            <div className="flex flex-col items-center">
              <VideographyIcon type="light" size="lg" color="#ff00ff" />
              <p className="mt-2 text-sm">Light</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Buttons */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.4}
          className="mb-16 glass-card p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-elvis-pink">Interactive Buttons</h3>
          
          <h4 className="text-xl mb-4">Shutter Buttons</h4>
          <div className="flex flex-wrap gap-4 mb-8">
            <ShutterButton size="sm">Small</ShutterButton>
            <ShutterButton>Medium</ShutterButton>
            <ShutterButton size="lg">Large</ShutterButton>
            <ShutterButton variant="secondary">Secondary</ShutterButton>
            <ShutterButton variant="outline">Outline</ShutterButton>
          </div>
          
          <h4 className="text-xl mb-4">Magnetic Buttons</h4>
          <div className="flex flex-wrap gap-4">
            <MagneticButton>Magnetic</MagneticButton>
            <MagneticButton variant="secondary">Secondary</MagneticButton>
            <MagneticButton variant="outline">Outline</MagneticButton>
            <MagneticButton variant="ghost">Ghost</MagneticButton>
            <MagneticButton roundedFull>Round</MagneticButton>
          </div>
        </AnimatedSection>

        {/* Camera Cards */}
        <AnimatedSection 
          variant="slideUp" 
          delay={0.5}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-elvis-pink">3D Camera Cards</h3>
          <Grid 
            columns={{ xs: 1, sm: 2, md: 3 }}
            gap={6}
          >
            <CameraCard 
              title="Professional Camera" 
              description="High-end professional cinema camera" 
              imageUrl="/placeholder.svg" 
            />
            <CameraCard 
              title="Vintage Film" 
              description="Classic 35mm film camera" 
              imageUrl="/placeholder.svg" 
            />
            <CameraCard 
              title="Modern DSLR" 
              description="Digital SLR with 4K capabilities" 
              imageUrl="/placeholder.svg" 
            />
          </Grid>
        </AnimatedSection>

        {/* 3D Model */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.6}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-elvis-pink">3D Camera Model</h3>
          <motion.div 
            ref={model3DRef}
            className="h-[400px] w-full rounded-lg overflow-hidden bg-elvis-darker"
            style={{ scale, rotate }}
          >
            <CameraModel3D />
          </motion.div>
        </AnimatedSection>

        {/* Cursor Effect Demo */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.7}
          className="glass-card p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4 text-elvis-pink">Interactive Animation</h3>
          <p className="mb-6 text-white/70">
            Move your cursor around the screen to experience the custom cursor and interactive hover effects.
          </p>
          <MagneticButton size="lg" className="mx-auto">
            Try Interactions
          </MagneticButton>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default VideoComponents;
