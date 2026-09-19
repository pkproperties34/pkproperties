import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all properties (even unpublished ones) for the admin dashboard
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.filter(p => p._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <p className="text-gray-500">Manage individual property listings.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/properties/new')}
          className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition flex items-center text-sm font-medium"
        >
          <Plus size={18} className="mr-2" /> Add New Property
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search properties..." 
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
                <th className="px-6 py-3 font-medium">Property Title</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading properties...</td></tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{property.title}</div>
                      <div className="text-xs text-gray-500">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{property.propertyType}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹ {property.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        property.status === 'Available' ? 'bg-green-100 text-green-700' :
                        property.status === 'Sold Out' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => navigate(`/admin/properties/edit/${property._id}`)} className="p-2 text-gray-400 hover:text-blue-600 transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(property._id)} className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No properties found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Showing {filteredProperties.length} of {properties.length} results</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;
