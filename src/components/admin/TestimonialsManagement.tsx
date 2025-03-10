
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase';
import AdminLoadingState from './AdminLoadingState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TestimonialsManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editTestimonial, setEditTestimonial] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    position: '',
    company: '',
    quote: '',
    avatar: '',
    is_featured: false
  });
  
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.position || !newTestimonial.company || !newTestimonial.quote) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('testimonials')
        .insert([newTestimonial])
        .select();
        
      if (error) throw error;
      
      toast.success('Testimonial added successfully');
      setNewTestimonial({
        name: '',
        position: '',
        company: '',
        quote: '',
        avatar: '',
        is_featured: false
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateTestimonial = async () => {
    if (!editTestimonial || !editTestimonial.name || !editTestimonial.position || !editTestimonial.company || !editTestimonial.quote) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: editTestimonial.name,
          position: editTestimonial.position,
          company: editTestimonial.company,
          quote: editTestimonial.quote,
          avatar: editTestimonial.avatar,
          is_featured: editTestimonial.is_featured
        })
        .eq('id', editTestimonial.id);
        
      if (error) throw error;
      
      toast.success('Testimonial updated successfully');
      setEditTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Testimonials Management</CardTitle>
        <CardDescription>Manage client testimonials displayed on your About page</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add New Testimonial Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Testimonial</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newTestimonial.position}
                onChange={(e) => setNewTestimonial({...newTestimonial, position: e.target.value})}
                placeholder="e.g., Marketing Director"
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newTestimonial.company}
                onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                placeholder="e.g., Acme Inc."
              />
            </div>
            
            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={newTestimonial.avatar}
                onChange={(e) => setNewTestimonial({...newTestimonial, avatar: e.target.value})}
                placeholder="e.g., https://example.com/avatar.jpg"
              />
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="quote">Testimonial Quote</Label>
              <Textarea
                id="quote"
                value={newTestimonial.quote}
                onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                placeholder="Enter the client's testimonial..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={newTestimonial.is_featured}
                onCheckedChange={(checked) => 
                  setNewTestimonial({...newTestimonial, is_featured: checked as boolean})
                }
              />
              <Label htmlFor="featured">Featured testimonial</Label>
            </div>
            
            <div className="sm:col-span-2">
              <Button onClick={handleAddTestimonial} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Testimonial'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Edit Testimonial Form */}
        {editTestimonial && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Edit Testimonial</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Client Name</Label>
                <Input
                  id="edit-name"
                  value={editTestimonial.name}
                  onChange={(e) => setEditTestimonial({...editTestimonial, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={editTestimonial.position}
                  onChange={(e) => setEditTestimonial({...editTestimonial, position: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editTestimonial.company}
                  onChange={(e) => setEditTestimonial({...editTestimonial, company: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-avatar">Avatar URL</Label>
                <Input
                  id="edit-avatar"
                  value={editTestimonial.avatar || ''}
                  onChange={(e) => setEditTestimonial({...editTestimonial, avatar: e.target.value})}
                />
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="edit-quote">Testimonial Quote</Label>
                <Textarea
                  id="edit-quote"
                  value={editTestimonial.quote}
                  onChange={(e) => setEditTestimonial({...editTestimonial, quote: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-featured" 
                  checked={editTestimonial.is_featured}
                  onCheckedChange={(checked) => 
                    setEditTestimonial({...editTestimonial, is_featured: checked as boolean})
                  }
                />
                <Label htmlFor="edit-featured">Featured testimonial</Label>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex space-x-2">
                  <Button onClick={handleUpdateTestimonial} disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Testimonial'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditTestimonial(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Testimonials Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Position & Company</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No testimonials added yet
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{testimonial.name}</TableCell>
                    <TableCell>
                      {testimonial.position}<br/>
                      <span className="text-muted-foreground text-xs">{testimonial.company}</span>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm truncate">
                      {testimonial.quote}
                    </TableCell>
                    <TableCell>
                      {testimonial.is_featured ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setEditTestimonial(testimonial)}
                        >
                          <span className="sr-only">Edit</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11.13 1.21c.48-.48 1.27-.48 1.76 0l1.9 1.9c.48.48.48 1.27 0 1.76l-9.9 9.9-3.98.5.5-3.98 9.72-9.72z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                        >
                          <span className="sr-only">Delete</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 3h-3l-1-1H6L5 3H2v1h12zM4 5v7.5c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5V5z" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          Total testimonials: {testimonials.length}
        </p>
        <Button variant="outline" onClick={() => window.open('/#about', '_blank')}>
          View Live
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestimonialsManagement;
