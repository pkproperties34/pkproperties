import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all projects (even unpublished ones) for the admin dashboard
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/projects');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500">Manage your real estate projects and developments.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/projects/new')}
          className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition flex items-center text-sm font-medium"
        >
          <Plus size={18} className="mr-2" /> Add New Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="flex items-center text-gray-600 hover:text-primary border border-gray-300 px-4 py-2 rounded-md text-sm transition">
            <Filter size={16} className="mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Visibility</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading projects...</td></tr>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">₹ {project.startingPrice}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.location?.address}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.isPublished ? (
                        <span className="text-green-600 text-sm flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Published</span>
                      ) : (
                        <span className="text-gray-500 text-sm flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div> Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => navigate(`/admin/projects/edit/${project._id}`)} className="p-2 text-gray-400 hover:text-blue-600 transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(project._id)} className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Showing {filteredProjects.length} of {projects.length} results</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
