
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Aperture, Mic, Tv, Layers, Edit, Plus, Trash2, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Equipment categories with their icons
const categories = [
  { id: 'cameras', label: 'Cameras', icon: <Camera className="mr-2 h-4 w-4" /> },
  { id: 'lenses', label: 'Lenses', icon: <Aperture className="mr-2 h-4 w-4" /> },
  { id: 'audio', label: 'Audio', icon: <Mic className="mr-2 h-4 w-4" /> },
  { id: 'lighting', label: 'Lighting', icon: <Tv className="mr-2 h-4 w-4" /> },
  { id: 'accessories', label: 'Accessories', icon: <Layers className="mr-2 h-4 w-4" /> },
];

const Equipment = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  
  const [equipment, setEquipment] = useState<Record<string, any[]>>({
    cameras: [],
    lenses: [],
    audio: [],
    lighting: [],
    accessories: [],
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch equipment data from Supabase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) throw error;
        
        // Group equipment by category
        const groupedEquipment: Record<string, any[]> = {
          cameras: [],
          lenses: [],
          audio: [],
          lighting: [],
          accessories: [],
        };
        
        data.forEach(item => {
          if (groupedEquipment[item.category]) {
            groupedEquipment[item.category].push(item);
          }
        });
        
        setEquipment(groupedEquipment);
      } catch (error: any) {
        console.error('Error fetching equipment:', error.message);
        toast({
          title: 'Failed to load equipment',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipment();
  }, [toast]);
  
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
          
          {isAdmin && (
            <div className="mt-4 flex justify-center">
              <a href="/admin-panel?tab=equipment" className="inline-flex items-center px-4 py-2 rounded bg-elvis-pink/20 text-elvis-pink hover:bg-elvis-pink/30 transition-colors">
                <Edit className="mr-2 h-4 w-4" />
                Manage Equipment
              </a>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-elvis-pink animate-spin" />
            </div>
          ) : (
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

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipment[category.id].length > 0 ? (
                      equipment[category.id].map((item, index) => (
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
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                              <div className="absolute top-3 right-3 z-20">
                                <div className="bg-elvis-pink/20 p-2 rounded-full">
                                  {category.id === 'cameras' && <Camera className="text-elvis-pink h-5 w-5" />}
                                  {category.id === 'lenses' && <Aperture className="text-elvis-pink h-5 w-5" />}
                                  {category.id === 'audio' && <Mic className="text-elvis-pink h-5 w-5" />}
                                  {category.id === 'lighting' && <Tv className="text-elvis-pink h-5 w-5" />}
                                  {category.id === 'accessories' && <Layers className="text-elvis-pink h-5 w-5" />}
                                </div>
                              </div>
                            </div>
                            <div className="p-6 space-y-4">
                              <h3 className="text-xl font-bold">{item.name}</h3>
                              <p className="text-white/70 text-sm">{item.description}</p>
                              
                              {item.specs && item.specs.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-elvis-pink">Key Specifications</h4>
                                  <ul className="grid grid-cols-1 gap-1">
                                    {item.specs.map((spec: string, i: number) => (
                                      <li key={i} className="text-xs text-white/60 flex items-start">
                                        <span className="text-elvis-pink mr-1">•</span> {spec}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-white/60">
                        No {category.label.toLowerCase()} items found
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Equipment;
