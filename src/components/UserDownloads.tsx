
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DownloadCloud, RefreshCw, Loader2 } from 'lucide-react';
import { useOrders } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Tables } from '@/types/supabase';

interface DownloadItemProps {
  order: Tables<'orders'>;
  products: Tables<'products'>[];
}

const DownloadItem: React.FC<DownloadItemProps> = ({ order, products }) => {
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [downloadLinks, setDownloadLinks] = useState<Record<string, string>>({});

  const generateDownloadLink = async (productId: string) => {
    setIsGenerating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const { data, error } = await supabase.rpc('generate_download_link', {
        order_id: order.id,
        product_id: productId
      });
      
      if (error) throw error;
      
      const downloadUrl = `${window.location.origin}/download?token=${data}`;
      setDownloadLinks(prev => ({ ...prev, [productId]: downloadUrl }));
      
      // Copy link to clipboard and show toast
      navigator.clipboard.writeText(downloadUrl);
      toast({
        title: "Download link generated",
        description: "Link copied to clipboard and valid for 1 hour.",
      });
      
    } catch (error) {
      console.error('Error generating download link:', error);
      toast({
        title: "Failed to generate link",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDownload = (product: Tables<'products'>) => {
    window.open(downloadLinks[product.id], '_blank');
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-bold">Order #{order.id.substring(0, 8)}</h3>
          <p className="text-sm text-gray-400">
            Purchased on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-sm">
          <span className={`px-2 py-1 rounded ${
            order.payment_status === 'paid' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        {products.map(product => (
          <div key={product.id} className="flex justify-between items-center border-t border-white/10 pt-3">
            <div>
              <h4 className="font-medium">{product.name}</h4>
              <div className="text-sm text-gray-400">
                ${product.price.toFixed(2)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {downloadLinks[product.id] ? (
                <Button 
                  size="sm" 
                  className="bg-elvis-gradient"
                  onClick={() => handleDownload(product)}
                >
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Download
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateDownloadLink(product.id)}
                  disabled={isGenerating[product.id] || order.payment_status !== 'paid'}
                >
                  {isGenerating[product.id] ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Link
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>Downloads remaining: {order.download_limit - order.download_count} of {order.download_limit}</p>
        {order.expiry_date && (
          <p>Expires on: {new Date(order.expiry_date).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

const UserDownloads = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrders(user?.id);
  const [productsCache, setProductsCache] = useState<Record<string, Tables<'products'>>>({});
  
  const handleSuccess = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      const orderId = urlParams.get('order_id');
      toast({
        title: "Payment successful!",
        description: "Your order has been processed successfully.",
      });
      // Remove query params
      navigate('/dashboard', { replace: true });
    }
  };
  
  // Call handleSuccess on component mount
  React.useEffect(() => {
    handleSuccess();
  }, []);
  
  // Fetch products for each order
  React.useEffect(() => {
    const fetchProducts = async () => {
      if (!orders) return;
      
      // Get unique product IDs across all orders
      const allProductIds = new Set<string>();
      orders.forEach(order => {
        order.products.forEach(productId => {
          allProductIds.add(productId);
        });
      });
      
      // Fetch products that aren't in cache yet
      const productsToFetch = Array.from(allProductIds).filter(id => !productsCache[id]);
      
      if (productsToFetch.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', productsToFetch);
          
        if (!error && data) {
          const newProducts = data.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {} as Record<string, Tables<'products'>>);
          
          setProductsCache(prev => ({ ...prev, ...newProducts }));
        }
      }
    };
    
    fetchProducts();
  }, [orders]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error loading your orders: {error.message}</p>
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-8 text-center">
        <DownloadCloud className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">No purchases yet</h3>
        <p className="text-gray-400 mb-6">You haven't purchased any products yet.</p>
        <Button asChild className="bg-elvis-gradient">
          <a href="/shop">Browse Products</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Downloads</h2>
      
      {orders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map(order => {
          // Get products for this order
          const orderProducts = order.products
            .map(productId => productsCache[productId])
            .filter(Boolean);
            
          if (orderProducts.length === 0) return null;
          
          return (
            <DownloadItem 
              key={order.id} 
              order={order} 
              products={orderProducts}
            />
          );
        })}
    </div>
  );
};

export default UserDownloads;
