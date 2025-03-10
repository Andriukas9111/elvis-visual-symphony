
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Video, Award, Users, Film, Clapperboard, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Navigation functions for testimonials
  const goToPrevious = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentTestimonial((prev) => 
      (prev + 1) % testimonials.length
    );
  };

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
      className="py-20 bg-elvis-dark relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-elvis-pink/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-elvis-purple/10 blur-[100px] rounded-full"></div>
      <div className="absolute top-1/4 left-1/3 w-24 h-24 border border-elvis-pink/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/3 w-32 h-32 border border-elvis-purple/10 rounded-full animate-float"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter"
          >
            <span>About </span>
            <span className="text-gradient font-script">Elvis Creative</span>
          </motion.h2>
          
          <motion.div 
            className="h-1 w-24 bg-elvis-gradient mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          
          <motion.p 
            className="text-white/70 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            I'm a professional videographer and cinematographer with over 8 years of experience creating visual stories that captivate and inspire.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Photo Column */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-elvis-purple/40 rounded-lg -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-elvis-pink/40 rounded-lg -z-10"></div>
              
              {/* Main photo */}
              <div className="rounded-xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 bg-elvis-gradient opacity-10 z-10"></div>
                <img 
                  src="/lovable-uploads/4b1271b8-e1a8-494f-a510-e17f286adf45.png" 
                  alt="Elvis with camera equipment" 
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Photo overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark/90 via-transparent to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-elvis-pink rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white/80">Videographer & Cinematographer</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {statsData.map((stat, index) => (
                <motion.div 
                  key={stat.id}
                  className="glass-card rounded-xl p-4 border border-white/5 hover:border-elvis-pink/20 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(255, 0, 255, 0.3)' }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 bg-elvis-medium/80 w-12 h-12 rounded-full flex items-center justify-center shadow-pink-glow">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gradient mb-1">
                      {counters[index]}{stat.value.includes('+') ? '+' : ''}
                    </div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Content Column */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3 
              className="text-2xl font-bold inline-flex items-center space-x-2"
              variants={itemVariants}
            >
              <span className="h-6 w-1 bg-elvis-pink rounded-full mr-2"></span>
              My Story
            </motion.h3>
            
            <motion.div 
              className="text-white/80 space-y-4 prose prose-invert max-w-none"
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
            </motion.div>
            
            {/* Skills section */}
            <motion.div variants={itemVariants} className="pt-4">
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <span className="h-5 w-1 bg-elvis-purple rounded-full mr-2"></span>
                Areas of Expertise
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                    whileHover={{ y: -5 }}
                  >
                    <Card3D>
                      <div className="p-4 text-center h-full">
                        <div className="flex justify-center mb-3">
                          <div className="h-10 w-10 rounded-full bg-elvis-medium flex items-center justify-center text-elvis-pink">
                            {skill.icon}
                          </div>
                        </div>
                        <p className="font-medium">{skill.label}</p>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Testimonials Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-2">Client Testimonials</h3>
            <div className="h-1 w-20 bg-elvis-gradient mx-auto mb-4"></div>
            <p className="text-white/60 max-w-lg mx-auto">What clients say about working with Elvis Creative</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Testimonial Cards */}
              <div className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`transition-opacity duration-500 ${index === currentTestimonial ? 'block' : 'hidden'}`}
                  >
                    <div className="grid md:grid-cols-12 items-center">
                      {/* Client image */}
                      <div className="md:col-span-4 bg-elvis-medium flex flex-col items-center justify-center py-8 px-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-elvis-pink/30 mb-4">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="absolute inset-0 rounded-full border border-elvis-pink/20 animate-pulse-slow -m-1"></div>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{testimonial.name}</h4>
                        <p className="text-elvis-pink text-sm">{testimonial.company}</p>
                      </div>
                      
                      {/* Testimonial text */}
                      <div className="md:col-span-8 p-8 relative">
                        <svg className="absolute top-6 left-6 h-10 w-10 text-elvis-pink/20" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        
                        <blockquote className="relative z-10 text-lg italic text-white/90 ml-6">
                          {testimonial.quote}
                        </blockquote>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 px-4 z-10">
                <button 
                  onClick={goToPrevious}
                  className="h-10 w-10 rounded-full bg-elvis-medium/80 hover:bg-elvis-pink border border-elvis-pink/30 flex items-center justify-center backdrop-blur-sm transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={goToNext}
                  className="h-10 w-10 rounded-full bg-elvis-medium/80 hover:bg-elvis-pink border border-elvis-pink/30 flex items-center justify-center backdrop-blur-sm transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'w-6 bg-elvis-pink' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
