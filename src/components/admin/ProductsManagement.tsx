
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ProductsManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProducts(data || []);
        
      } catch (error: any) {
        console.error('Error fetching products:', error.message);
        toast({
          title: 'Error loading products',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  const togglePublishStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_published: !currentStatus })
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Product is now ${!currentStatus ? 'published' : 'unpublished'}`,
      });
      
      // Update product in local state to avoid refetching
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, is_published: !currentStatus } : product
        )
      );
      
    } catch (error: any) {
      console.error('Error updating product status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-elvis-pink hover:bg-elvis-pink-800">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-white/60">{product.slug}</div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  ${product.price}
                  {product.sale_price && (
                    <span className="text-sm text-white/60 ml-2">
                      Sale: ${product.sale_price}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={product.is_published ? 
                    'bg-green-500/10 text-green-500' : 
                    'bg-yellow-500/10 text-yellow-500'}>
                    {product.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => togglePublishStatus(product.id, product.is_published)}
                      className="hover:bg-elvis-pink/20"
                    >
                      {product.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-elvis-pink/20"
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsManagement;
