
import React, { useState, useEffect, useRef } from 'react';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Camera, 
  Aperture, 
  Mic, 
  Tv, 
  Layers,
  ImagePlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

// Equipment categories
const categories = [
  { id: 'cameras', label: 'Cameras', icon: <Camera className="mr-2 h-4 w-4" /> },
  { id: 'lenses', label: 'Lenses', icon: <Aperture className="mr-2 h-4 w-4" /> },
  { id: 'audio', label: 'Audio', icon: <Mic className="mr-2 h-4 w-4" /> },
  { id: 'lighting', label: 'Lighting', icon: <Tv className="mr-2 h-4 w-4" /> },
  { id: 'accessories', label: 'Accessories', icon: <Layers className="mr-2 h-4 w-4" /> },
];

// For new equipment form
const emptyEquipment = {
  id: '',
  name: '',
  description: '',
  category: 'cameras',
  specs: ['', '', ''],
  image_url: '',
  sort_order: 0
};

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState<any>(emptyEquipment);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch equipment data from Supabase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('equipment')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }
          
        const { data, error } = await query;
        
        if (error) throw error;
        setEquipment(data || []);
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
  }, [selectedCategory, toast]);

  const handleCreateNew = () => {
    setCurrentItem({
      ...emptyEquipment,
      id: uuidv4(),
      sort_order: equipment.length + 1
    });
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setIsEditing(true);
    setImageFile(null);
    setImagePreview(item.image_url);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSpecChange = (index: number, value: string) => {
    const updatedSpecs = [...currentItem.specs];
    updatedSpecs[index] = value;
    setCurrentItem({ ...currentItem, specs: updatedSpecs });
  };

  const addSpec = () => {
    setCurrentItem({ 
      ...currentItem, 
      specs: [...currentItem.specs, ''] 
    });
  };

  const removeSpec = (index: number) => {
    const updatedSpecs = [...currentItem.specs];
    updatedSpecs.splice(index, 1);
    setCurrentItem({ ...currentItem, specs: updatedSpecs });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return currentItem.image_url;
    
    try {
      // Generate a unique filename
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `equipment/${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      toast({
        title: 'Image upload failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleSave = async () => {
    // Validate form
    if (!currentItem.name || !currentItem.category || !currentItem.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Upload image if there's a new one
      let imageUrl = currentItem.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      
      // Filter out empty specs
      const filteredSpecs = currentItem.specs.filter((spec: string) => spec.trim() !== '');
      
      const itemToSave = {
        ...currentItem,
        image_url: imageUrl,
        specs: filteredSpecs
      };
      
      if (isEditing) {
        // Update existing item
        const { error } = await supabase
          .from('equipment')
          .update(itemToSave)
          .eq('id', currentItem.id);
          
        if (error) throw error;
        
        toast({
          title: 'Equipment Updated',
          description: `${currentItem.name} has been updated successfully`,
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('equipment')
          .insert([itemToSave]);
          
        if (error) throw error;
        
        toast({
          title: 'Equipment Added',
          description: `${currentItem.name} has been added successfully`,
        });
      }
      
      // Refresh equipment list
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      setEquipment(data || []);
      
      // Close dialog
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving equipment:', error.message);
      toast({
        title: 'Failed to save equipment',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh equipment list
      const { data, error: fetchError } = await supabase
        .from('equipment')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (fetchError) throw fetchError;
      setEquipment(data || []);
      
      toast({
        title: 'Equipment Deleted',
        description: 'The equipment has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting equipment:', error.message);
      toast({
        title: 'Failed to delete equipment',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Equipment Management</h2>
          <p className="text-white/70">Manage your professional equipment inventory</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-elvis-dark border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-elvis-pink"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
          
          <Button 
            onClick={handleCreateNew}
            className="bg-elvis-pink hover:bg-elvis-pink/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-elvis-pink animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {equipment.length > 0 ? (
            equipment.map(item => (
              <Card key={item.id} className="bg-elvis-dark border-white/10 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image_url || '/placeholder.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-elvis-pink/20 p-2 rounded-full">
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.description}</p>
                  
                  {item.specs && item.specs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-elvis-pink mb-2">Key Specifications</h4>
                      <ul className="text-xs text-white/60 space-y-1">
                        {item.specs.slice(0, 3).map((spec: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-elvis-pink mr-1">•</span> {spec}
                          </li>
                        ))}
                        {item.specs.length > 3 && (
                          <li className="text-elvis-pink/80">+{item.specs.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        className="bg-red-900/20 hover:bg-red-900/40 text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-elvis-darker border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-900/20 hover:bg-red-900/40 text-red-400"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-white/60">
              <div className="text-center mb-4">
                {selectedCategory === 'all' ? (
                  <p>No equipment items found</p>
                ) : (
                  <p>No equipment items found in this category</p>
                )}
              </div>
              <Button 
                onClick={handleCreateNew}
                variant="outline"
                className="border-elvis-pink/30 text-elvis-pink hover:bg-elvis-pink/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Equipment
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Equipment Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-elvis-darker border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details of your equipment' 
                : 'Add a new piece of equipment to your inventory'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Equipment Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentItem.name}
                  onChange={handleInputChange}
                  placeholder="Sony FX3 Camera"
                  className="bg-elvis-medium border-white/10"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={currentItem.category}
                  onChange={handleInputChange}
                  className="w-full bg-elvis-medium border border-white/10 rounded-md px-3 py-2 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentItem.description}
                  onChange={handleInputChange}
                  placeholder="Short description of the equipment"
                  className="bg-elvis-medium border-white/10 min-h-20"
                />
              </div>
              
              <div>
                <Label htmlFor="sort_order">Display Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={currentItem.sort_order}
                  onChange={handleInputChange}
                  className="bg-elvis-medium border-white/10"
                />
                <p className="text-xs text-white/60 mt-1">Lower numbers appear first</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Equipment Image</Label>
                <div className="mt-2 border-2 border-dashed border-white/10 rounded-md overflow-hidden">
                  {imagePreview ? (
                    <div className="relative group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-elvis-darker/80 border-white/20 hover:bg-elvis-darker"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Change Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-elvis-dark/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-10 w-10 text-white/40 mb-2" />
                      <p className="text-white/60">Click to upload an image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Key Specifications</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addSpec}
                    className="h-8 border-elvis-pink/30 text-elvis-pink hover:bg-elvis-pink/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Spec
                  </Button>
                </div>
                
                {currentItem.specs && currentItem.specs.map((spec: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={spec}
                      onChange={(e) => handleSpecChange(index, e.target.value)}
                      placeholder={`Specification ${index + 1}`}
                      className="bg-elvis-medium border-white/10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpec(index)}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!currentItem.specs || currentItem.specs.length === 0) && (
                  <p className="text-white/40 text-sm">No specifications added yet</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-elvis-pink hover:bg-elvis-pink/80"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Equipment' : 'Add Equipment'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentManagement;
