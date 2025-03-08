
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection, { AnimatedItem } from './layout/AnimatedSection';
import Grid from './layout/Grid';
import { useGSAP } from '@/hooks/use-gsap';

const DesignSystemShowcase = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Use GSAP for more complex animations
  useGSAP(containerRef, {
    animation: {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    },
    start: 'top 80%',
  });

  return (
    <div 
      ref={containerRef}
      className="py-20 px-6 md:px-12 lg:px-24 bg-elvis-medium section-animate"
    >
      <div className="container mx-auto">
        <AnimatedSection variant="slideUp" className="mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient">Design System</span> Showcase
          </h2>
          <p className="text-white/70 max-w-2xl">
            Explore our comprehensive design system with responsive grids, rich typography, and impressive animation capabilities.
          </p>
        </AnimatedSection>

        {/* Typography Showcase */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.2}
          className="mb-16 glass-card p-8"
          staggerChildren={true}
          staggerDelay={0.1}
        >
          <AnimatedItem className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-elvis-pink">Typography</h3>
            <div className="grid gap-4">
              <div>
                <h1>Heading 1</h1>
                <p className="text-sm text-white/60">Font: Montserrat, Display-1</p>
              </div>
              <div>
                <h2>Heading 2</h2>
                <p className="text-sm text-white/60">Font: Montserrat, Display-2</p>
              </div>
              <div>
                <h3>Heading 3</h3>
                <p className="text-sm text-white/60">Font: Montserrat, Heading-1</p>
              </div>
              <div>
                <h4>Heading 4</h4>
                <p className="text-sm text-white/60">Font: Montserrat, Heading-2</p>
              </div>
              <div>
                <h5>Heading 5</h5>
                <p className="text-sm text-white/60">Font: Montserrat, Heading-3</p>
              </div>
              <div>
                <p className="text-xl">Large Text - For important content and highlights</p>
                <p className="text-sm text-white/60">Font: Montserrat, Body-lg</p>
              </div>
              <div>
                <p>Body Text - For regular content and descriptions</p>
                <p className="text-sm text-white/60">Font: Montserrat, Body</p>
              </div>
              <div>
                <p className="text-sm">Small Text - For captions and secondary content</p>
                <p className="text-sm text-white/60">Font: Montserrat, Body-sm</p>
              </div>
              <div>
                <p className="text-xs">Caption Text - For metadata and fine print</p>
                <p className="text-sm text-white/60">Font: Montserrat, Caption</p>
              </div>
              <div>
                <p className="font-display text-2xl">Display Font</p>
                <p className="text-sm text-white/60">Font: Playfair Display</p>
              </div>
              <div>
                <p className="font-script text-2xl">Script Font</p>
                <p className="text-sm text-white/60">Font: Dancing Script</p>
              </div>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Spacing & Grid Showcase */}
        <AnimatedSection 
          variant="slideUp" 
          delay={0.3}
          className="mb-16"
          staggerChildren={true}
          staggerDelay={0.1}
        >
          <AnimatedItem className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-elvis-pink">Responsive Grid System</h3>
            <p className="mb-6 text-white/70">
              Our fluid grid system automatically adjusts for different screen sizes and viewports.
            </p>
          </AnimatedItem>

          <AnimatedItem>
            <Grid 
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gap={4}
              className="mb-8"
            >
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="bg-elvis-light p-4 rounded-lg h-40 flex items-center justify-center"
                >
                  <span className="text-xl font-bold">Grid Item {i}</span>
                </div>
              ))}
            </Grid>
          </AnimatedItem>

          <AnimatedItem>
            <Grid 
              columns={{ xs: 1, sm: 1, md: 2, lg: 2 }}
              gap={5}
              className="mb-8"
            >
              {[1, 2].map((i) => (
                <div 
                  key={i} 
                  className="bg-elvis-light p-4 rounded-lg h-40 flex items-center justify-center"
                >
                  <span className="text-xl font-bold">Grid Item {i}</span>
                </div>
              ))}
            </Grid>
          </AnimatedItem>

          <AnimatedItem>
            <Grid 
              autoFit={true}
              minChildWidth="200px"
              gap={4}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="bg-elvis-light p-4 rounded-lg h-32 flex items-center justify-center"
                >
                  <span className="text-lg font-bold">Auto-fit Item {i}</span>
                </div>
              ))}
            </Grid>
          </AnimatedItem>
        </AnimatedSection>

        {/* Spacing Showcase */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.4}
          className="mb-16 glass-card p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-elvis-pink">Spacing System</h3>
          <p className="mb-6 text-white/70">
            Consistent spacing with predefined classes for margins and paddings.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'].map((size) => (
              <div key={size} className="flex flex-col items-center">
                <div className={`bg-elvis-pink/20 border border-elvis-pink w-full p-${size} rounded-md mb-2`}></div>
                <span className="text-sm">{size}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Color Palette */}
        <AnimatedSection 
          variant="slideUp" 
          delay={0.5}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-4 text-elvis-pink">Color System</h3>
          <p className="mb-6 text-white/70">
            Our dark theme with vibrant pink and purple accents creates a modern, striking aesthetic.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-dark rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-dark</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-darker rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-darker</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-medium rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-medium</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-light rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-light</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-pink rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-pink</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-magenta rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-magenta</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-elvis-purple rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-purple</div>
            </div>
            <div className="flex flex-col">
              <div className="h-24 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-t-lg"></div>
              <div className="bg-elvis-medium p-2 font-mono text-sm">bg-elvis-gradient</div>
            </div>
          </div>
        </AnimatedSection>

        {/* Animation Showcase */}
        <AnimatedSection 
          variant="fadeIn" 
          delay={0.6}
          className="glass-card p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-elvis-pink">Animation System</h3>
          <p className="mb-6 text-white/70">
            Powerful animations powered by Framer Motion and GSAP for engaging user experiences.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-elvis-light p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-lg font-bold mb-2">Fade In</h4>
              <p className="text-sm text-white/70">Basic fade in animation</p>
            </motion.div>

            <motion.div 
              className="bg-elvis-light p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-2">Slide Up</h4>
              <p className="text-sm text-white/70">Slide up with fade</p>
            </motion.div>

            <motion.div 
              className="bg-elvis-light p-6 rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-2">Scale</h4>
              <p className="text-sm text-white/70">Scale animation</p>
            </motion.div>

            <motion.div 
              className="bg-elvis-light p-6 rounded-lg text-center"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-lg font-bold mb-2">Slide Left</h4>
              <p className="text-sm text-white/70">Slide from left</p>
            </motion.div>

            <motion.div 
              className="bg-elvis-light p-6 rounded-lg text-center"
              initial={{ rotate: -5, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-lg font-bold mb-2">Rotate</h4>
              <p className="text-sm text-white/70">Rotate animation</p>
            </motion.div>

            <motion.div 
              className="bg-elvis-light p-6 rounded-lg text-center overflow-hidden"
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
              >
                <h4 className="text-lg font-bold mb-2">Spring Effect</h4>
                <p className="text-sm text-white/70">Bouncy spring physics</p>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-8">
            <motion.button
              className="bg-elvis-gradient px-6 py-3 rounded-full text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Interactive Button
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
