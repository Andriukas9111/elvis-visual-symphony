import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Save, Camera, Film, Video, Award, Users } from 'lucide-react';
import { 
  useExpertise,
  useUpdateExpertise,
  useCreateExpertise,
  useDeleteExpertise,
  ExpertiseItem
} from '@/hooks/api/useExpertise';

const ExpertiseEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: expertiseItems, isLoading } = useExpertise();
  const updateExpertise = useUpdateExpertise();
  const createExpertise = useCreateExpertise();
  const deleteExpertise = useDeleteExpertise();

  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, ExpertiseItem>>({});
  const [newItem, setNewItem] = useState<Partial<ExpertiseItem>>({
    icon_name: 'Camera',
    label: '',
    description: '',
    type: 'expertise',
    sort_order: 0
  });

  // Filter expertise items by type
  const expertiseData = expertiseItems?.filter(item => item.type === 'expertise') || [];
  const projectData = expertiseItems?.filter(item => item.type === 'project') || [];

  // Available icons
  const iconOptions = [
    { value: 'Camera', label: 'Camera', icon: <Camera className="h-4 w-4" /> },
    { value: 'Film', label: 'Film', icon: <Film className="h-4 w-4" /> },
    { value: 'Video', label: 'Video', icon: <Video className="h-4 w-4" /> },
    { value: 'Award', label: 'Award', icon: <Award className="h-4 w-4" /> },
    { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> }
  ];

  // Start editing an item
  const handleEdit = (item: ExpertiseItem) => {
    setEditing(prev => ({ ...prev, [item.id]: true }));
    setFormData(prev => ({ ...prev, [item.id]: { ...item } }));
  };

  // Handle input change for an item being edited
  const handleChange = (id: string, field: keyof ExpertiseItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  // Handle input change for a new item
  const handleNewItemChange = (field: keyof ExpertiseItem, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  // Save edited item
  const handleSave = async (id: string) => {
    try {
      await updateExpertise.mutateAsync({
        id,
        updates: formData[id]
      });
      
      setEditing(prev => ({ ...prev, [id]: false }));
      toast({
        title: "Item updated",
        description: `The ${formData[id].type} has been successfully updated.`
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the item.",
        variant: "destructive"
      });
    }
  };

  // Delete an item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await deleteExpertise.mutateAsync(id);
      toast({
        title: "Item deleted",
        description: "The item has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Deletion failed",
        description: "An error occurred while deleting the item.",
        variant: "destructive"
      });
    }
  };

  // Create a new item
  const handleCreate = async () => {
    if (!newItem.label || !newItem.description || !newItem.icon_name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createExpertise.mutateAsync(newItem as Omit<ExpertiseItem, 'id'>);
      
      // Reset form
      setNewItem({
        icon_name: 'Camera',
        label: '',
        description: '',
        type: newItem.type, // Keep the current tab type
        sort_order: 0
      });
      
      toast({
        title: "Item created",
        description: `The new ${newItem.type} has been successfully created.`
      });
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: "Creation failed",
        description: "An error occurred while creating the item.",
        variant: "destructive"
      });
    }
  };

  // Get icon component
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Camera': return <Camera className="h-5 w-5" />;
      case 'Film': return <Film className="h-5 w-5" />;
      case 'Video': return <Video className="h-5 w-5" />;
      case 'Award': return <Award className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      default: return iconName;
    }
  };

  if (isLoading) {
    return <div className="p-4 text-white">Loading data...</div>;
  }

  // Render editor table for a specific type
  const renderTable = (items: ExpertiseItem[], type: 'expertise' | 'project') => (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader className="bg-elvis-medium">
          <TableRow>
            <TableHead className="w-[100px] text-white">Icon</TableHead>
            <TableHead className="w-[200px] text-white">Label</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="w-[80px] text-white">Order</TableHead>
            <TableHead className="text-right w-[180px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-gray-700">
              {editing[item.id] ? (
                // Edit mode
                <>
                  <TableCell className="bg-elvis-dark text-white">
                    <Select 
                      value={formData[item.id]?.icon_name} 
                      onValueChange={(value) => handleChange(item.id, 'icon_name', value)}
                    >
                      <SelectTrigger className="w-28 bg-elvis-medium border-gray-700 text-white">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent className="bg-elvis-medium border-gray-700 text-white">
                        {iconOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              {option.icon}
                              <span className="ml-2">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="bg-elvis-dark text-white">
                    <Input 
                      value={formData[item.id]?.label || ''}
                      onChange={(e) => handleChange(item.id, 'label', e.target.value)}
                      className="w-full bg-elvis-medium border-gray-700 text-white"
                    />
                  </TableCell>
                  <TableCell className="bg-elvis-dark text-white">
                    <Textarea 
                      value={formData[item.id]?.description || ''}
                      onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                      className="w-full bg-elvis-medium border-gray-700 text-white"
                      rows={2}
                    />
                  </TableCell>
                  <TableCell className="bg-elvis-dark text-white">
                    <Input 
                      type="number"
                      value={formData[item.id]?.sort_order || 0}
                      onChange={(e) => handleChange(item.id, 'sort_order', parseInt(e.target.value) || 0)}
                      className="w-16 bg-elvis-medium border-gray-700 text-white"
                    />
                  </TableCell>
                  <TableCell className="text-right bg-elvis-dark text-white">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => handleSave(item.id)}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditing(prev => ({ ...prev, [item.id]: false }))}
                        className="border-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                // View mode
                <>
                  <TableCell className="bg-elvis-dark text-white">{getIconComponent(item.icon_name)}</TableCell>
                  <TableCell className="bg-elvis-dark text-white">{item.label}</TableCell>
                  <TableCell className="max-w-xs truncate bg-elvis-dark text-white">{item.description}</TableCell>
                  <TableCell className="bg-elvis-dark text-white">{item.sort_order}</TableCell>
                  <TableCell className="text-right bg-elvis-dark text-white">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="border-gray-700">
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Expertise & Projects Editor</h2>
        <div className="text-sm text-gray-400">
          {expertiseItems?.length || 0} Items
        </div>
      </div>
      
      <Tabs 
        defaultValue="expertise" 
        onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value as 'expertise' | 'project' }))}
        className="text-white"
      >
        <TabsList className="mb-4 bg-elvis-medium">
          <TabsTrigger value="expertise" className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white">
            Expertise ({expertiseData.length})
          </TabsTrigger>
          <TabsTrigger value="project" className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white">
            Project Types ({projectData.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expertise">
          {renderTable(expertiseData, 'expertise')}
        </TabsContent>
        
        <TabsContent value="project">
          {renderTable(projectData, 'project')}
        </TabsContent>
      </Tabs>
      
      {/* Add new item form */}
      <div className="border rounded-md p-4 bg-elvis-dark border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-white">
          Add New {newItem.type === 'expertise' ? 'Expertise' : 'Project Type'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="new-icon" className="text-white">Icon</Label>
            <Select 
              value={newItem.icon_name} 
              onValueChange={(value) => handleNewItemChange('icon_name', value)}
            >
              <SelectTrigger id="new-icon" className="bg-elvis-medium border-gray-700 text-white">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent className="bg-elvis-medium border-gray-700 text-white">
                {iconOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="new-label" className="text-white">Label</Label>
            <Input 
              id="new-label"
              value={newItem.label || ''}
              onChange={(e) => handleNewItemChange('label', e.target.value)}
              placeholder="Videography"
              className="bg-elvis-medium border-gray-700 text-white"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="new-description" className="text-white">Description</Label>
          <Textarea 
            id="new-description"
            value={newItem.description || ''}
            onChange={(e) => handleNewItemChange('description', e.target.value)}
            placeholder="Professional video production services for various types of projects"
            rows={3}
            className="bg-elvis-medium border-gray-700 text-white"
          />
        </div>
        
        <div className="flex items-end gap-4">
          <div className="w-24">
            <Label htmlFor="new-order" className="text-white">Order</Label>
            <Input 
              id="new-order"
              type="number"
              value={newItem.sort_order || ''}
              onChange={(e) => handleNewItemChange('sort_order', parseInt(e.target.value) || 0)}
              className="bg-elvis-medium border-gray-700 text-white"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Add {newItem.type === 'expertise' ? 'Expertise' : 'Project'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseEditor;
