import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

const PropertyForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // Cloudinary Upload States
  const [images, setImages] = useState([]);
  const [floorPlan, setFloorPlan] = useState('');
  const [brochure, setBrochure] = useState('');
  const [uploading, setUploading] = useState({ images: false, floorPlan: false, brochure: false });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      project: '',
      location: '',
      price: '',
      propertyType: 'Apartment',
      bedrooms: '',
      bathrooms: '',
      area: '',
      status: 'Available',
      description: '',
      isFeatured: false,
      isPublished: false
    }
  });

  useEffect(() => {
    // Fetch Projects for Dropdown
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();

    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`);
          Object.keys(data).forEach(key => {
            if (key === 'project' && data[key]) {
              setValue('project', typeof data[key] === 'object' ? data[key]._id : data[key]);
            } else {
              setValue(key, data[key]);
            }
          });
          if (data.images) setImages(data.images);
          if (data.floorPlan) setFloorPlan(data.floorPlan);
          if (data.brochure) setBrochure(data.brochure);
        } catch (error) {
          console.error('Failed to fetch property:', error);
          alert('Error loading property');
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode, setValue]);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading({ ...uploading, [type]: true });
    const formData = new FormData();
    formData.append('image', file); // API expects 'image' key, works for pdf too on cloudinary via multer

    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      
      if (type === 'images') {
        setImages([...images, data.url]);
      } else if (type === 'floorPlan') {
        setFloorPlan(data.url);
      } else if (type === 'brochure') {
        setBrochure(data.url);
      }
    } catch (error) {
      console.error(`${type} upload failed:`, error);
      alert('Upload failed');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        ...data,
        images,
        floorPlan,
        brochure,
        project: data.project || null // Allow null if not assigned to project
      };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/properties/${id}`, payload, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/properties`, payload, config);
      }
      
      navigate('/admin/properties');
    } catch (error) {
      console.error('Save failed:', error);
      alert(error.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/properties')} className="mr-4 p-2 text-gray-500 hover:text-primary transition bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 space-y-8">
        
        {/* Basic Info */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
              <input {...register('title', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
              {errors.title && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (e.g., modern-villa-1) *</label>
              <input {...register('slug', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Project (Optional)</label>
              <select {...register('project')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">-- No Project --</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input {...register('location', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" {...register('price', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="Available">Available</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select {...register('propertyType')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input type="number" {...register('bedrooms')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input type="number" {...register('bathrooms')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (e.g. 1500 sqft)</label>
              <input {...register('area')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </section>

        {/* Details */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea {...register('description', { required: true })} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
          </div>
        </section>

        {/* Media Uploads */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Media & Files</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Images (Multiple)</label>
            <div className="flex flex-wrap gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32">
                  <img src={img} alt="Property" className="w-full h-full object-cover rounded-md border border-gray-200" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">&times;</button>
                </div>
              ))}
              <label className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                {uploading.images ? <Loader2 className="animate-spin text-gray-400" size={24} /> : <Upload className="text-gray-400" size={24} />}
                <span className="text-xs text-gray-500 mt-2">Add Image</span>
                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUpload(e, 'images')} disabled={uploading.images} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor Plan Image</label>
              {floorPlan && <img src={floorPlan} alt="Floor plan" className="w-32 h-32 object-contain mb-2 border rounded p-1" />}
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                {uploading.floorPlan ? <Loader2 className="animate-spin mr-2" size={18} /> : <Upload className="mr-2" size={18} />}
                Upload Floor Plan
                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUpload(e, 'floorPlan')} disabled={uploading.floorPlan} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brochure (PDF)</label>
              {brochure && <a href={brochure} target="_blank" rel="noreferrer" className="text-blue-500 text-sm mb-2 block hover:underline">View Current Brochure</a>}
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                {uploading.brochure ? <Loader2 className="animate-spin mr-2" size={18} /> : <Upload className="mr-2" size={18} />}
                Upload Brochure
                <input type="file" className="sr-only" accept="application/pdf" onChange={(e) => handleUpload(e, 'brochure')} disabled={uploading.brochure} />
              </label>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Visibility Settings</h3>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" {...register('isPublished')} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6 border-t flex justify-end">
          <button type="button" onClick={() => navigate('/admin/properties')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-4 font-medium transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2 bg-primary text-white rounded-md hover:bg-gray-800 font-medium transition flex items-center">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {isEditMode ? 'Update Property' : 'Save Property'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default PropertyForm;
