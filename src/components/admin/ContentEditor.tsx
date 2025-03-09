
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Check, 
  EyeIcon, 
  FileText, 
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Desktop,
  Smartphone,
  Tablet,
  Undo,
  Redo
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Sample content data
const sampleSections = [
  { id: 'home', title: 'Home Page' },
  { id: 'about', title: 'About Page' },
  { id: 'portfolio', title: 'Portfolio' },
  { id: 'contact', title: 'Contact' },
];

const sampleContent = {
  id: '1',
  title: 'Hero Section',
  content: `<h1>Professional Videography</h1>
<p>Capturing your story with cinematic quality</p>
<p>I help brands and individuals create compelling visual content that stands out.</p>`,
  section: 'home',
  ordering: 1,
  is_published: true,
};

const ContentEditor = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState(sampleSections);
  const [content, setContent] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState('home');
  const [selectedContent, setSelectedContent] = useState<any>(sampleContent);
  const [editMode, setEditMode] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch sections and content from the database
    // For now, we'll use the sample data
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setContent([sampleContent]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedContent({
      ...selectedContent,
      content: e.target.value
    });
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedContent({
      ...selectedContent,
      title: e.target.value
    });
  };
  
  const togglePublishStatus = () => {
    setSelectedContent({
      ...selectedContent,
      is_published: !selectedContent.is_published
    });
    
    toast({
      title: 'Status updated',
      description: `Content is now ${!selectedContent.is_published ? 'published' : 'unpublished'}`,
    });
  };
  
  const saveContent = () => {
    // In a real app, you would save to the database
    toast({
      title: 'Content saved',
      description: 'Your changes have been saved successfully',
      variant: 'default',
    });
  };
  
  const insertFormatting = (tag: string) => {
    // This is a simplified version of text formatting
    // In a real app, you would implement a more robust editor
    const contentArea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!contentArea) return;
    
    const start = contentArea.selectionStart;
    const end = contentArea.selectionEnd;
    const selection = contentArea.value.substring(start, end);
    const formattedText = `<${tag}>${selection}</${tag}>`;
    
    const newContent = 
      contentArea.value.substring(0, start) + 
      formattedText + 
      contentArea.value.substring(end);
    
    setSelectedContent({
      ...selectedContent,
      content: newContent
    });
    
    // Set cursor position after operation
    setTimeout(() => {
      contentArea.focus();
      contentArea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };
  
  const getPreviewClass = () => {
    switch (previewMode) {
      case 'tablet':
        return 'max-w-[768px]';
      case 'mobile':
        return 'max-w-[375px]';
      default:
        return 'max-w-full';
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
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-elvis-pink/20"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
          <h2 className="text-lg font-medium">Content Editor</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={editMode ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setEditMode(true)}
            className={editMode ? 'bg-elvis-pink hover:bg-elvis-pink-800' : ''}
          >
            <FileText className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant={!editMode ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setEditMode(false)}
            className={!editMode ? 'bg-elvis-pink hover:bg-elvis-pink-800' : ''}
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 shrink-0 mr-4 space-y-4">
            <Card className="bg-elvis-medium border-none">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium mb-2">Sections</h3>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start ${selectedSection === section.id ? 'bg-elvis-pink text-white' : 'hover:bg-elvis-pink/20'}`}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      {section.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-elvis-medium border-none">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium mb-2">Content Blocks</h3>
                <div className="space-y-1">
                  {content
                    .filter(item => item.section === selectedSection)
                    .sort((a, b) => a.ordering - b.ordering)
                    .map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start ${selectedContent?.id === item.id ? 'bg-elvis-pink/20 text-white border-l-2 border-elvis-pink' : 'hover:bg-elvis-pink/10'}`}
                        onClick={() => setSelectedContent(item)}
                      >
                        <span className="truncate">{item.title}</span>
                        {!item.is_published && (
                          <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 px-1 py-0.5 rounded">Draft</span>
                        )}
                      </Button>
                    ))}
                </div>
                <Button className="w-full bg-elvis-pink hover:bg-elvis-pink-800">
                  Add New Block
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Main Editor Area */}
        <div className="flex-1">
          <div className="space-y-4">
            {/* Editor Toolbar */}
            <Card className="bg-elvis-medium border-none overflow-x-auto">
              <CardContent className="p-2">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => insertFormatting('h1')} title="Heading 1" className="hover:bg-elvis-pink/20">
                    H1
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertFormatting('h2')} title="Heading 2" className="hover:bg-elvis-pink/20">
                    H2
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertFormatting('h3')} title="Heading 3" className="hover:bg-elvis-pink/20">
                    H3
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1 bg-white/20" />
                  <Button variant="ghost" size="icon" onClick={() => insertFormatting('b')} title="Bold" className="hover:bg-elvis-pink/20">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => insertFormatting('i')} title="Italic" className="hover:bg-elvis-pink/20">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => insertFormatting('a href=""')} title="Link" className="hover:bg-elvis-pink/20">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1 bg-white/20" />
                  <Button variant="ghost" size="icon" onClick={() => insertFormatting('ul')} title="Bullet List" className="hover:bg-elvis-pink/20">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => insertFormatting('ol')} title="Numbered List" className="hover:bg-elvis-pink/20">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1 bg-white/20" />
                  <Button variant="ghost" size="icon" title="Insert Image" className="hover:bg-elvis-pink/20">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1 bg-white/20" />
                  <Button variant="ghost" size="icon" title="Undo" className="hover:bg-elvis-pink/20">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Redo" className="hover:bg-elvis-pink/20">
                    <Redo className="h-4 w-4" />
                  </Button>
                  
                  <div className="ml-auto flex items-center space-x-1">
                    {!editMode && (
                      <>
                        <Button 
                          variant={previewMode === 'desktop' ? 'default' : 'ghost'} 
                          size="icon"
                          onClick={() => setPreviewMode('desktop')}
                          className={previewMode === 'desktop' ? 'bg-elvis-pink hover:bg-elvis-pink-800' : 'hover:bg-elvis-pink/20'}
                        >
                          <Desktop className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={previewMode === 'tablet' ? 'default' : 'ghost'} 
                          size="icon"
                          onClick={() => setPreviewMode('tablet')}
                          className={previewMode === 'tablet' ? 'bg-elvis-pink hover:bg-elvis-pink-800' : 'hover:bg-elvis-pink/20'}
                        >
                          <Tablet className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={previewMode === 'mobile' ? 'default' : 'ghost'} 
                          size="icon"
                          onClick={() => setPreviewMode('mobile')}
                          className={previewMode === 'mobile' ? 'bg-elvis-pink hover:bg-elvis-pink-800' : 'hover:bg-elvis-pink/20'}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-white/20" />
                      </>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={togglePublishStatus}
                      className="border-white/20 hover:bg-elvis-pink/20"
                    >
                      {selectedContent?.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={saveContent}
                      className="bg-elvis-pink hover:bg-elvis-pink-800"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Editor Content */}
            <Card className="bg-elvis-medium border-none">
              <CardContent className="p-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Title</Label>
                      <Input 
                        id="title" 
                        value={selectedContent?.title || ''} 
                        onChange={handleTitleChange}
                        className="bg-elvis-light border-white/10 focus-visible:ring-elvis-pink mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content-editor" className="text-white">Content (HTML)</Label>
                      <textarea 
                        id="content-editor" 
                        value={selectedContent?.content || ''} 
                        onChange={handleContentChange}
                        className="w-full h-96 mt-1 px-3 py-2 bg-elvis-light text-white border border-white/10 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-elvis-pink focus-visible:ring-offset-2 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{selectedContent?.title}</h3>
                    
                    <div className={`border border-white/10 rounded-md overflow-hidden transition-all duration-300 mx-auto ${getPreviewClass()}`}>
                      <div className="bg-elvis-dark p-2 border-b border-white/10 flex items-center">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="mx-auto text-xs text-white/60">Preview</div>
                      </div>
                      <div className="p-6 bg-white text-black">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent?.content || '' }} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
