
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  profile_image: string;
  job_title: string;
  story: string;
}

const MyStorySection: React.FC = () => {
  const { data: content, isLoading } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      return data as AboutContent;
    }
  });
  
  // This is the default story content from the image
  const defaultStory = `Hi there! My name's is Elvis and I'm a videographer based in the United Kingdom. I originally come from Lithuania, a small country located in the centre of Europe. I like to say that I was put on this earth to make videos and share my vision with others. I filmed and edited my first "project" when I was around 10 years old and from that moment I already knew what my career path will be. I never tried looking for anything else that I'd like to do and just stuck with filming and editing videos. I grew up in the times when social media was just becoming the thing so I closely watched how this space evolved into what it is now. I'm very familiar with the idea of social media and what type of content works for different niches, which makes me capable of narrowing down exactly what clients are looking for and help them to promote their content/product.I enjoy working closely with people and understanding their vision, ideas and passions. I believe that communication is key when it comes to working in creative media. My goal is to bring your vision to life and through that reach your desired audience.`;
  
  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-elvis-dark">
        <div className="container mx-auto px-4">
          <SectionHeading title="My Story" />
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
            <div className="h-80 rounded-lg bg-elvis-medium animate-pulse md:w-1/3" />
            <div className="md:w-2/3 space-y-4">
              <div className="h-6 w-3/4 bg-elvis-medium animate-pulse rounded" />
              <div className="h-6 w-full bg-elvis-medium animate-pulse rounded" />
              <div className="h-6 w-full bg-elvis-medium animate-pulse rounded" />
              <div className="h-6 w-1/2 bg-elvis-medium animate-pulse rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8 md:py-12 bg-elvis-dark" id="my-story">
      <div className="container mx-auto px-4">
        <SectionHeading title="My Story" />
        
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative md:w-5/12"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-elvis-purple/30">
              <img 
                src={content?.profile_image || "public/lovable-uploads/0680153d-4a15-455a-b5dc-ce3e5ffc43bc.png"} 
                alt="Elvis Creative" 
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-elvis-pink px-4 py-2 rounded-full flex items-center space-x-2">
                <span className="text-white text-sm font-medium">
                  {content?.job_title || "Videographer & Cinematographer"}
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-7/12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="prose prose-lg prose-invert max-w-none">
              {content?.story ? (
                <div dangerouslySetInnerHTML={{ __html: content.story }} />
              ) : (
                <p className="text-white/80 leading-relaxed text-base md:text-lg">{defaultStory}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MyStorySection;
