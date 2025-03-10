
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Save, Trash2 } from 'lucide-react';
import { StatItem, useDeleteStat, useUpdateStat } from '@/hooks/api/useStats';
import { useToast } from '@/components/ui/use-toast';
import { IconSelector } from './IconSelector';

interface StatsTableProps {
  stats: StatItem[];
  formatNumber: (num: number) => string;
  getIconByName: (name: string) => React.ReactNode;
}

const StatsTable: React.FC<StatsTableProps> = ({ 
  stats, 
  formatNumber, 
  getIconByName 
}) => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, StatItem>>({});

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

  return (
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
          {stats.map((stat) => (
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
                        <IconSelector />
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
  );
};

export default StatsTable;
