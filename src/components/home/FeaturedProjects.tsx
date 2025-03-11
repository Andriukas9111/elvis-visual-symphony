
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedProjects = () => {
  // Sample projects data
  const projects = [
    {
      id: 1,
      title: 'Urban Photography',
      category: 'Photography',
      image: '/lovable-uploads/4b1271b8-e1a8-494f-a510-e17f286adf45.png'
    },
    {
      id: 2,
      title: 'Nature Documentary',
      category: 'Videography',
      image: '/lovable-uploads/6e0bc9cc-9ea9-49c7-8cc5-71cd5c487e4d.png'
    },
    {
      id: 3,
      title: 'Product Shoot',
      category: 'Commercial',
      image: '/lovable-uploads/f16c3611-113c-4306-9e59-5e0d3a6d3200.png'
    }
  ];

  return (
    <section className="py-20 px-6 bg-elvis-dark">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-elvis-pink to-purple-500">
                Featured
              </span>{' '}
              Projects
            </h2>
            <p className="text-white/70 max-w-xl">
              A selection of our best work showcasing our creative approach and technical expertise.
            </p>
          </div>
          
          <Button asChild variant="link" className="text-elvis-pink mt-4 md:mt-0 group">
            <Link to="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="text-elvis-pink text-sm font-medium block mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
