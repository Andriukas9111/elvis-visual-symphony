
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
import { Loader2, Search, X, GridIcon, ListIcon } from 'lucide-react';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';
import MediaCard from '@/components/home/featured/MediaCard';

const Portfolio = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
  );
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    return false; // Prevent default navigation
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
          {/* Search and filters panel */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-elvis-dark rounded-2xl p-6 mb-10 shadow-xl shadow-black/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Find Projects</h2>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-elvis-darker border-elvis-border text-white focus:border-elvis-pink focus:ring-elvis-pink focus:ring-1"
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
              <Button type="submit" variant="default" className="bg-elvis-pink hover:bg-elvis-pink/80">Search</Button>
            </form>

            <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Categories</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-elvis-pink text-white' : 'bg-elvis-darker text-gray-400'}`}
                  >
                    <GridIcon size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-elvis-pink text-white' : 'bg-elvis-darker text-gray-400'}`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
              <TabsList className="bg-elvis-darker">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="capitalize data-[state=active]:bg-elvis-pink data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {allTags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge 
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer capitalize text-sm py-1 px-3 ${selectedTags.includes(tag) ? 'bg-elvis-pink hover:bg-elvis-pink/80' : 'hover:bg-elvis-dark'}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X size={14} className="ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Media display section */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 text-elvis-pink animate-spin" />
            </div>
          ) : allMedia && allMedia.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
              }
            >
              {allMedia.map((item, index) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  currentVideoId={currentVideoId}
                  onVideoPlay={handleVideoPlay}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-elvis-dark rounded-2xl p-8 shadow-xl"
            >
              <p className="text-white text-xl mb-4">No projects found with the selected filters.</p>
              <p className="text-gray-400 mb-6">Try adjusting your search criteria or clearing filters.</p>
              <Button 
                variant="outline" 
                className="border-elvis-pink text-elvis-pink hover:bg-elvis-pink hover:text-white transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedTags([]);
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
