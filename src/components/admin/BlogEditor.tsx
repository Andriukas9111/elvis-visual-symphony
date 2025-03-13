
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContent, useCreateContent, useUpdateContent, useDeleteContent } from '@/hooks/api/useContent';
import { useMedia } from '@/hooks/useMedia';
import { Plus, Trash2, Pencil, X, FileImage, Loader2, Check, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import MediaSelector from './shared/MediaSelector';

const BlogEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: blogPosts, isLoading } = useContent('blog');
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();
  
  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [buttonText, setButtonText] = useState('Read More');
  const [buttonUrl, setButtonUrl] = useState('');
  
  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setContent('');
    setMediaUrl('');
    setButtonText('Read More');
    setButtonUrl('');
    setEditingPost(null);
  };
  
  const handleEdit = (post: any) => {
    setTitle(post.title || '');
    setSubtitle(post.subtitle || '');
    setContent(post.content || '');
    setMediaUrl(post.media_url || '');
    setButtonText(post.button_text || 'Read More');
    setButtonUrl(post.button_url || '');
    setEditingPost(post);
    setActiveTab('create');
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteContent.mutateAsync(id);
        toast.success('Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const postData = {
        title,
        subtitle,
        content,
        media_url: mediaUrl,
        button_text: buttonText,
        button_url: buttonUrl,
        section: 'blog',
        is_published: true,
        ordering: editingPost ? editingPost.ordering : (blogPosts?.length || 0) + 1
      };
      
      if (editingPost) {
        await updateContent.mutateAsync({
          id: editingPost.id,
          updates: postData
        });
        toast.success('Blog post updated successfully');
      } else {
        await createContent.mutateAsync(postData as any);
        toast.success('Blog post created successfully');
      }
      
      resetForm();
      setActiveTab('posts');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMediaSelect = (media: any) => {
    setMediaUrl(media.file_url || media.thumbnail_url);
    setIsMediaSelectorOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Blog Management</h1>
        <p className="text-muted-foreground">
          Create and manage blog posts for your website.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="create">{editingPost ? 'Edit Post' : 'Create New Post'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>
                  Manage your existing blog posts or create new ones
                </CardDescription>
              </div>
              <Button onClick={() => { resetForm(); setActiveTab('create'); }}>
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : blogPosts && blogPosts.length > 0 ? (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4">
                      {post.media_url && (
                        <div className="w-full sm:w-1/4">
                          <img 
                            src={post.media_url} 
                            alt={post.title}
                            className="w-full h-32 object-cover rounded-md" 
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        <h3 className="text-lg font-medium">{post.title}</h3>
                        <p className="text-gray-400 line-clamp-2 text-sm mt-1">
                          {post.subtitle}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil className="h-3 w-3 mr-2" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No blog posts found. Create your first post!</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post Title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle or Excerpt</Label>
                  <Input
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A brief description of your post"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your blog post content here..."
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  {mediaUrl ? (
                    <div className="relative">
                      <img 
                        src={mediaUrl} 
                        alt="Featured" 
                        className="w-full h-48 object-cover rounded-md" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setMediaUrl('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-48 border-dashed flex flex-col items-center justify-center"
                      onClick={() => setIsMediaSelectorOpen(true)}
                    >
                      <FileImage className="h-8 w-8 mb-2 text-gray-400" />
                      <span>Select Featured Image</span>
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                      id="buttonText"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Read More"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonUrl">Button URL</Label>
                    <Input
                      id="buttonUrl"
                      value={buttonUrl}
                      onChange={(e) => setButtonUrl(e.target.value)}
                      placeholder="/blog/post-slug"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : editingPost ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Update Post
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setActiveTab('posts');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isMediaSelectorOpen && (
        <MediaSelector
          open={isMediaSelectorOpen} // Add the missing 'open' prop
          onSelect={handleMediaSelect}
          onClose={() => setIsMediaSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default BlogEditor;
