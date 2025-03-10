
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';

interface AccomplishmentsDisplayProps {
  isInView: boolean;
}

const AccomplishmentsDisplay: React.FC<AccomplishmentsDisplayProps> = ({ isInView }) => {
  const { data: contentData, isLoading } = useContent('accomplishments');
  const [title, setTitle] = useState('Key Accomplishments');
  const [subtitle, setSubtitle] = useState('Highlights of my professional journey');
  const [accomplishments, setAccomplishments] = useState<string[]>([]);
  
  useEffect(() => {
    if (contentData) {
      const titleData = contentData.find(item => item.title === 'accomplishments_title');
      const subtitleData = contentData.find(item => item.title === 'accomplishments_subtitle');
      const itemsData = contentData.find(item => item.title === 'accomplishments_items');
      
      if (titleData) setTitle(titleData.content || 'Key Accomplishments');
      if (subtitleData) setSubtitle(subtitleData.content || 'Highlights of my professional journey');
      
      if (itemsData && itemsData.content) {
        try {
          const parsedItems = JSON.parse(itemsData.content);
          if (Array.isArray(parsedItems)) {
            setAccomplishments(parsedItems);
          }
        } catch (error) {
          console.error('Error parsing accomplishments:', error);
          // Set fallback accomplishments
          setAccomplishments([
            'Directed award-winning commercial campaigns for major brands',
            'Shot and edited over 200 professional wedding videos',
            'Collaborated with international clients across 3 continents',
            'Trained over 50 aspiring videographers in advanced techniques',
            'Featured in 5 industry-leading videography publications'
          ]);
        }
      } else {
        // Set fallback accomplishments
        setAccomplishments([
          'Directed award-winning commercial campaigns for major brands',
          'Shot and edited over 200 professional wedding videos',
          'Collaborated with international clients across 3 continents',
          'Trained over 50 aspiring videographers in advanced techniques',
          'Featured in 5 industry-leading videography publications'
        ]);
      }
    }
  }, [contentData]);
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl border border-white/10 mt-6 animate-pulse">
        <div className="h-7 w-40 bg-white/10 rounded mb-2"></div>
        <div className="h-5 w-64 bg-white/10 rounded mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-white/10 mt-0.5"></div>
              <div className="h-5 w-full bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6 rounded-xl border border-white/10 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-2">
        <span className="h-5 w-1 bg-elvis-pink rounded-full mr-2"></span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-white/70 text-sm mb-6">{subtitle}</p>
      
      <div className="space-y-3">
        {accomplishments.map((accomplishment, index) => (
          <motion.div 
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <div className="bg-elvis-dark p-1 rounded-full border border-elvis-pink/30 mr-3 mt-0.5">
              <Check className="h-3.5 w-3.5 text-elvis-pink" />
            </div>
            <p className="text-white/80 leading-relaxed text-sm">{accomplishment}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AccomplishmentsDisplay;
