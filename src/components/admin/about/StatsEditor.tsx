
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Trash2, Plus, Save, Camera, Video, Award, Users } from 'lucide-react';
import { 
  useStats, 
  useUpdateStat, 
  useCreateStat, 
  useDeleteStat,
  StatItem
} from '@/hooks/api/useStats';

const StatsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: stats, isLoading } = useStats();
  const updateStat = useUpdateStat();
  const createStat = useCreateStat();
  const deleteStat = useDeleteStat();

  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, StatItem>>({});
  const [newStat, setNewStat] = useState<Partial<StatItem>>({
    icon_name: 'Camera',
    value: 0,
    suffix: '',
    label: '',
    sort_order: 0
  });

  // Available icons
  const iconOptions = [
    { value: 'Camera', label: 'Camera', icon: <Camera className="h-4 w-4" /> },
    { value: 'Video', label: 'Video', icon: <Video className="h-4 w-4" /> },
    { value: 'Award', label: 'Award', icon: <Award className="h-4 w-4" /> },
    { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> }
  ];

  // Start editing a stat
  const handleEdit = (stat: StatItem) => {
    setEditing(prev => ({ ...prev, [stat.id]: true }));
    setFormData(prev => ({ ...prev, [stat.id]: { ...stat } }));
  };

  // Handle input change for a stat being edited
  const handleChange = (id: string, field: keyof StatItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  // Handle input change for a new stat
  const handleNewStatChange = (field: keyof StatItem, value: any) => {
    setNewStat(prev => ({ ...prev, [field]: value }));
  };

  // Save edited stat
  const handleSave = async (id: string) => {
    try {
      await updateStat.mutateAsync({
        id,
        updates: formData[id]
      });
      
      setEditing(prev => ({ ...prev, [id]: false }));
      toast({
        title: "Stat updated",
        description: "The stat has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating stat:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the stat.",
        variant: "destructive"
      });
    }
  };

  // Delete a stat
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    
    try {
      await deleteStat.mutateAsync(id);
      toast({
        title: "Stat deleted",
        description: "The stat has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting stat:", error);
      toast({
        title: "Deletion failed",
        description: "An error occurred while deleting the stat.",
        variant: "destructive"
      });
    }
  };

  // Create a new stat
  const handleCreate = async () => {
    if (!newStat.label || !newStat.icon_name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createStat.mutateAsync(newStat as Omit<StatItem, 'id'>);
      
      // Reset form
      setNewStat({
        icon_name: 'Camera',
        value: 0,
        suffix: '',
        label: '',
        sort_order: 0
      });
      
      toast({
        title: "Stat created",
        description: "The new stat has been successfully created."
      });
    } catch (error) {
      console.error("Error creating stat:", error);
      toast({
        title: "Creation failed",
        description: "An error occurred while creating the stat.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Stats Editor</h2>
        <div className="text-sm text-gray-400">
          {stats?.length || 0} Stats
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Suffix</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats?.map((stat) => (
              <TableRow key={stat.id}>
                {editing[stat.id] ? (
                  // Edit mode
                  <>
                    <TableCell>
                      <Select 
                        value={formData[stat.id]?.icon_name} 
                        onValueChange={(value) => handleChange(stat.id, 'icon_name', value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <TableCell>
                      <Input 
                        type="number"
                        value={formData[stat.id]?.value || 0}
                        onChange={(e) => handleChange(stat.id, 'value', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={formData[stat.id]?.suffix || ''}
                        onChange={(e) => handleChange(stat.id, 'suffix', e.target.value)}
                        className="w-16"
                        placeholder="+"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={formData[stat.id]?.label || ''}
                        onChange={(e) => handleChange(stat.id, 'label', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        value={formData[stat.id]?.sort_order || 0}
                        onChange={(e) => handleChange(stat.id, 'sort_order', parseInt(e.target.value) || 0)}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleSave(stat.id)}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditing(prev => ({ ...prev, [stat.id]: false }))}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  // View mode
                  <>
                    <TableCell>
                      {(() => {
                        switch(stat.icon_name) {
                          case 'Camera': return <Camera className="h-5 w-5" />;
                          case 'Video': return <Video className="h-5 w-5" />;
                          case 'Award': return <Award className="h-5 w-5" />;
                          case 'Users': return <Users className="h-5 w-5" />;
                          default: return stat.icon_name;
                        }
                      })()}
                    </TableCell>
                    <TableCell>{stat.value}</TableCell>
                    <TableCell>{stat.suffix || ''}</TableCell>
                    <TableCell>{stat.label}</TableCell>
                    <TableCell>{stat.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(stat)}>
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(stat.id)}
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
      
      {/* Add new stat */}
      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-medium mb-4">Add New Stat</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="new-icon">Icon</Label>
            <Select 
              value={newStat.icon_name} 
              onValueChange={(value) => handleNewStatChange('icon_name', value)}
            >
              <SelectTrigger id="new-icon">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="new-value">Value</Label>
            <Input 
              id="new-value"
              type="number"
              value={newStat.value || ''}
              onChange={(e) => handleNewStatChange('value', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div>
            <Label htmlFor="new-suffix">Suffix</Label>
            <Input 
              id="new-suffix"
              value={newStat.suffix || ''}
              onChange={(e) => handleNewStatChange('suffix', e.target.value)}
              placeholder="+"
            />
          </div>
          
          <div>
            <Label htmlFor="new-label">Label</Label>
            <Input 
              id="new-label"
              value={newStat.label || ''}
              onChange={(e) => handleNewStatChange('label', e.target.value)}
              placeholder="Photo Projects"
            />
          </div>
          
          <div>
            <Label htmlFor="new-order">Order</Label>
            <div className="flex items-end gap-4">
              <Input 
                id="new-order"
                type="number"
                value={newStat.sort_order || ''}
                onChange={(e) => handleNewStatChange('sort_order', parseInt(e.target.value) || 0)}
              />
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsEditor;
