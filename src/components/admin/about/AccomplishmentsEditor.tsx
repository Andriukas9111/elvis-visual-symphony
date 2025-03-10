
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContent, useCreateContent, useUpdateContent } from '@/hooks/api/useContent';

interface Accomplishment {
  id: string;
  text: string;
}

const AccomplishmentsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: contentData, isLoading } = useContent('accomplishments');
  const createContentMutation = useCreateContent();
  const updateContentMutation = useUpdateContent();
  
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [title, setTitle] = useState('Key Accomplishments');
  const [subtitle, setSubtitle] = useState('Highlights of my professional journey');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newAccomplishment, setNewAccomplishment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Load data from database
  useEffect(() => {
    if (contentData) {
      const titleData = contentData.find(item => item.title === 'accomplishments_title');
      const subtitleData = contentData.find(item => item.title === 'accomplishments_subtitle');
      const itemsData = contentData.find(item => item.title === 'accomplishments_items');
      
      if (titleData) setTitle(titleData.content || 'Key Accomplishments');
      if (subtitleData) setSubtitle(subtitleData.content || 'Highlights of my professional journey');
      
      if (itemsData && itemsData.content) {
        try {
          const parsedItems = JSON.parse(itemsData.content);
          if (Array.isArray(parsedItems)) {
            setAccomplishments(parsedItems.map((text, index) => ({
              id: `acc-${index}`,
              text
            })));
          }
        } catch (error) {
          console.error('Error parsing accomplishments:', error);
        }
      }
    }
  }, [contentData]);
  
  const saveAccomplishments = async () => {
    setIsSaving(true);
    try {
      // Save title
      const titleData = contentData?.find(item => item.title === 'accomplishments_title');
      if (titleData) {
        await updateContentMutation.mutateAsync({
          id: titleData.id,
          updates: {
            content: title,
            section: 'accomplishments',
            title: 'accomplishments_title',
            is_published: true
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: title,
          section: 'accomplishments',
          title: 'accomplishments_title',
          is_published: true
        });
      }
      
      // Save subtitle
      const subtitleData = contentData?.find(item => item.title === 'accomplishments_subtitle');
      if (subtitleData) {
        await updateContentMutation.mutateAsync({
          id: subtitleData.id,
          updates: {
            content: subtitle,
            section: 'accomplishments',
            title: 'accomplishments_subtitle',
            is_published: true
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: subtitle,
          section: 'accomplishments',
          title: 'accomplishments_subtitle',
          is_published: true
        });
      }
      
      // Save items
      const itemsData = contentData?.find(item => item.title === 'accomplishments_items');
      const itemsToSave = accomplishments.map(acc => acc.text);
      if (itemsData) {
        await updateContentMutation.mutateAsync({
          id: itemsData.id,
          updates: {
            content: JSON.stringify(itemsToSave),
            section: 'accomplishments',
            title: 'accomplishments_items',
            is_published: true
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: JSON.stringify(itemsToSave),
          section: 'accomplishments',
          title: 'accomplishments_items',
          is_published: true
        });
      }
      
      toast({
        title: 'Success',
        description: 'Accomplishments saved successfully'
      });
    } catch (error) {
      console.error('Error saving accomplishments:', error);
      toast({
        title: 'Error',
        description: 'Failed to save accomplishments',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const addAccomplishment = () => {
    if (!newAccomplishment.trim()) return;
    
    setAccomplishments(prev => [
      ...prev, 
      { id: `acc-${Date.now()}`, text: newAccomplishment }
    ]);
    setNewAccomplishment('');
    setIsAddingNew(false);
  };
  
  const startEditing = (acc: Accomplishment) => {
    setIsEditing(acc.id);
    setEditText(acc.text);
  };
  
  const saveEdit = () => {
    if (!isEditing) return;
    
    setAccomplishments(prev => 
      prev.map(acc => 
        acc.id === isEditing 
          ? { ...acc, text: editText } 
          : acc
      )
    );
    setIsEditing(null);
    setEditText('');
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setEditText('');
  };
  
  const deleteAccomplishment = (id: string) => {
    setAccomplishments(prev => prev.filter(acc => acc.id !== id));
  };
  
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...accomplishments];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setAccomplishments(newList);
  };
  
  const moveDown = (index: number) => {
    if (index === accomplishments.length - 1) return;
    const newList = [...accomplishments];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setAccomplishments(newList);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="animate-pulse h-8 w-1/3 bg-secondary rounded"></div>
            <div className="animate-pulse h-6 w-1/2 bg-secondary/70 rounded"></div>
            <div className="animate-pulse h-20 w-full bg-secondary/50 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accomplishments Section</CardTitle>
          <CardDescription>
            Manage the titles and content of your accomplishments section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Key Accomplishments"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Highlights of my professional journey"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Accomplishments List</CardTitle>
            <CardDescription>
              Add, edit or remove your professional accomplishments
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingNew && (
            <div className="mb-6 p-4 border rounded-md">
              <Label htmlFor="newAccomplishment" className="mb-2 block">New Accomplishment</Label>
              <div className="flex gap-2">
                <Input
                  id="newAccomplishment"
                  value={newAccomplishment}
                  onChange={(e) => setNewAccomplishment(e.target.value)}
                  placeholder="Enter a new professional accomplishment"
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={addAccomplishment} size="sm">
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsAddingNew(false)} variant="outline" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {accomplishments.length > 0 ? (
            <div className="space-y-3">
              {accomplishments.map((acc, index) => (
                <div 
                  key={acc.id} 
                  className="p-4 border rounded-md flex items-start justify-between group"
                >
                  {isEditing === acc.id ? (
                    <div className="flex-1 pr-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="flex-1 pt-1">{acc.text}</p>
                  )}
                  
                  <div className="flex gap-1 shrink-0">
                    {isEditing === acc.id ? (
                      <>
                        <Button onClick={saveEdit} size="icon" variant="ghost">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={cancelEdit} size="icon" variant="ghost">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => moveUp(index)} 
                          size="icon" 
                          variant="ghost"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => moveDown(index)} 
                          size="icon" 
                          variant="ghost"
                          disabled={index === accomplishments.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => startEditing(acc)} size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => deleteAccomplishment(acc.id)} size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No accomplishments added yet. Add your first professional achievement.</p>
            </div>
          )}
          
          <Button 
            onClick={saveAccomplishments} 
            disabled={isSaving}
            className="w-full mt-6"
          >
            {isSaving ? 'Saving...' : 'Save Accomplishments'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccomplishmentsEditor;
