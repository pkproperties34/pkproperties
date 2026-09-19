import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

const ProjectForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [coverImage, setCoverImage] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      location: { address: '', lat: 0, lng: 0, mapUrl: '' },
      propertyType: 'Residential',
      status: 'Upcoming',
      startingPrice: '',
      configurations: '',
      description: '',
      highlights: { landArea: '', towers: '', floors: '', units: '', possession: '', reraInfo: '' },
      isFeatured: false,
      isPublished: false
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`);
          // Populate form
          Object.keys(data).forEach(key => {
            if (key === 'configurations' && Array.isArray(data[key])) {
              setValue('configurations', data[key].join(', '));
            } else {
              setValue(key, data[key]);
            }
          });
          if (data.coverImage) setCoverImage(data.coverImage);
        } catch (error) {
          console.error('Failed to fetch project:', error);
          alert('Error loading project');
        }
      };
      fetchProject();
    }
  }, [id, isEditMode, setValue]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setCoverImage(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Ensure backend upload route is working.');
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        ...data,
        coverImage,
        configurations: data.configurations.split(',').map(c => c.trim()).filter(Boolean)
      };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/projects/${id}`, payload, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/projects`, payload, config);
      }
      
      navigate('/admin/projects');
    } catch (error) {
      console.error('Save failed:', error);
      alert(error.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/projects')} className="mr-4 p-2 text-gray-500 hover:text-primary transition bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Project' : 'Add New Project'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 space-y-8">
        
        {/* Basic Info */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input {...register('name', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
              {errors.name && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (e.g., sattva-lago) *</label>
              <input {...register('slug', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select {...register('propertyType')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plots">Plots</option>
                <option value="Villas">Villas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹) *</label>
              <input type="number" {...register('startingPrice', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Configurations (comma separated)</label>
              <input {...register('configurations')} placeholder="2 BHK, 3 BHK, 4 BHK" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Cover Image</h3>
          <div className="flex items-start space-x-6">
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="w-48 h-32 object-cover rounded-md border border-gray-200" />
            ) : (
              <div className="w-48 h-32 bg-gray-100 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400">
                No image
              </div>
            )}
            <div className="flex-1">
              <label className="flex items-center justify-center w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                {imageUploading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Upload className="mr-2" size={18} />}
                {imageUploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
              </label>
              <p className="text-xs text-gray-500 mt-2">Recommended size: 1920x1080px (Max 5MB)</p>
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
              <input {...register('location.address', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL (iframe src)</label>
              <input {...register('location.mapUrl')} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </section>

        {/* Description & Highlights */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Details</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
            <textarea {...register('description', { required: true })} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Area</label>
              <input {...register('highlights.landArea')} placeholder="e.g. 10 Acres" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Towers</label>
              <input type="number" {...register('highlights.towers')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
              <input type="number" {...register('highlights.floors')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
              <input type="number" {...register('highlights.units')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Possession Date</label>
              <input {...register('highlights.possession')} placeholder="e.g. Dec 2026" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RERA Number</label>
              <input {...register('highlights.reraInfo')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Visibility Settings</h3>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" {...register('isPublished')} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
              <span className="text-sm font-medium text-gray-700">Published (Visible to public)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
              <span className="text-sm font-medium text-gray-700">Featured (Show on Homepage)</span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6 border-t flex justify-end">
          <button 
            type="button" 
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-4 font-medium transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2 bg-primary text-white rounded-md hover:bg-gray-800 font-medium transition flex items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {isEditMode ? 'Update Project' : 'Save Project'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProjectForm;
