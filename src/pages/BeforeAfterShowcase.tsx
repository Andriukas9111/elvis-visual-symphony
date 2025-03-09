
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import TransformationGallery from '@/components/TransformationGallery';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sample data - in a real app, this would come from your backend
const transformationExamples = [
  {
    id: 'cinematic-1',
    title: 'Cinematic LUT: Film Noir',
    description: 'Transform your footage into a moody, high-contrast film noir style',
    beforeImage: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=1920',
    afterImage: 'https://images.unsplash.com/photo-1685901088371-f389349297da?q=80&w=1920',
  },
  {
    id: 'vintage-1',
    title: 'Vintage LUT: 70s Film',
    description: 'Add a warm, vintage film look inspired by 1970s photography',
    beforeImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1920',
    afterImage: 'https://images.unsplash.com/photo-1611816055460-618287c870bd?q=80&w=1920',
  },
  {
    id: 'modern-1',
    title: 'Modern LUT: Teal & Orange',
    description: 'The iconic Hollywood blockbuster look with teal shadows and orange highlights',
    beforeImage: 'https://images.unsplash.com/photo-1610963196817-7d1415647029?q=80&w=1920',
    afterImage: 'https://images.unsplash.com/photo-1563656157432-67560b52d0c4?q=80&w=1920',
  },
];

const BeforeAfterShowcase = () => {
  const location = useLocation();
  const [activeExampleId, setActiveExampleId] = React.useState<string | null>(null);

  useEffect(() => {
    // Check if there's an example ID in the URL
    const params = new URLSearchParams(location.search);
    const exampleId = params.get('example');
    
    if (exampleId) {
      setActiveExampleId(exampleId);
      
      // Find the example and scroll to it
      const exampleIndex = transformationExamples.findIndex(ex => ex.id === exampleId);
      if (exampleIndex !== -1) {
        document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const heroExample = transformationExamples[0];

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Vision</h1>
                <p className="text-lg text-gray-300 mb-6">
                  Experience the power of our color grading LUTs with our interactive before/after comparison tool.
                  See how our professional LUTs can elevate your footage with just one click.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-elvis-gradient">
                    Browse Products
                  </Button>
                  <Button variant="outline" className="border-elvis-pink text-white">
                    Learn More
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-xl overflow-hidden shadow-lg shadow-elvis-pink/20"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <BeforeAfterSlider
                          beforeImage={heroExample.beforeImage}
                          afterImage={heroExample.afterImage}
                          aspectRatio={16/9}
                        />
                        <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
                          <HelpCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-elvis-medium border-elvis-pink">
                      <p>Drag the slider to compare before and after</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Transformation Gallery */}
        <section id="gallery" className="py-16 bg-elvis-darker">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Transformation Gallery</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Explore our collection of before and after examples showcasing the dramatic effects 
                our LUTs can achieve across different shooting conditions and styles.
              </p>
            </motion.div>

            <TransformationGallery examples={transformationExamples} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-elvis-gradient">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Content?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get access to our premium LUTs and take your visual content to the next level.
            </p>
            <Button size="lg" className="bg-white text-elvis-pink hover:bg-white/90">
              Shop Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BeforeAfterShowcase;
