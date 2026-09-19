import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const LandingPageBuilder = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingState, setUploadingState] = useState({}); // Track uploading state for various fields

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/content`);
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/content`, content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e, path) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingState({ ...uploadingState, [path]: true });
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      
      // Update nested state dynamically based on path
      updateNestedState(path, data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploadingState({ ...uploadingState, [path]: false });
    }
  };

  // Helper to update nested state like 'hero.backgroundImage' or 'amenities.slides.0.image'
  const updateNestedState = (path, value) => {
    setContent((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleChange = (path, value) => {
    updateNestedState(path, value);
  };

  if (loading || !content) return <div className="p-8 text-center text-gray-500">Loading Builder...</div>;

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800">Landing Page Builder</h3>
        <button 
          onClick={handleSave} disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-gray-800 transition flex items-center font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
          Save Changes
        </button>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Hero Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            {content.hero.backgroundImage && <img src={content.hero.backgroundImage} alt="Hero" className="w-full h-48 object-cover rounded-md mb-2 border border-gray-300" />}
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer max-w-xs">
              {uploadingState['hero.backgroundImage'] ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
              Replace Image
              <input type="file" className="sr-only" onChange={(e) => handleUpload(e, 'hero.backgroundImage')} disabled={uploadingState['hero.backgroundImage']} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text 1</label>
            <input type="text" value={content.hero.logoTitleFirst} onChange={(e) => handleChange('hero.logoTitleFirst', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text 2</label>
            <input type="text" value={content.hero.logoTitleSecond} onChange={(e) => handleChange('hero.logoTitleSecond', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
            <input type="text" value={content.hero.mainTitle} onChange={(e) => handleChange('hero.mainTitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input type="text" value={content.hero.subtitle} onChange={(e) => handleChange('hero.subtitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Project Highlights</h4>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            {content.highlights.backgroundImage && <img src={content.highlights.backgroundImage} alt="Highlights BG" className="w-full h-32 object-cover rounded-md mb-2 border border-gray-300" />}
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer max-w-xs">
              {uploadingState['highlights.backgroundImage'] ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
              Replace Background
              <input type="file" className="sr-only" onChange={(e) => handleUpload(e, 'highlights.backgroundImage')} disabled={uploadingState['highlights.backgroundImage']} />
            </label>
        </div>

        <div className="space-y-4">
          {content.highlights.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-white p-3 border border-gray-200 rounded-md">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Icon Name (Lucide)</label>
                <input type="text" value={item.iconName} onChange={(e) => handleChange(`highlights.items.${idx}.iconName`, e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Text</label>
                <input type="text" value={item.text} onChange={(e) => handleChange(`highlights.items.${idx}.text`, e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent" />
              </div>
              <button onClick={() => {
                const newItems = [...content.highlights.items];
                newItems.splice(idx, 1);
                updateNestedState('highlights.items', newItems);
              }} className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded-md">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={() => {
            updateNestedState('highlights.items', [...content.highlights.items, { iconName: 'Star', text: 'New Highlight' }]);
          }} className="flex items-center text-sm font-medium text-accent hover:text-yellow-600">
            <Plus size={16} className="mr-1" /> Add Highlight
          </button>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Amenities Slider</h4>
        <div className="space-y-6">
          {content.amenities.slides.map((slide, idx) => (
            <div key={idx} className="bg-white p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h5 className="font-bold text-gray-700">Slide {idx + 1}</h5>
                <button onClick={() => {
                  const newSlides = [...content.amenities.slides];
                  newSlides.splice(idx, 1);
                  updateNestedState('amenities.slides', newSlides);
                }} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                  <Trash2 size={14} className="mr-1" /> Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                  {slide.image && <img src={slide.image} alt="Slide" className="w-32 h-20 object-cover rounded border mb-2" />}
                  <label className="inline-block px-3 py-1 border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-50">
                     {uploadingState[`amenities.slides.${idx}.image`] ? 'Uploading...' : 'Replace Image'}
                     <input type="file" className="sr-only" onChange={(e) => handleUpload(e, `amenities.slides.${idx}.image`)} />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={slide.title} onChange={(e) => handleChange(`amenities.slides.${idx}.title`, e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={slide.description} onChange={(e) => handleChange(`amenities.slides.${idx}.description`, e.target.value)} rows="2" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => {
            updateNestedState('amenities.slides', [...content.amenities.slides, { image: '', title: 'New Slide', description: 'Description' }]);
          }} className="flex items-center text-sm font-medium text-accent hover:text-yellow-600">
            <Plus size={16} className="mr-1" /> Add Slide
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Gallery Manager</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {content.gallery?.images?.map((img, idx) => (
            <div key={idx} className="bg-white p-3 border border-gray-200 rounded-md relative flex items-start gap-4">
              {img.src ? (
                <img src={img.src} alt="Gallery" className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex flex-col items-center justify-center rounded-md flex-shrink-0">
                   {uploadingState[`gallery.images.${idx}.src`] ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <ImageIcon size={24} className="text-gray-300 mb-1" />}
                   <label className="text-[10px] text-accent cursor-pointer hover:underline mt-1 font-medium">
                     Upload
                     <input type="file" className="sr-only" onChange={(e) => handleUpload(e, `gallery.images.${idx}.src`)} />
                   </label>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={img.category || 'Projects'} 
                  onChange={(e) => handleChange(`gallery.images.${idx}.category`, e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent bg-white"
                >
                  <option value="Projects">Projects</option>
                  <option value="Interiors">Interiors</option>
                  <option value="Exteriors">Exteriors</option>
                  <option value="Amenities">Amenities</option>
                </select>
                
                {img.src && (
                  <label className="inline-block mt-2 text-xs text-blue-600 hover:underline cursor-pointer">
                    Replace Image
                    <input type="file" className="sr-only" onChange={(e) => handleUpload(e, `gallery.images.${idx}.src`)} />
                  </label>
                )}
              </div>
              
              <button 
                onClick={() => {
                  const newImages = [...(content.gallery?.images || [])];
                  newImages.splice(idx, 1);
                  updateNestedState('gallery.images', newImages);
                }} 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <button onClick={() => {
          const currentImages = content.gallery?.images || [];
          updateNestedState('gallery.images', [...currentImages, { src: '', category: 'Projects' }]);
        }} className="flex items-center text-sm font-medium text-accent hover:text-yellow-600">
          <Plus size={16} className="mr-1" /> Add Gallery Image
        </button>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">FAQ Manager</h4>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">FAQ Background Image</label>
            {content.faqs?.image && <img src={content.faqs.image} alt="FAQ BG" className="w-full h-32 object-cover rounded-md mb-2 border border-gray-300" />}
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer max-w-xs">
              {uploadingState['faqs.image'] ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
              Replace Background Image
              <input type="file" className="sr-only" onChange={(e) => handleUpload(e, 'faqs.image')} disabled={uploadingState['faqs.image']} />
            </label>
        </div>

        <div className="space-y-4">
          {content.faqs?.items?.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-white p-4 border border-gray-200 rounded-md relative">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Question</label>
                  <input type="text" value={item.question} onChange={(e) => handleChange(`faqs.items.${idx}.question`, e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Answer</label>
                  <textarea value={item.answer} onChange={(e) => handleChange(`faqs.items.${idx}.answer`, e.target.value)} rows="2" className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
              <button onClick={() => {
                const newItems = [...(content.faqs?.items || [])];
                newItems.splice(idx, 1);
                updateNestedState('faqs.items', newItems);
              }} className="p-2 text-red-500 hover:bg-red-50 rounded-md self-center">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={() => {
            const currentItems = content.faqs?.items || [];
            updateNestedState('faqs.items', [...currentItems, { question: 'New Question', answer: 'Answer here...' }]);
          }} className="flex items-center text-sm font-medium text-accent hover:text-yellow-600">
            <Plus size={16} className="mr-1" /> Add FAQ Item
          </button>
        </div>
      </section>

      {/* Floor Plans Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Floor Plans & Walkthrough Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            {content.floorPlans?.backgroundImage && <img src={content.floorPlans.backgroundImage} alt="Floor Plans BG" className="w-full h-48 object-cover rounded-md mb-2 border border-gray-300" />}
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer max-w-xs">
              {uploadingState['floorPlans.backgroundImage'] ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
              Replace Image
              <input type="file" className="sr-only" onChange={(e) => handleUpload(e, 'floorPlans.backgroundImage')} disabled={uploadingState['floorPlans.backgroundImage']} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
            <input type="text" value={content.floorPlans?.titleLine1 || ''} onChange={(e) => handleChange('floorPlans.titleLine1', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 2</label>
            <input type="text" value={content.floorPlans?.titleLine2 || ''} onChange={(e) => handleChange('floorPlans.titleLine2', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 1</label>
            <textarea rows="3" value={content.floorPlans?.description1 || ''} onChange={(e) => handleChange('floorPlans.description1', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 2</label>
            <textarea rows="3" value={content.floorPlans?.description2 || ''} onChange={(e) => handleChange('floorPlans.description2', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
        </div>
      </section>

      {/* Location Highlights Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Location Highlights</h4>
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Image</label>
            {content.location?.image && <img src={content.location.image} alt="Location" className="w-full h-48 object-cover rounded-md mb-2 border border-gray-300" />}
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer max-w-xs">
              {uploadingState['location.image'] ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
              Replace Location Image
              <input type="file" className="sr-only" onChange={(e) => handleUpload(e, 'location.image')} disabled={uploadingState['location.image']} />
            </label>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={content.location?.title || ''} onChange={(e) => handleChange('location.title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Highlights List</label>
          {content.location?.items?.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-white p-3 border border-gray-200 rounded-md">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Location Name</label>
                <input type="text" value={item.name} onChange={(e) => handleChange(`location.items.${idx}.name`, e.target.value)} placeholder="e.g. Continental Hospitals" className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Time/Distance</label>
                <input type="text" value={item.time} onChange={(e) => handleChange(`location.items.${idx}.time`, e.target.value)} placeholder="e.g. 8 Min" className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent" />
              </div>
              <button onClick={() => {
                const newItems = [...(content.location?.items || [])];
                newItems.splice(idx, 1);
                updateNestedState('location.items', newItems);
              }} className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded-md">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={() => {
            const currentItems = content.location?.items || [];
            updateNestedState('location.items', [...currentItems, { name: 'New Location', time: '5 Min' }]);
          }} className="flex items-center text-sm font-medium text-accent hover:text-yellow-600">
            <Plus size={16} className="mr-1" /> Add Location
          </button>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-gray-800 mb-4">Vision Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            {content.vision?.image && <img src={content.vision.image} alt="Vision BG" className="w-full h-48 object-cover rounded-md mb-2 border border-gray-300" />}
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer max-w-xs">
              {uploadingState['vision.image'] ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
              Replace Image
              <input type="file" className="sr-only" onChange={(e) => handleUpload(e, 'vision.image')} disabled={uploadingState['vision.image']} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
            <input type="text" value={content.vision?.titleLine1 || ''} onChange={(e) => handleChange('vision.titleLine1', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 2</label>
            <input type="text" value={content.vision?.titleLine2 || ''} onChange={(e) => handleChange('vision.titleLine2', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="4" value={content.vision?.description || ''} onChange={(e) => handleChange('vision.description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPageBuilder;
