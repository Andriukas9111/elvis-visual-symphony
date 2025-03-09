
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Mic, Aperture, Tv, Layers } from 'lucide-react';
import { AnimatedItem } from './layout/AnimatedSection';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

// Equipment categories with their respective icons
const categories = [
  { id: 'cameras', label: 'Cameras', icon: <Camera className="mr-2 h-4 w-4" /> },
  { id: 'lenses', label: 'Lenses', icon: <Aperture className="mr-2 h-4 w-4" /> },
  { id: 'audio', label: 'Audio', icon: <Mic className="mr-2 h-4 w-4" /> },
  { id: 'lighting', label: 'Lighting', icon: <Tv className="mr-2 h-4 w-4" /> },
  { id: 'accessories', label: 'Accessories', icon: <Layers className="mr-2 h-4 w-4" /> },
];

// Equipment data organized by category
const equipmentData = {
  cameras: [
    {
      id: 1,
      name: 'Sony FX6',
      description: 'Full-frame cinema camera with 4K 120fps capability',
      specs: ['10.2MP Full-Frame Sensor', 'S-Cinetone Color', 'Dual Base ISO', '15+ Stops Dynamic Range'],
      image: 'https://images.unsplash.com/photo-1589872307379-0ffdf9829123?q=80&w=2574&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'RED Komodo 6K',
      description: 'Compact cinema camera with 6K resolution',
      specs: ['Super 35mm Sensor', 'Global Shutter', 'Canon RF Mount', 'REDCODE RAW'],
      image: 'https://images.unsplash.com/photo-1589872307379-0ffdf9829123?q=80&w=2574&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Blackmagic Pocket 6K',
      description: 'Affordable cinema camera with professional features',
      specs: ['Super 35mm Sensor', 'EF Lens Mount', 'Dual Native ISO', 'BRAW Recording'],
      image: 'https://images.unsplash.com/photo-1589872307379-0ffdf9829123?q=80&w=2574&auto=format&fit=crop'
    },
  ],
  lenses: [
    {
      id: 1,
      name: 'Canon CN-E 24mm T1.5',
      description: 'Professional cinema prime lens',
      specs: ['T1.5 Aperture', 'Manual Focus', '114mm Front Diameter', 'EF Mount'],
      image: 'https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Sony G Master 16-35mm f/2.8',
      description: 'Ultra-wide zoom lens for landscapes and interiors',
      specs: ['f/2.8 Constant Aperture', 'Nano AR Coating', 'Dust & Moisture Resistant', 'XD Linear Motors'],
      image: 'https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Rokinon Cine DS 85mm T1.5',
      description: 'Budget-friendly cinema prime for portraits',
      specs: ['T1.5 Aperture', 'De-clicked Aperture', 'Geared Focus & Aperture', 'Multi-Mount Options'],
      image: 'https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2670&auto=format&fit=crop'
    },
  ],
  audio: [
    {
      id: 1,
      name: 'Rode NTG5',
      description: 'Shotgun microphone with natural sound',
      specs: ['Broadcast-grade Shotgun', 'RF-bias Technology', 'Lightweight Design', 'Low Self-Noise'],
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Sennheiser MKH 416',
      description: 'Industry standard shotgun microphone',
      specs: ['Supercardioid Pattern', 'Phantom Power', 'Low Noise', 'Weather Resistant'],
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2670&auto=format&fit=crop'
    },
  ],
  lighting: [
    {
      id: 1,
      name: 'Aputure 300d Mark II',
      description: 'Powerful LED light with bowens mount',
      specs: ['350W Output', 'Bowens Mount', 'CRI/TLCI 96+', 'DMX Control'],
      image: 'https://images.unsplash.com/photo-1533228705496-072ca765170e?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Godox SL-60W',
      description: 'Affordable LED light for studio and location',
      specs: ['60W Output', 'Bowens Mount', '5600K Color Temperature', 'Wireless Control'],
      image: 'https://images.unsplash.com/photo-1533228705496-072ca765170e?q=80&w=2670&auto=format&fit=crop'
    },
  ],
  accessories: [
    {
      id: 1,
      name: 'DJI Ronin S2',
      description: 'Professional gimbal stabilizer for cinema cameras',
      specs: ['4.5kg Payload', 'ActiveTrack 5.0', '14hr Battery Life', 'Wireless Control'],
      image: 'https://images.unsplash.com/photo-1612175443456-3c397f4d7d37?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Atomos Ninja V',
      description: '5" HDR monitor-recorder',
      specs: ['5" 1000nit Display', 'ProRes RAW Recording', 'HDR Monitoring', 'HDMI Input'],
      image: 'https://images.unsplash.com/photo-1612175443456-3c397f4d7d37?q=80&w=2670&auto=format&fit=crop'
    },
  ],
};

const EquipmentShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('cameras');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section id="equipment" className="py-24 px-6 md:px-10 bg-elvis-medium relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      <div className="absolute -top-80 -right-80 w-[500px] h-[500px] rounded-full bg-elvis-pink/5 blur-[120px]"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedItem variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter">
              <span className="text-gradient">Professional</span> Equipment
            </h2>
          </AnimatedItem>
          <AnimatedItem variant="fadeInUp" delay={0.1}>
            <p className="text-white/70 text-lg">
              I use industry-leading gear to capture cinematic footage and deliver exceptional results for every project.
            </p>
          </AnimatedItem>
        </div>

        <AnimatedItem variant="fadeInUp" delay={0.2} className="mb-10">
          <Tabs defaultValue="cameras" className="w-full" onValueChange={setActiveCategory}>
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
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5 
                        }
                      }}
                      className="group perspective-container"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <motion.div 
                        className="glass-card overflow-hidden hover-card transform-3d hover-rotate-y h-full"
                        animate={{
                          rotateY: hoveredItem === item.id ? 15 : 0,
                          transition: { type: 'spring', stiffness: 300, damping: 20 }
                        }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <div className={`
                            absolute inset-0 bg-gradient-to-t from-elvis-darker to-transparent 
                            opacity-60 transition-opacity duration-300 z-10
                          `}></div>
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
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
                            <ul className="grid grid-cols-2 gap-1">
                              {item.specs.map((spec, i) => (
                                <li key={i} className="text-xs text-white/60 flex items-start">
                                  <span className="text-elvis-pink mr-1">•</span> {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </AnimatedItem>
        
        <AnimatedItem variant="fadeInUp" delay={0.3} className="text-center mt-10">
          <Button className="bg-elvis-pink hover:bg-elvis-pink/90">
            <Video className="mr-2 h-4 w-4" /> View Recent Work
          </Button>
        </AnimatedItem>
      </div>
    </section>
  );
};

export default EquipmentShowcase;
