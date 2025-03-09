
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Camera, Award, Clock, Users, Play, ThumbsUp, Zap, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection, { AnimatedItem } from '@/components/layout/AnimatedSection';

const services = [
  {
    icon: <Camera className="w-10 h-10 text-elvis-pink" />,
    title: "Professional Videography",
    description: "Cinematic quality footage with state-of-the-art equipment"
  },
  {
    icon: <Edit className="w-10 h-10 text-elvis-pink" />,
    title: "Expert Editing",
    description: "Seamless cuts, color grading, and effects that tell your story"
  },
  {
    icon: <ThumbsUp className="w-10 h-10 text-elvis-pink" />,
    title: "Client Satisfaction",
    description: "Collaborative approach ensuring your vision comes to life"
  },
  {
    icon: <Zap className="w-10 h-10 text-elvis-pink" />,
    title: "Fast Delivery",
    description: "Quick turnaround without compromising on quality"
  }
];

const stats = [
  { value: 120, label: "Projects Completed", icon: <Play /> },
  { value: 15, label: "Years Experience", icon: <Clock /> },
  { value: 93, label: "Satisfied Clients", icon: <Users /> },
  { value: 27, label: "Awards Won", icon: <Award /> }
];

// Animated counter component
const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  
  React.useEffect(() => {
    if (inView) {
      let start = 0;
      const end = Math.min(value, 999);
      const incrementTime = Math.floor(duration * 1000 / end);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);
      
      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);
  
  return <span ref={nodeRef}>{inView ? count : 0}</span>;
};

// 3D Card component with hover effect
const Card3D = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = (centerX - x) / 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };
  
  return (
    <div 
      className={cn("perspective-container", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="transform-3d w-full h-full rounded-xl bg-elvis-medium p-6"
        style={{ 
          rotateX: rotateX, 
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Main component
const WhyHireMe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  
  // Smooth animation for parallax
  const smoothY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 20 });
  const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  
  return (
    <section id="why-hire-me" ref={containerRef} className="relative py-20 md:py-32 overflow-hidden bg-elvis-darker">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-neon-grid bg-grid-lg opacity-20"></div>
      
      {/* Parallax background elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-elvis-pink/10 blur-3xl"
        style={{ y: smoothY1, x: smoothY2, scale: smoothScale }}
      />
      <motion.div 
        className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-elvis-purple/10 blur-3xl"
        style={{ y: smoothY2, rotate: smoothRotate }}
      />
      
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <AnimatedSection variant="fadeInUp" className="mb-16 text-center">
          <h2 className="text-gradient mb-4">Why Hire Me</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            I bring your vision to life through the lens, creating captivating visual stories that resonate with your audience.
          </p>
        </AnimatedSection>
        
        {/* Split-screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Services */}
          <AnimatedSection 
            variant="fadeInLeft" 
            delay={0.2} 
            className="space-y-8"
            staggerChildren={true}
            staggerDelay={0.1}
          >
            <h3 className="text-heading-3 mb-8">Expert Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <AnimatedItem
                  key={index}
                  variant="fadeInUp"
                  delay={index * 0.1}
                  className="relative"
                >
                  <Card3D>
                    <div className="flex flex-col h-full">
                      <div className="mb-4 text-elvis-pink">{service.icon}</div>
                      <h4 className="text-heading-4 mb-2">{service.title}</h4>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                  </Card3D>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
          
          {/* Right side - Stats and video clip */}
          <AnimatedSection variant="fadeInRight" delay={0.4} className="space-y-12">
            {/* Video teaser with custom border */}
            <div className="relative rounded-xl overflow-hidden glow-border">
              <div className="aspect-video rounded-xl overflow-hidden bg-elvis-medium">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-elvis-pink/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-elvis-pink/30 transition-colors duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark/80 to-transparent z-[1]"></div>
                <div className="absolute bottom-4 left-4 z-[2] text-white">
                  <span className="text-sm bg-elvis-pink px-2 py-1 rounded-md">Showreel</span>
                </div>
                <div className="h-full w-full bg-[url('https://placehold.co/1920x1080/252525/FFFFFF')] bg-cover bg-center"></div>
              </div>
            </div>
            
            {/* Stats counter */}
            <div>
              <h3 className="text-heading-3 mb-6">By The Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <AnimatedItem
                    key={index}
                    variant="fadeInUp"
                    delay={0.2 + index * 0.1}
                    className="bg-elvis-medium/50 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="text-elvis-pink mb-2">{stat.icon}</div>
                    <div className="text-4xl font-bold mb-1">
                      <Counter value={stat.value} />+
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </AnimatedItem>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Call to action */}
        <AnimatedSection variant="fadeInUp" delay={0.6} className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-heading-3 mb-4">Ready to Collaborate?</h3>
            <p className="text-gray-300 mb-8">Let's create something extraordinary together. Your vision, my expertise.</p>
            <motion.button 
              className="btn-primary py-3 px-8 rounded-full text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyHireMe;
