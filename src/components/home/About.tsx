
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Video, Award, Users, Film, Clapperboard, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Card3D from '../hire-me/Card3D';

const statsData = [
  { id: 1, icon: <Camera className="h-8 w-8 text-elvis-pink" />, value: '350+', label: 'Photo Projects' },
  { id: 2, icon: <Video className="h-8 w-8 text-elvis-pink" />, value: '120+', label: 'Video Productions' },
  { id: 3, icon: <Award className="h-8 w-8 text-elvis-pink" />, value: '28', label: 'Industry Awards' },
  { id: 4, icon: <Users className="h-8 w-8 text-elvis-pink" />, value: '45+', label: 'Happy Clients' }
];

const skills = [
  { icon: <Film className="h-6 w-6" />, label: 'Cinematography' },
  { icon: <Clapperboard className="h-6 w-6" />, label: 'Film Production' },
  { icon: <Camera className="h-6 w-6" />, label: 'Photography' },
  { icon: <Video className="h-6 w-6" />, label: 'Video Editing' },
  { icon: <Star className="h-6 w-6" />, label: 'Visual Effects' },
  { icon: <Award className="h-6 w-6" />, label: 'Color Grading' },
];

// Testimonial data with requested clients
const testimonials = [
  {
    id: 1,
    quote: "Elvis brings an exceptional level of creativity and technical skill to every project. His ability to capture the perfect moment and transform it into a compelling visual story is truly remarkable.",
    name: "Andrew K",
    company: "Nixon Coffee",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: 2,
    quote: "Working with Elvis was a game-changer for our brand. The videos he created perfectly captured our essence and helped us connect with our audience in ways we never imagined possible.",
    name: "Rusne K",
    company: "Cats and Boots",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=2574"
  },
  {
    id: 3,
    quote: "Elvis has a unique eye for detail that sets him apart. His work for our campaign exceeded expectations and delivered measurable results. I wouldn't hesitate to recommend him.",
    name: "Sarah Thompson",
    company: "Luminous Studios",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=2574"
  }
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-24 bg-gradient-to-b from-elvis-dark to-elvis-darker relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-elvis-pink/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-elvis-purple/5 blur-[100px] rounded-full"></div>
      <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-elvis-pink/30 rounded-full animate-pulse-glow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-elvis-purple/20 rounded-full animate-float"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <img 
                src="/lovable-uploads/4b1271b8-e1a8-494f-a510-e17f286adf45.png" 
                alt="Elvis with camera equipment" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark/80 to-transparent opacity-60"></div>
              
              {/* Aperture overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="aperture-indicator w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-elvis-pink rounded-2xl -z-10 animate-pulse-glow"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-elvis-purple rounded-2xl -z-10"></div>
          </motion.div>
          
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold"
              variants={itemVariants}
            >
              My Story
            </motion.h3>
            
            <motion.div 
              className="text-white/70 space-y-4"
              variants={itemVariants}
            >
              <p>
                Hi there! My name is Elvis and I'm a videographer based in the United Kingdom. I originally come from Lithuania, a small country located in the centre of Europe. I like to say that I was put on this earth to make videos and share my vision with others.
              </p>
              
              <p>
                I filmed and edited my first "project" when I was around 10 years old and from that moment I already knew what my career path will be. I never tried looking for anything else that I'd like to do and just stuck with filming and editing videos.
              </p>
              
              <p>
                I grew up in the times when social media was just becoming the thing so I closely watched how this space evolved into what it is now. I'm very familiar with the idea of social media and what type of content works for different niches, which makes me capable of narrowing down exactly what clients are looking for and help them to promote their content/product.
              </p>
              
              <p>
                I enjoy working closely with people and understanding their vision, ideas and passions. I believe that communication is key when it comes to working in creative media. My goal is to bring your vision to life and through that reach your desired audience.
              </p>
            </motion.div>
            
            {/* Skills section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-bold mb-4">Areas of Expertise</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card3D>
                      <div className="p-1 text-center">
                        <div className="flex justify-center mb-2 text-elvis-pink">
                          {skill.icon}
                        </div>
                        <p className="text-sm font-medium">{skill.label}</p>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 gap-6 mt-10"
              variants={itemVariants}
            >
              {statsData.map((stat, index) => (
                <motion.div 
                  key={stat.id}
                  className="text-center glass-card p-4 rounded-xl hover:shadow-pink-glow transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="mb-3 mx-auto bg-elvis-medium/50 w-16 h-16 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 + (index * 0.1) }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl font-bold text-gradient">
                    {counters[index]}{stat.value.includes('+') ? '+' : ''}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Testimonials Carousel */}
        <motion.div 
          className="max-w-4xl mx-auto mt-16 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">Client Testimonials</h3>
          
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className={`p-8 glass-card rounded-2xl transition-all duration-500 ${index === currentTestimonial ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 absolute inset-0 z-10'}`}
                initial={false}
              >
                <div className="absolute -top-5 left-10 text-6xl text-elvis-pink opacity-30">"</div>
                <blockquote className="text-center text-lg italic text-white/80 mb-6 relative z-10">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-white/60">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Testimonial navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-elvis-pink scale-125' : 'bg-white/30'}`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
