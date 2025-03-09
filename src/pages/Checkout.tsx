
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Check, CheckCircle, ArrowLeft, CreditCard, Lock, LockKeyhole } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingLabelInput from '@/components/auth/FloatingLabelInput';
import { useCart } from '@/contexts/CartContext';

interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || '',
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  // Check for success URL parameter (returning from Stripe)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const orderId = searchParams.get('order_id');
    
    if (success === 'true' && orderId) {
      setIsConfirmed(true);
      clearCart(); // Clear cart after successful purchase
    }
  }, [location, clearCart]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.sale_price !== null ? item.sale_price : item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const total = subtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (step === 1) {
      // Validate shipping info
      if (!formData.name || !formData.address || !formData.city || !formData.zipCode) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields"
        });
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/cart');
    }
  };

  // Order confirmation screen
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        
        <div className="container mx-auto py-16 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-elvis-medium rounded-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-300 mb-8">
              Thank you for your purchase! Your order has been received and is being processed.
              You will receive an email confirmation shortly.
            </p>
            
            <div className="space-y-4">
              <Button 
                className="w-full bg-elvis-gradient"
                onClick={() => navigate('/dashboard')}
              >
                View My Downloads
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Cart empty state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        
        <div className="container mx-auto py-16 px-4">
          <div className="text-center max-w-2xl mx-auto py-16">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-300 mb-8">You need to add items to your cart before checkout.</p>
            <Button 
              className="bg-elvis-gradient"
              onClick={() => navigate('/shop')}
            >
              Browse Products
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        {/* Checkout Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-elvis-pink' : 'bg-gray-600'}`}>
                <span className="text-white font-bold">1</span>
              </div>
              <span className="mt-2 text-sm">Shipping</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-elvis-pink' : 'bg-gray-600'}`} />
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-elvis-pink' : 'bg-gray-600'}`}>
                <span className="text-white font-bold">2</span>
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-elvis-pink' : 'bg-gray-600'}`} />
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-elvis-pink' : 'bg-gray-600'}`}>
                <span className="text-white font-bold">3</span>
              </div>
              <span className="mt-2 text-sm">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 1 ? 'Back to cart' : 'Back to shipping'}
            </Button>
            
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-elvis-medium rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                
                <div className="space-y-4">
                  <FloatingLabelInput
                    id="email"
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!user?.email}
                  />
                  
                  <FloatingLabelInput
                    id="name"
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <FloatingLabelInput
                    id="address"
                    name="address"
                    label="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                      id="city"
                      name="city"
                      label="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <FloatingLabelInput
                      id="state"
                      name="state"
                      label="State/Province"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                      id="zipCode"
                      name="zipCode"
                      label="ZIP/Postal Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <FloatingLabelInput
                      id="country"
                      name="country"
                      label="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-elvis-gradient"
                  onClick={handleContinue}
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-elvis-medium rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                
                <div className="p-4 bg-black/30 rounded-lg mb-6 flex items-center text-sm">
                  <LockKeyhole className="h-4 w-4 mr-2 text-green-400" />
                  <span>
                    This is a demo. No actual payment will be processed.
                    Click the "Complete Purchase" button to simulate checkout.
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="card-number"
                        placeholder="4242 4242 4242 4242"
                        className="pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiration Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <div className="mt-1 relative">
                        <Input
                          id="cvc"
                          placeholder="123"
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="name-on-card">Name on Card</Label>
                    <Input
                      id="name-on-card"
                      placeholder="Exactly as shown on card"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-elvis-gradient"
                  onClick={() => navigate('/checkout?success=true&order_id=demo-order')}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Complete Purchase'}
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-elvis-medium rounded-lg overflow-hidden sticky top-24"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start mb-4">
                    {item.image && (
                      <div className="w-16 h-16 bg-black rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-elvis-pink">
                          ${(item.sale_price !== null ? item.sale_price : item.price).toFixed(2)}
                        </span>
                        <span className="text-sm">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
