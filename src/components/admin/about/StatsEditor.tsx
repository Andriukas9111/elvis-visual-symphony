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
import { Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Trash2, Plus, Save, Camera, Video, Award, Users, Instagram, Youtube, TikTok, Mail, Star, Music, Heart, Film } from 'lucide-react';
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

  const iconOptions = [
    { 
      category: 'Media & Professional',
      icons: [
        { value: 'Camera', label: 'Camera', icon: <Camera className="h-4 w-4" /> },
        { value: 'Video', label: 'Video', icon: <Video className="h-4 w-4" /> },
        { value: 'Film', label: 'Film', icon: <Film className="h-4 w-4" /> },
        { value: 'Award', label: 'Award', icon: <Award className="h-4 w-4" /> },
        { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> },
        { value: 'Star', label: 'Star', icon: <Star className="h-4 w-4" /> },
        { value: 'Music', label: 'Music', icon: <Music className="h-4 w-4" /> },
        { value: 'Heart', label: 'Heart', icon: <Heart className="h-4 w-4" /> },
      ]
    },
    {
      category: 'Social Media',
      icons: [
        { value: 'Instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
        { value: 'Youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
        { value: 'TikTok', label: 'TikTok', icon: <TikTok className="h-4 w-4" /> },
        { value: 'Mail', label: 'Email', icon: <Mail className="h-4 w-4" /> },
      ]
    }
  ];

  const getIconByName = (name: string) => {
    for (const category of iconOptions) {
      for (const icon of category.icons) {
        if (icon.value === name) {
          return icon.icon;
        }
      }
    }
    return <Camera className="h-4 w-4" />;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const handleEdit = (stat: StatItem) => {
    setEditing(prev => ({ ...prev, [stat.id]: true }));
    setFormData(prev => ({ ...prev, [stat.id]: { ...stat } }));
  };

  const handleChange = (id: string, field: keyof StatItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleNewStatChange = (field: keyof StatItem, value: any) => {
    setNewStat(prev => ({ ...prev, [field]: value }));
  };

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
    return <div className="p-4 text-white">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Stats Editor</h2>
        <div className="text-sm text-gray-400">
          {stats?.length || 0} Stats
        </div>
      </div>
      
      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader className="bg-elvis-medium">
            <TableRow>
              <TableHead className="text-white">Icon</TableHead>
              <TableHead className="text-white">Value</TableHead>
              <TableHead className="text-white">Formatted</TableHead>
              <TableHead className="text-white">Suffix</TableHead>
              <TableHead className="text-white">Label</TableHead>
              <TableHead className="text-white">Order</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats?.map((stat) => (
              <TableRow key={stat.id} className="border-gray-700">
                {editing[stat.id] ? (
                  <>
                    <TableCell className="bg-elvis-dark text-white">
                      <Select 
                        value={formData[stat.id]?.icon_name} 
                        onValueChange={(value) => handleChange(stat.id, 'icon_name', value)}
                      >
                        <SelectTrigger className="w-28 bg-elvis-medium border-gray-700 text-white">
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent className="bg-elvis-medium border-gray-700 text-white max-h-[300px]">
                          {iconOptions.map(category => (
                            <React.Fragment key={category.category}>
                              <div className="px-2 py-1.5 text-xs font-semibold bg-elvis-dark/60">
                                {category.category}
                              </div>
                              {category.icons.map(icon => (
                                <SelectItem key={icon.value} value={icon.value}>
                                  <div className="flex items-center">
                                    {icon.icon}
                                    <span className="ml-2">{icon.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="bg-elvis-dark text-white">
                      <Input 
                        type="number"
                        value={formData[stat.id]?.value || 0}
                        onChange={(e) => handleChange(stat.id, 'value', parseInt(e.target.value) || 0)}
                        className="w-20 bg-elvis-medium border-gray-700 text-white"
                      />
                    </TableCell>
                    <TableCell className="bg-elvis-dark text-white">
                      {formatNumber(formData[stat.id]?.value || 0)}
                    </TableCell>
                    <TableCell className="bg-elvis-dark text-white">
                      <Input 
                        value={formData[stat.id]?.suffix || ''}
                        onChange={(e) => handleChange(stat.id, 'suffix', e.target.value)}
                        className="w-16 bg-elvis-medium border-gray-700 text-white"
                        placeholder="+"
                      />
                    </TableCell>
                    <TableCell className="bg-elvis-dark text-white">
                      <Input 
                        value={formData[stat.id]?.label || ''}
                        onChange={(e) => handleChange(stat.id, 'label', e.target.value)}
                        className="w-full bg-elvis-medium border-gray-700 text-white"
                      />
                    </TableCell>
                    <TableCell className="bg-elvis-dark text-white">
                      <Input 
                        type="number"
                        value={formData[stat.id]?.sort_order || 0}
                        onChange={(e) => handleChange(stat.id, 'sort_order', parseInt(e.target.value) || 0)}
                        className="w-16 bg-elvis-medium border-gray-700 text-white"
                      />
                    </TableCell>
                    <TableCell className="text-right bg-elvis-dark text-white">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleSave(stat.id)}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditing(prev => ({ ...prev, [stat.id]: false }))}
                          className="border-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="bg-elvis-dark text-white">
                      {getIconByName(stat.icon_name)}
                    </TableCell>
                    <TableCell className="bg-elvis-dark text-white">{stat.value}</TableCell>
                    <TableCell className="bg-elvis-dark text-white">{formatNumber(stat.value)}</TableCell>
                    <TableCell className="bg-elvis-dark text-white">{stat.suffix || ''}</TableCell>
                    <TableCell className="bg-elvis-dark text-white">{stat.label}</TableCell>
                    <TableCell className="bg-elvis-dark text-white">{stat.sort_order}</TableCell>
                    <TableCell className="text-right bg-elvis-dark text-white">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(stat)} className="border-gray-700">
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
      
      <div className="border rounded-md p-4 bg-elvis-dark border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-white">Add New Stat</h3>
        
        <Tabs defaultValue="basic" className="mb-4">
          <TabsList className="bg-elvis-medium border-gray-700">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="icon">Select Icon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-value" className="text-white">Value</Label>
                <Input 
                  id="new-value"
                  type="number"
                  value={newStat.value || ''}
                  onChange={(e) => handleNewStatChange('value', parseInt(e.target.value) || 0)}
                  className="bg-elvis-medium border-gray-700 text-white"
                />
                {newStat.value ? (
                  <p className="text-xs text-gray-400 mt-1">
                    Will display as: {formatNumber(newStat.value as number)}
                  </p>
                ) : null}
              </div>
              
              <div>
                <Label htmlFor="new-suffix" className="text-white">Suffix</Label>
                <Input 
                  id="new-suffix"
                  value={newStat.suffix || ''}
                  onChange={(e) => handleNewStatChange('suffix', e.target.value)}
                  placeholder="+"
                  className="bg-elvis-medium border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="new-label" className="text-white">Label</Label>
                <Input 
                  id="new-label"
                  value={newStat.label || ''}
                  onChange={(e) => handleNewStatChange('label', e.target.value)}
                  placeholder="Photo Projects"
                  className="bg-elvis-medium border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="new-order" className="text-white">Order</Label>
                <Input 
                  id="new-order"
                  type="number"
                  value={newStat.sort_order || ''}
                  onChange={(e) => handleNewStatChange('sort_order', parseInt(e.target.value) || 0)}
                  className="bg-elvis-medium border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="icon" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              {iconOptions.map(category => (
                <div key={category.category} className="border border-gray-700 rounded-md p-4">
                  <h4 className="text-white font-medium mb-3">{category.category}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {category.icons.map(icon => (
                      <Button
                        key={icon.value}
                        variant={newStat.icon_name === icon.value ? "default" : "outline"}
                        className={`flex items-center justify-start p-2 h-auto border-gray-700 ${
                          newStat.icon_name === icon.value ? 'bg-elvis-pink text-white' : 'text-white'
                        }`}
                        onClick={() => handleNewStatChange('icon_name', icon.value)}
                      >
                        {icon.icon}
                        <span className="ml-2 text-xs">{icon.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Add Stat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatsEditor;
