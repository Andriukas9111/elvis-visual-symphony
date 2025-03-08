
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Video, Award, Users } from 'lucide-react';

const statsData = [
  { id: 1, icon: <Camera className="h-8 w-8 text-elvis-pink" />, value: '350+', label: 'Photo Projects' },
  { id: 2, icon: <Video className="h-8 w-8 text-elvis-pink" />, value: '120+', label: 'Video Productions' },
  { id: 3, icon: <Award className="h-8 w-8 text-elvis-pink" />, value: '28', label: 'Industry Awards' },
  { id: 4, icon: <Users className="h-8 w-8 text-elvis-pink" />, value: '45+', label: 'Happy Clients' }
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

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

  // Animation for number counting
  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

  return (
    <div 
      ref={sectionRef} 
      className={`py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-elvis-dark to-elvis-medium relative section-animate ${isVisible ? 'animate-in' : ''}`}
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-elvis-pink/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-elvis-purple/5 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tighter">
            <span>About </span>
            <span className="text-gradient font-script">Elvis Creative</span>
          </h2>
          <p className="text-white/70 text-lg">
            We are a premier photography and videography studio specializing in creating visual stories that captivate and inspire. Our team combines technical expertise with artistic vision to deliver exceptional visual content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555952494-efd681c7e3f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Creative process" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-elvis-pink rounded-2xl -z-10"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-elvis-purple rounded-2xl -z-10"></div>
          </div>
          
          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold">Our Creative Philosophy</h3>
            <p className="text-white/70">
              At Elvis Creative, we believe that every image should tell a story and every video should evoke emotion. Our approach combines technical excellence with a deep understanding of visual storytelling.
            </p>
            <p className="text-white/70">
              We collaborate closely with our clients to understand their vision and bring it to life through our creative expertise. Whether it's a commercial project, wedding videography, or artistic photography, we deliver results that exceed expectations.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-10">
              {statsData.map((stat, index) => (
                <div key={stat.id} className="text-center">
                  <div className="mb-3 mx-auto">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white">
                    {counters[index]}{stat.value.includes('+') ? '+' : ''}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
