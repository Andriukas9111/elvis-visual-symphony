import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Aperture, Mic, Tv, Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Equipment categories
const categories = [
  { id: 'cameras', label: 'Cameras', icon: <Camera className="mr-2 h-4 w-4" /> },
  { id: 'lenses', label: 'Lenses', icon: <Aperture className="mr-2 h-4 w-4" /> },
  { id: 'audio', label: 'Audio', icon: <Mic className="mr-2 h-4 w-4" /> },
  { id: 'lighting', label: 'Lighting', icon: <Tv className="mr-2 h-4 w-4" /> },
  { id: 'accessories', label: 'Accessories', icon: <Layers className="mr-2 h-4 w-4" /> },
];

// Updated equipment data with new items and images
const equipmentData = {
  cameras: [
    {
      id: 1,
      name: 'Sony FX3 Full-Frame Cinema Line Camera',
      description: 'Compact cinema camera with full-frame sensor',
      specs: ['10.2MP Full-Frame Sensor', 'S-Cinetone Color', '4K 120fps Recording'],
      image: '/lovable-uploads/3ddd8b34-4655-4eae-8519-802a245142b5.png'
    },
    {
      id: 2,
      name: 'Sony A7 III Digital Camera Body',
      description: 'Professional full-frame mirrorless camera',
      specs: ['24.2MP Full-Frame Sensor', '4K HDR Video', '15-Stop Dynamic Range'],
      image: '/lovable-uploads/a9c8ddb2-8f71-40bf-8962-d2011e1e20d9.png'
    },
  ],
  lenses: [
    {
      id: 1,
      name: 'Tamron 28-75mm f2.8 Di III VXD G2',
      description: 'Versatile zoom lens for Sony E-mount',
      specs: ['f/2.8 Constant Aperture', 'VXD Linear Motor', 'Weather-Sealed Construction'],
      image: '/lovable-uploads/e1d0c9d5-77a7-4be1-b6ca-5d9584ac844d.png'
    },
    {
      id: 2,
      name: 'Sigma 30mm f1.4 DC DN Contemporary Lens',
      description: 'Fast prime lens for APS-C sensors',
      specs: ['f/1.4 Maximum Aperture', 'DC DN Design', 'Compact Form Factor'],
      image: '/lovable-uploads/316c12f5-1c46-4458-85ed-a35a84200913.png'
    },
    {
      id: 3,
      name: 'Samyang AF 24mm f1.8 Lens',
      description: 'Wide-angle prime lens with beautiful bokeh',
      specs: ['f/1.8 Maximum Aperture', 'Ultra Multi-Coating', 'Linear STM Motor'],
      image: '/lovable-uploads/3404bb3a-586b-443c-ba43-794bda3e5bdc.png'
    },
  ],
  audio: [
    {
      id: 1,
      name: 'Rode NTG5',
      description: 'Shotgun microphone with natural sound',
      specs: ['Broadcast-grade Shotgun', 'RF-bias Technology', 'Lightweight Design'],
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2670&auto=format&fit=crop'
    },
  ],
  lighting: [
    {
      id: 1,
      name: 'Portkeys LH7P Monitor',
      description: 'Professional field monitor with touch screen',
      specs: ['7" 1900x1200 Display', '1900 nits Brightness', 'HDMI & SDI Inputs'],
      image: '/lovable-uploads/30a11522-2b8b-479b-9633-92a6f4ed8c35.png'
    },
    {
      id: 2,
      name: 'NEEWER F700 7" Camera Field Monitor',
      description: 'Versatile on-camera monitor with advanced features',
      specs: ['4K HDMI Input/Output', 'Touch Screen Control', 'Focus Assist Tools'],
      image: '/lovable-uploads/4731c53b-bed0-427f-8dd8-8568ea2d4798.png'
    },
  ],
  accessories: [
    {
      id: 1,
      name: 'DJI RS 4',
      description: 'Professional 3-axis gimbal stabilizer',
      specs: ['3.1kg Payload', 'LiDAR Focus Motor', 'Wireless Video Transmission'],
      image: '/lovable-uploads/086f2617-429f-4bc1-9c76-d37efc75de98.png'
    },
    {
      id: 2,
      name: 'DJI Mini 4K',
      description: 'Compact drone with 4K camera capabilities',
      specs: ['4K Video Recording', '30 Min Flight Time', 'Intelligent Flight Modes'],
      image: '/lovable-uploads/7fde2c87-9a23-48a5-89e1-318721b3c79b.png'
    },
  ],
};

const Equipment = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  return (
    <section
      ref={sectionRef}
      id="equipment"
      className="py-24 bg-elvis-medium relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      <div className="absolute -top-80 -right-80 w-[500px] h-[500px] rounded-full bg-elvis-pink/5 blur-[120px]"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient">Professional</span> Equipment
          </h2>
          <p className="text-white/70 text-lg">
            I use industry-leading gear to capture cinematic footage and deliver exceptional results for every project.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="cameras" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-transparent w-full">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className={`
                    flex items-center justify-center py-3 rounded-lg border border-transparent 
                    data-[state=active]:border-elvis-pink/50 data-[state=active]:bg-elvis-pink/10
                    data-[state=active]:text-white transition-all duration-300
                  `}
                >
                  {category.icon}
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(equipmentData).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5 
                        }
                      } : { opacity: 0, y: 20 }}
                      className="group"
                    >
                      <div className="glass-card overflow-hidden hover-card h-full">
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-elvis-darker to-transparent opacity-60 z-10"></div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 z-20">
                            <div className="bg-elvis-pink/20 p-2 rounded-full">
                              {category === 'cameras' && <Camera className="text-elvis-pink h-5 w-5" />}
                              {category === 'lenses' && <Aperture className="text-elvis-pink h-5 w-5" />}
                              {category === 'audio' && <Mic className="text-elvis-pink h-5 w-5" />}
                              {category === 'lighting' && <Tv className="text-elvis-pink h-5 w-5" />}
                              {category === 'accessories' && <Layers className="text-elvis-pink h-5 w-5" />}
                            </div>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-white/70 text-sm">{item.description}</p>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-elvis-pink">Key Specifications</h4>
                            <ul className="grid grid-cols-1 gap-1">
                              {item.specs.map((spec, i) => (
                                <li key={i} className="text-xs text-white/60 flex items-start">
                                  <span className="text-elvis-pink mr-1">•</span> {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default Equipment;
