
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductBySlug } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Star, CheckCircle, ArrowLeft, ChevronRight, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedEffect, setShowAddedEffect] = useState(false);

  // Fetch product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug || ''),
    enabled: !!slug,
  });

  // Animation for add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // Simulate a slight delay for the animation
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        image: product.preview_image_url || '',
      });
      
      setIsAdding(false);
      setShowAddedEffect(true);
      
      setTimeout(() => {
        setShowAddedEffect(false);
      }, 2000);
    }, 600);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        <div className="container mx-auto py-20 px-4 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-elvis-pink" />
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
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
          <p className="text-gray-400 mb-8">The product you are looking for doesn't exist or has been removed.</p>
          <Link to="/shop">
            <Button className="bg-elvis-gradient">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Left Column */}
          <div className="space-y-8">
            {/* Large Product Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-elvis-medium rounded-lg overflow-hidden shadow-pink-glow"
            >
              {product.preview_image_url ? (
                <img 
                  src={product.preview_image_url} 
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-80 bg-elvis-medium flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-gray-600" />
                </div>
              )}
            </motion.div>
            
            {/* Before/After Slider */}
            {(product.category === 'LUT' || product.category === 'Preset') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">Before / After</h3>
                <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                  afterImage="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80&sat=-100&contrast=1.3&brightness=1.1"
                  aspectRatio={16/9}
                  className="rounded-lg overflow-hidden shadow-pink-glow"
                />
              </motion.div>
            )}
          </div>
          
          {/* Product Info - Right Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Category */}
              <div className="inline-block bg-elvis-light px-3 py-1 rounded-full text-xs mb-4">
                {product.category}
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-elvis-pink">
                      ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                      {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-elvis-pink">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <div className="pt-4">
              <AnimatePresence>
                {showAddedEffect ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center px-6 py-3 bg-green-500/20 rounded-lg mb-4"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-400">Added to cart!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button 
                      className="w-full bg-elvis-gradient text-lg py-6"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center"
                        >
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Adding...
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center"
                        >
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Add to Cart
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center justify-center mt-4 text-gray-400 text-sm">
                <Package className="h-4 w-4 mr-2" />
                <span>Instant Digital Download</span>
              </div>
            </div>
            
            {/* Product Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid grid-cols-3 bg-elvis-light">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-4 bg-elvis-medium rounded-lg mt-2">
                <div className="prose prose-sm prose-invert">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>No description available for this product.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="compatibility" className="p-4 bg-elvis-medium rounded-lg mt-2">
                <h3 className="font-semibold mb-2">Compatible with:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Adobe Premiere Pro (CC 2019 and newer)</li>
                  <li>Adobe After Effects (CC 2019 and newer)</li>
                  <li>DaVinci Resolve 17+</li>
                  <li>Final Cut Pro X</li>
                  <li>Avid Media Composer</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-4 bg-elvis-medium rounded-lg mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-5 w-5" 
                        fill={star <= 5 ? "#FFD700" : "none"} 
                        color={star <= 5 ? "#FFD700" : "#6b7280"}
                      />
                    ))}
                  </div>
                  <span className="font-bold">5.0</span>
                  <span className="text-gray-400">(12 reviews)</span>
                </div>
                
                <div className="space-y-4">
                  {/* Sample reviews */}
                  <div className="border-b border-gray-700 pb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Alex K.</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="h-4 w-4" 
                            fill="#FFD700" 
                            color="#FFD700"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm">
                      These LUTs transformed my footage completely. The cinematic look is spot on!
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-700 pb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Sarah M.</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="h-4 w-4" 
                            fill="#FFD700" 
                            color="#FFD700"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm">
                      Easy to apply and the results are amazing. Saved me hours of color grading!
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
        
        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder related products */}
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item} 
                className="bg-elvis-medium rounded-lg overflow-hidden group hover:shadow-pink-glow transition-shadow duration-300"
              >
                <div className="h-40 bg-elvis-light"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Product {item}</h3>
                  <p className="text-elvis-pink font-bold mt-1">$19.99</p>
                  <Button 
                    className="w-full mt-4 bg-elvis-gradient"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
