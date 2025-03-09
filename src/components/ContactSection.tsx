
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { AnimatedItem } from './layout/AnimatedSection';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formState.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
        variant: "default",
      });
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        message: '',
      });
    }, 1500);
  };

  // Weekly availability data
  const availabilityData = [
    { day: 'Monday', hours: '9:00 AM - 5:00 PM', available: true },
    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', available: true },
    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', available: true },
    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', available: true },
    { day: 'Friday', hours: '9:00 AM - 3:00 PM', available: true },
    { day: 'Saturday', hours: 'By appointment', available: false },
    { day: 'Sunday', hours: 'Closed', available: false },
  ];
  
  // Current day of the week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  // Adjust to match array index (make Monday index 0)
  const adjustedToday = today === 0 ? 6 : today - 1;
  
  return (
    <section id="contact" className="py-24 px-4 md:px-8 lg:px-12 bg-elvis-darker relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-elvis-pink/10 blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-elvis-purple/10 blur-[120px]"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedItem variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
              <span className="text-gradient">Get in</span> Touch
            </h2>
          </AnimatedItem>
          <AnimatedItem variant="fadeInUp" delay={0.1}>
            <p className="text-white/70 text-lg">
              Have a project in mind or want to discuss a collaboration? I'd love to hear from you!
            </p>
          </AnimatedItem>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info & Availability */}
          <AnimatedItem variant="fadeInLeft" delay={0.2}>
            <div className="space-y-10">
              {/* Contact Details Card */}
              <div className="glass-card p-8 space-y-6">
                <h3 className="text-2xl font-bold mb-6">Contact Details</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-elvis-pink/20 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-elvis-pink" />
                    </div>
                    <div>
                      <h4 className="text-sm text-white/60 mb-1">Email</h4>
                      <p className="font-medium">hello@elviscreative.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-elvis-pink/20 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-elvis-pink" />
                    </div>
                    <div>
                      <h4 className="text-sm text-white/60 mb-1">Phone</h4>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-elvis-pink/20 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-elvis-pink" />
                    </div>
                    <div>
                      <h4 className="text-sm text-white/60 mb-1">Location</h4>
                      <p className="font-medium">123 Creative Ave, Studio 4B<br />Los Angeles, CA 90210</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Availability Card */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Weekly Hours</h3>
                  <div className="bg-elvis-pink/20 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-elvis-pink" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {availabilityData.map((day, index) => (
                    <div 
                      key={day.day} 
                      className={`flex justify-between items-center p-3 rounded-lg border border-transparent transition-colors ${
                        index === adjustedToday ? 'bg-elvis-pink/10 border-elvis-pink/30' : ''
                      }`}
                    >
                      <div className="font-medium">{day.day}</div>
                      <div className="flex items-center">
                        <span className={`text-sm ${day.available ? 'text-white/70' : 'text-white/40'}`}>
                          {day.hours}
                        </span>
                        <div 
                          className={`w-2 h-2 rounded-full ml-3 ${
                            day.available ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedItem>
          
          {/* Contact Form */}
          <AnimatedItem variant="fadeInRight" delay={0.3}>
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`bg-elvis-darker/50 border-elvis-medium ${
                        errors.name ? 'border-red-500' : 'focus:border-elvis-pink'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                        <AlertCircle size={16} />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={`bg-elvis-darker/50 border-elvis-medium ${
                        errors.email ? 'border-red-500' : 'focus:border-elvis-pink'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                        <AlertCircle size={16} />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Your Message
                  </label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      className={`min-h-[120px] bg-elvis-darker/50 border-elvis-medium ${
                        errors.message ? 'border-red-500' : 'focus:border-elvis-pink'
                      }`}
                      placeholder="Tell me about your project..."
                    />
                    {errors.message && (
                      <div className="absolute right-3 top-6 text-red-500">
                        <AlertCircle size={16} />
                      </div>
                    )}
                  </div>
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-elvis-gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
              
              {/* Testimonial */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-start">
                  <div className="text-elvis-pink mr-3 mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm italic text-white/70">
                      "Elvis was exceptionally responsive and professional. He turned our concept into a stunning visual story that perfectly captured our brand."
                    </p>
                    <p className="text-xs text-elvis-pink mt-2">— Alex Johnson, Marketing Director</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedItem>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
