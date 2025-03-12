
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMedia, ExtendedMedia } from '@/hooks/useMedia';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, X } from 'lucide-react';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
  );
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Fetch all media
  const { data: allMedia, isLoading } = useMedia({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedTags, setSearchParams]);

  // Extract unique categories and tags from media data
  const categories = allMedia 
    ? ['all', ...new Set(allMedia.map(item => item.category).filter(Boolean))] 
    : ['all'];
  
  const allTags = allMedia 
    ? [...new Set(allMedia.flatMap(item => item.tags || []))]
    : [];

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already updated via state
  };

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Handle video play to ensure only one video plays at a time
  const handleVideoPlay = (id: string) => {
    setCurrentVideoId(id);
  };

  // Helper function to get video URL from media item
  const getVideoUrl = (item: ExtendedMedia): string => {
    // First try video_url, then fallback to file_url
    return item.video_url || item.file_url || '';
  };

  return (
    <Layout>
      <PageHeader
        title="Portfolio"
        subtitle="Explore my creative work across various projects and styles"
        bgImage="/images/portfolio-header.jpg"
      />

      <section className="py-16 bg-elvis-darker">
        <div className="container mx-auto px-4">
          {/* Search and filters */}
          <div className="mb-10">
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-elvis-dark border-elvis-border text-white"
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <Button type="submit" variant="default">Search</Button>
            </form>

            <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-6 bg-elvis-dark">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {allTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X size={14} className="ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Media grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 text-elvis-pink animate-spin" />
            </div>
          ) : allMedia && allMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMedia.map((item, index) => {
                const isVideo = item.type === 'video';
                const isVertical = item.orientation === 'vertical';
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/portfolio/${item.slug || item.id}`}>
                      <div className="overflow-hidden rounded-xl bg-elvis-dark hover:shadow-lg transition-all duration-300 hover:shadow-elvis-pink/20">
                        {isVideo ? (
                          <VideoPlayer
                            videoUrl={getVideoUrl(item)}
                            thumbnail={item.thumbnail_url || '/placeholder.svg'}
                            title={item.title}
                            isVertical={isVertical}
                            onPlay={() => handleVideoPlay(item.id)}
                            autoPlay={currentVideoId === item.id}
                            muted={true}
                            controls={true}
                          />
                        ) : (
                          <AspectRatio ratio={isVertical ? 9/16 : 16/9}>
                            <img
                              src={item.file_url || '/placeholder.svg'}
                              alt={item.title}
                              className="object-cover rounded-lg w-full h-full"
                            />
                          </AspectRatio>
                        )}
                        
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          {item.description && (
                            <p className="mt-2 text-gray-300 text-sm line-clamp-2">{item.description}</p>
                          )}
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white text-xl">No projects found with the selected filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedTags([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
