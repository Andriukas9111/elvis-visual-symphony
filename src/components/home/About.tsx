
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Video, Award, Users } from 'lucide-react';

const statsData = [
  { id: 1, icon: <Camera className="h-8 w-8 text-elvis-pink" />, value: '350+', label: 'Photo Projects' },
  { id: 2, icon: <Video className="h-8 w-8 text-elvis-pink" />, value: '120+', label: 'Video Productions' },
  { id: 3, icon: <Award className="h-8 w-8 text-elvis-pink" />, value: '28', label: 'Industry Awards' },
  { id: 4, icon: <Users className="h-8 w-8 text-elvis-pink" />, value: '45+', label: 'Happy Clients' }
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isInView) return;

    const targetValues = statsData.map(stat => parseInt(stat.value.replace(/\D/g, '')));
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCounters(targetValues.map(value => Math.floor(value * progress)));
      
      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-24 bg-gradient-to-b from-elvis-dark to-elvis-darker relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-elvis-pink/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-elvis-purple/5 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <span>About </span>
            <span className="text-gradient font-script">Elvis Creative</span>
          </motion.h2>
          
          <motion.p 
            className="text-white/70 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            I'm a professional videographer and cinematographer with over 8 years of experience creating visual stories that captivate and inspire. My passion lies in crafting cinematic moments that leave a lasting impression.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555952494-efd681c7e3f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Creative process" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-elvis-pink rounded-2xl -z-10"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-elvis-purple rounded-2xl -z-10"></div>
          </motion.div>
          
          <div className="space-y-8">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              My Creative Philosophy
            </motion.h3>
            
            <motion.p 
              className="text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              I believe that every image should tell a story and every video should evoke emotion. My approach combines technical excellence with a deep understanding of visual storytelling.
            </motion.p>
            
            <motion.p 
              className="text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              I collaborate closely with my clients to understand their vision and bring it to life through my creative expertise. Whether it's a commercial project, wedding videography, or artistic photography, I deliver results that exceed expectations.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-2 gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {statsData.map((stat, index) => (
                <div key={stat.id} className="text-center">
                  <div className="mb-3 mx-auto">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white">
                    {counters[index]}{stat.value.includes('+') ? '+' : ''}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
