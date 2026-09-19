import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MapPin } from 'lucide-react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call for now or connecting to backend if populated
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Premium Projects</h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-light">
          Explore our exclusive collection of upcoming and completed projects designed for luxury living and ultimate comfort.
        </p>
      </div>

      <div className="container mx-auto px-6">
        {/* Filter Section */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <p className="text-gray-600 font-medium">Showing {projects.length} projects</p>
          <button className="flex items-center text-primary font-medium hover:text-accent transition">
            <Filter size={18} className="mr-2" /> Filters
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? projects.map((project) => (
              <div key={project._id} className="bg-white group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {project.status}
                  </div>
                  <img 
                    src={project.coverImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-serif text-primary mb-2 group-hover:text-accent transition-colors">{project.name}</h3>
                      <p className="text-gray-500 flex items-center text-sm"><MapPin size={14} className="mr-1 text-accent"/> {project.location?.address}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Starting From</p>
                      <p className="text-lg font-bold text-primary">₹{project.startingPrice?.toLocaleString() || 'On Request'}</p>
                    </div>
                    <Link to={`/projects/${project.slug}`} className="text-accent font-medium hover:text-yellow-600 transition flex items-center">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white shadow-sm border border-gray-100">
                <h3 className="text-2xl font-serif text-gray-400 mb-2">No projects found</h3>
                <p className="text-gray-500">We are currently updating our portfolio. Please check back soon.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
