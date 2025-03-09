
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { 
  CheckCircle, 
  ShoppingCart, 
  Star, 
  Info, 
  ChevronUp, 
  ChevronDown,
  Download,
  Zap,
  Award,
  Monitor
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Tables<'products'>;
    },
    enabled: !!slug,
  });

  // Sample features - in a real app, these would be dynamic based on the product
  const features: ProductFeature[] = [
    {
      icon: <Download className="h-5 w-5 text-elvis-pink" />,
      title: "Instant Download",
      description: "Get immediate access to your purchase with our secure download system"
    },
    {
      icon: <Zap className="h-5 w-5 text-elvis-pink" />,
      title: "One-Click Application",
      description: "Apply LUTs to your footage in seconds with simple drag and drop support"
    },
    {
      icon: <Award className="h-5 w-5 text-elvis-pink" />,
      title: "Professional Quality",
      description: "Created by industry professionals for cinema-quality results"
    },
    {
      icon: <Monitor className="h-5 w-5 text-elvis-pink" />,
      title: "Compatible with Major Editors",
      description: "Works with Adobe Premiere, DaVinci Resolve, Final Cut Pro, and more"
    }
  ];

  const addToCart = () => {
    if (!product) return;
    
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.preview_image_url,
      quantity: quantity
    };
    
    setCartItems(prev => [...prev, newItem]);
    
    // Show cart animation
    setIsCartVisible(true);
    setTimeout(() => setIsCartVisible(false), 3000);
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white text-white hover:bg-white/10"
        >
          View Cart
        </Button>
      ),
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Mock data for the examples
  const beforeAfterExamples = [
    {
      beforeImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
      afterImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2luZW1hdGljfGVufDB8fDB8fHww',
      caption: 'Urban Scene'
    },
    {
      beforeImage: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?q=80&w=1000',
      afterImage: 'https://images.unsplash.com/photo-1682192701239-1cacc7c40382?q=80&w=1000',
      caption: 'Portrait'
    },
    {
      beforeImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      afterImage: 'https://images.unsplash.com/photo-1571215682834-4fc2fe96eb6b?q=80&w=1000',
      caption: 'Landscape'
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-elvis-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">We couldn't find the product you're looking for.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Product Image/Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="rounded-xl overflow-hidden">
                  <BeforeAfterSlider 
                    beforeImage={beforeAfterExamples[activeImageIndex].beforeImage}
                    afterImage={beforeAfterExamples[activeImageIndex].afterImage}
                    aspectRatio={16/9}
                  />
                </div>
                
                {/* Thumbnails */}
                <div className="mt-4 flex gap-2">
                  {beforeAfterExamples.map((example, index) => (
                    <button
                      key={index}
                      className={`rounded-md overflow-hidden border-2 transition-all ${
                        index === activeImageIndex 
                          ? 'border-elvis-pink scale-105 shadow-pink-glow' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={example.afterImage} 
                        alt={example.caption} 
                        className="w-20 h-14 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
              
              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-5 w-5" 
                        fill={star <= 5 ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-300">(24 reviews)</span>
                </div>
                
                <div className="mb-6">
                  {product.sale_price ? (
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-elvis-pink">
                        ${product.sale_price.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="ml-2 bg-elvis-pink/20 text-elvis-pink px-2 py-1 rounded text-sm">
                        SAVE {Math.round((1 - product.sale_price / product.price) * 100)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-elvis-pink">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-6">
                  {product.description}
                </p>
                
                {/* Quantity Selector and Add to Cart */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center border border-gray-600 rounded-md">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={addToCart}
                          className="bg-elvis-gradient relative overflow-hidden group"
                          size="lg"
                        >
                          <span className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center bg-white text-elvis-pink opacity-0 transform scale-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 rounded-md">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Add to Cart
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-elvis-medium border-elvis-pink">
                        <p>Click to add to your cart</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Features */}
                <div className="bg-elvis-medium rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Product Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">{feature.icon}</div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Compatibility */}
                <div className="bg-elvis-medium rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">Compatibility</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-elvis-medium border-elvis-pink">
                          <p>Software compatible with this product</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/10 px-3 py-1 rounded text-sm">Adobe Premiere Pro</span>
                    <span className="bg-white/10 px-3 py-1 rounded text-sm">After Effects</span>
                    <span className="bg-white/10 px-3 py-1 rounded text-sm">DaVinci Resolve</span>
                    <span className="bg-white/10 px-3 py-1 rounded text-sm">Final Cut Pro</span>
                    <span className="bg-white/10 px-3 py-1 rounded text-sm">Photoshop</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
          
          {/* More Examples Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">More Before/After Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beforeAfterExamples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-lg overflow-hidden bg-elvis-medium"
                >
                  <BeforeAfterSlider
                    beforeImage={example.beforeImage}
                    afterImage={example.afterImage}
                    aspectRatio={16/10}
                  />
                  <div className="p-4">
                    <h3 className="font-medium">{example.caption}</h3>
                    <p className="text-sm text-gray-400">
                      See how this LUT transforms your {example.caption.toLowerCase()} shots
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Product Details Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Product Details</h2>
            <div className="bg-elvis-medium rounded-lg p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-b border-white/10">
                  <AccordionTrigger className="text-lg">Description</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <p className="mb-4">{product.description}</p>
                    <p>
                      This professional LUT pack is designed to instantly transform your footage with 
                      a cinematic color grade. Perfect for filmmakers, content creators, and videographers 
                      looking to achieve a premium look without spending hours in color grading.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="specifications" className="border-b border-white/10">
                  <AccordionTrigger className="text-lg">Specifications</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">File Format</h4>
                        <p className="text-gray-300">.cube, .3dl</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Number of LUTs</h4>
                        <p className="text-gray-300">15 variations</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Resolution</h4>
                        <p className="text-gray-300">33x33x33</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">File Size</h4>
                        <p className="text-gray-300">25MB</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="installation" className="border-b border-white/10">
                  <AccordionTrigger className="text-lg">Installation Guide</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                      <li>Download the LUT pack after purchase</li>
                      <li>Extract the ZIP file to your preferred location</li>
                      <li>Open your video editing software</li>
                      <li>Import the LUTs using your software's color grading panel</li>
                      <li>Apply to your footage and adjust intensity as needed</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq" className="border-b-0">
                  <AccordionTrigger className="text-lg">FAQ</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1">Can I use these LUTs for commercial projects?</h4>
                        <p className="text-gray-300">Yes, all our LUTs come with a commercial license.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Do these work with mobile editing apps?</h4>
                        <p className="text-gray-300">
                          Yes, most professional mobile editing apps support .cube LUT files.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Can I download again if I lose the files?</h4>
                        <p className="text-gray-300">
                          Yes, you have lifetime access to your purchases through your account.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
          
          {/* Related Products Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* This would ideally use real related products data */}
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-elvis-medium rounded-lg overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/300x200?film&sig=${item}`} 
                      alt="Product" 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <Button className="w-full bg-elvis-gradient">View Product</Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">Related LUT Pack {item}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-elvis-pink font-bold">${(19.99 + item * 5).toFixed(2)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="h-3 w-3 text-yellow-400" 
                            fill={star <= 4 ? "currentColor" : "none"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      {/* Floating Cart Indicator */}
      <AnimatePresence>
        {isCartVisible && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-elvis-medium border border-elvis-pink rounded-lg p-4 shadow-pink-glow z-50"
          >
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-6 w-6 text-elvis-pink" />
              <div>
                <p className="font-medium">Item added to cart!</p>
                <p className="text-sm text-gray-400">Total items: {cartItems.length}</p>
              </div>
              <Button variant="outline" size="sm" className="border-elvis-pink text-white">
                View Cart
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
