
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

// Sample equipment data
const equipmentData = {
  cameras: [
    {
      id: 1,
      name: 'Sony FX6',
      description: 'Full-frame cinema camera with 4K 120fps capability',
      specs: ['10.2MP Full-Frame Sensor', 'S-Cinetone Color', 'Dual Base ISO'],
      image: 'https://images.unsplash.com/photo-1589872307379-0ffdf9829123?q=80&w=2574&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'RED Komodo 6K',
      description: 'Compact cinema camera with 6K resolution',
      specs: ['Super 35mm Sensor', 'Global Shutter', 'Canon RF Mount'],
      image: 'https://images.unsplash.com/photo-1589872307379-0ffdf9829123?q=80&w=2574&auto=format&fit=crop'
    },
  ],
  lenses: [
    {
      id: 1,
      name: 'Canon CN-E 24mm T1.5',
      description: 'Professional cinema prime lens',
      specs: ['T1.5 Aperture', 'Manual Focus', '114mm Front Diameter'],
      image: 'https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Sony G Master 16-35mm f/2.8',
      description: 'Ultra-wide zoom lens for landscapes and interiors',
      specs: ['f/2.8 Constant Aperture', 'Nano AR Coating', 'Dust & Moisture Resistant'],
      image: 'https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2670&auto=format&fit=crop'
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
      name: 'Aputure 300d Mark II',
      description: 'Powerful LED light with bowens mount',
      specs: ['350W Output', 'Bowens Mount', 'CRI/TLCI 96+'],
      image: 'https://images.unsplash.com/photo-1533228705496-072ca765170e?q=80&w=2670&auto=format&fit=crop'
    },
  ],
  accessories: [
    {
      id: 1,
      name: 'DJI Ronin S2',
      description: 'Professional gimbal stabilizer for cinema cameras',
      specs: ['4.5kg Payload', 'ActiveTrack 5.0', '14hr Battery Life'],
      image: 'https://images.unsplash.com/photo-1612175443456-3c397f4d7d37?q=80&w=2670&auto=format&fit=crop'
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
