import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Camera, Video, Award, Users, Briefcase, GraduationCap, Star, Calendar, CheckCircle } from 'lucide-react';
import { AnimatedItem } from './layout/AnimatedSection';

const statsData = [
  { id: 1, icon: <Camera className="h-8 w-8 text-elvis-pink" />, value: '350+', label: 'Photo Projects' },
  { id: 2, icon: <Video className="h-8 w-8 text-elvis-pink" />, value: '120+', label: 'Video Productions' },
  { id: 3, icon: <Award className="h-8 w-8 text-elvis-pink" />, value: '28', label: 'Industry Awards' },
  { id: 4, icon: <Users className="h-8 w-8 text-elvis-pink" />, value: '45+', label: 'Happy Clients' }
];

const timelineData = [
  {
    id: 1,
    year: '2022 - Present',
    title: 'Senior Videographer',
    company: 'Creative Studios LA',
    description: 'Leading video production for major brands and entertainment projects'
  },
  {
    id: 2,
    year: '2019 - 2022',
    title: 'Cinematographer',
    company: 'Vision Films',
    description: 'Shot documentary and commercial content for international distribution'
  },
  {
    id: 3,
    year: '2017 - 2019',
    title: 'Video Editor',
    company: 'Digital Creatives',
    description: 'Post-production specialist for advertising and social media campaigns'
  },
  {
    id: 4,
    year: '2015 - 2017',
    title: 'Assistant Camera',
    company: 'Indie Film Collective',
    description: 'Supported production teams on independent film projects'
  }
];

const skillsData = [
  { id: 1, name: 'Cinematography', level: 95 },
  { id: 2, name: 'Video Editing', level: 90 },
  { id: 3, name: 'Color Grading', level: 85 },
  { id: 4, name: 'Sound Design', level: 75 },
  { id: 5, name: 'Motion Graphics', level: 70 },
  { id: 6, name: 'Aerial Photography', level: 80 }
];

const TimelineItem = ({ item, index }: { item: typeof timelineData[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={`relative ${index !== timelineData.length - 1 ? 'pb-10' : ''}`}
    >
      {index !== timelineData.length - 1 && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-elvis-pink/30"></div>
      )}
      
      <div className="absolute left-0 top-0 bg-elvis-pink/20 w-8 h-8 rounded-full flex items-center justify-center z-10">
        <div className="w-4 h-4 rounded-full bg-elvis-pink"></div>
      </div>

      <div className="ml-14">
        <div className="flex items-center text-sm text-elvis-pink mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          {item.year}
        </div>
        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
        <div className="text-white/60 mb-2">{item.company}</div>
        <p className="text-white/70">{item.description}</p>
      </div>
    </motion.div>
  );
};

const SkillBar = ({ skill, index }: { skill: typeof skillsData[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        setWidth(skill.level);
      }, index * 200);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, skill.level, index]);

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{skill.name}</div>
        <div className="text-elvis-pink text-sm">{skill.level}%</div>
      </div>
      <div className="w-full h-2 bg-elvis-darker rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-elvis-pink to-elvis-purple"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

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
      id="about"
    >
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-elvis-pink/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-elvis-purple/5 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedItem variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tighter">
              <span>About </span>
              <span className="text-gradient font-script">Elvis Creative</span>
            </h2>
          </AnimatedItem>
          <AnimatedItem variant="fadeInUp" delay={0.1}>
            <p className="text-white/70 text-lg">
              I'm a professional videographer and cinematographer with over 8 years of experience creating visual stories that captivate and inspire. My passion lies in crafting cinematic moments that leave a lasting impression.
            </p>
          </AnimatedItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555952494-efd681c7e3f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Creative process" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-elvis-pink rounded-2xl -z-10"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-elvis-purple rounded-2xl -z-10"></div>
          </div>
          
          <div className="space-y-8">
            <AnimatedItem variant="fadeInUp">
              <h3 className="text-2xl md:text-3xl font-bold">My Creative Philosophy</h3>
            </AnimatedItem>
            <AnimatedItem variant="fadeInUp" delay={0.1}>
              <p className="text-white/70">
                I believe that every image should tell a story and every video should evoke emotion. My approach combines technical excellence with a deep understanding of visual storytelling.
              </p>
            </AnimatedItem>
            <AnimatedItem variant="fadeInUp" delay={0.2}>
              <p className="text-white/70">
                I collaborate closely with my clients to understand their vision and bring it to life through my creative expertise. Whether it's a commercial project, wedding videography, or artistic photography, I deliver results that exceed expectations.
              </p>
            </AnimatedItem>
            
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

        <div className="mb-20">
          <AnimatedItem variant="fadeInUp" className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">My Journey</h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              From assistant camera to senior videographer, my career has been defined by a passion for visual storytelling and continuous growth.
            </p>
          </AnimatedItem>

          <div className="max-w-3xl mx-auto">
            {timelineData.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        <div>
          <AnimatedItem variant="fadeInUp" className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Technical Skills</h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              My diverse skill set allows me to handle every aspect of the production process with confidence and creativity.
            </p>
          </AnimatedItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skillsData.map((skill, index) => (
              <SkillBar key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
