
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Video, Camera, Film, Edit, Zap, Users, Clock, Shield } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Cinematic Videography',
    description: 'Professional film-quality videos for brands, events, and creative projects.',
    icon: <Video className="h-12 w-12 text-elvis-pink" />,
    color: 'from-pink-500/20 to-purple-500/20'
  },
  {
    id: 2,
    title: 'Photography',
    description: 'High-quality photography for commercial, portrait, and artistic purposes.',
    icon: <Camera className="h-12 w-12 text-elvis-pink" />,
    color: 'from-purple-500/20 to-blue-500/20'
  },
  {
    id: 3,
    title: 'Video Production',
    description: 'End-to-end production services from concept development to final delivery.',
    icon: <Film className="h-12 w-12 text-elvis-pink" />,
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    id: 4,
    title: 'Post-Production',
    description: 'Professional editing, color grading, and motion graphics for visual content.',
    icon: <Edit className="h-12 w-12 text-elvis-pink" />,
    color: 'from-indigo-500/20 to-pink-500/20'
  }
];

const benefits = [
  {
    id: 1,
    title: 'Fast Turnaround',
    description: 'Quick delivery without compromising on quality.',
    icon: <Clock className="h-6 w-6 text-elvis-pink" />
  },
  {
    id: 2,
    title: 'Creative Excellence',
    description: 'Unique artistic vision for standout results.',
    icon: <Zap className="h-6 w-6 text-elvis-pink" />
  },
  {
    id: 3,
    title: 'Client Collaboration',
    description: 'Working closely with you throughout the process.',
    icon: <Users className="h-6 w-6 text-elvis-pink" />
  },
  {
    id: 4,
    title: 'Quality Guaranteed',
    description: 'Professional results you can rely on.',
    icon: <Shield className="h-6 w-6 text-elvis-pink" />
  }
];

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 bg-gradient-to-b from-elvis-darker to-elvis-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-elvis-pink/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-elvis-purple/5 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient">Professional</span> Services
          </h2>
          <p className="text-white/70 text-lg">
            Comprehensive video and photography services tailored to your unique vision and requirements.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="glass-card hover-card overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              <div className="p-8 relative z-10 h-full flex flex-col">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-white/70 text-sm mb-6">{service.description}</p>
                <div className="mt-auto">
                  <span className="text-elvis-pink text-sm font-medium flex items-center">
                    Learn More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3">Why Choose My Services</h3>
            <p className="text-white/70">
              When you work with me, you're not just getting a service provider - you're getting a creative partner dedicated to bringing your vision to life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                className="flex items-start gap-4 p-6 glass-card hover-card"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="bg-elvis-pink/20 p-3 rounded-lg flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">{benefit.title}</h4>
                  <p className="text-white/70">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
