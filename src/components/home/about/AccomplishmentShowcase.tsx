
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, Award, Calendar, Trophy, CheckCircle, Star } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';

interface AccomplishmentShowcaseProps {
  isInView: boolean;
}

const AccomplishmentShowcase: React.FC<AccomplishmentShowcaseProps> = ({ isInView }) => {
  const { data: contentData, isLoading } = useContent('accomplishments');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isInView]);

  // Fallback accomplishments in case none are in the database
  const fallbackAccomplishments = [
    {
      id: '1',
      value: '300+',
      label: 'Projects Completed',
      icon: <CheckCircle size={28} className="text-elvis-pink" strokeWidth={1.5} />,
      color: 'from-pink-500/20 to-purple-500/20'
    },
    {
      id: '2',
      value: '5M+',
      label: 'Video Views',
      icon: <Video size={28} className="text-elvis-pink" strokeWidth={1.5} />,
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      id: '3',
      value: '8+',
      label: 'Years Experience',
      icon: <Calendar size={28} className="text-elvis-pink" strokeWidth={1.5} />,
      color: 'from-green-500/20 to-blue-500/20'
    },
    {
      id: '4',
      value: '20+',
      label: 'Awards Won',
      icon: <Trophy size={28} className="text-elvis-pink" strokeWidth={1.5} />,
      color: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: '5',
      value: '96%',
      label: 'Client Satisfaction',
      icon: <Star size={28} className="text-elvis-pink" strokeWidth={1.5} />,
      color: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  // Map database content to accomplishments, or use fallbacks
  const accomplishments = React.useMemo(() => {
    if (!contentData || contentData.length === 0) return fallbackAccomplishments;

    // Try to find accomplishments in content data
    const accomplishmentsData = contentData.find(item => item.content && Array.isArray(JSON.parse(item.content)));
    
    if (!accomplishmentsData) return fallbackAccomplishments;
    
    try {
      const parsedData = JSON.parse(accomplishmentsData.content);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData.map(item => {
          let iconComponent;
          switch (item.icon) {
            case 'CheckCircle': iconComponent = <CheckCircle size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            case 'Video': iconComponent = <Video size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            case 'Calendar': iconComponent = <Calendar size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            case 'Trophy': iconComponent = <Trophy size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            case 'Star': iconComponent = <Star size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            case 'Clock': iconComponent = <Clock size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            case 'Award': iconComponent = <Award size={28} className="text-elvis-pink" strokeWidth={1.5} />; break;
            default: iconComponent = <Star size={28} className="text-elvis-pink" strokeWidth={1.5} />;
          }
          
          return {
            ...item,
            icon: iconComponent
          };
        });
      }
    } catch (error) {
      console.error("Error parsing accomplishments data:", error);
    }
    
    return fallbackAccomplishments;
  }, [contentData]);

  if (isLoading) {
    return (
      <div className="w-full glass-card p-6 rounded-xl border border-white/10 animate-pulse">
        <div className="flex items-center mb-6">
          <div className="h-8 w-2 bg-white/20 rounded-full mr-3"></div>
          <div className="h-8 w-48 bg-white/20 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-32 rounded-lg bg-white/5"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-8">
        <span className="h-8 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h2 className="text-3xl font-bold text-white">Key Accomplishments</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {accomplishments.map((item, index) => (
          <motion.div 
            key={item.id}
            className={`glass-card rounded-xl border border-white/10 hover:border-elvis-pink/30 bg-gradient-to-br ${item.color} p-6 flex flex-col items-center text-center h-full justify-center`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={animate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 10px 25px -5px rgba(255, 0, 255, 0.1)'
            }}
          >
            <div className="rounded-full bg-elvis-dark/50 p-3 mb-4">
              {item.icon}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{item.value}</h3>
            <p className="text-white/60 text-sm">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccomplishmentShowcase;
