import React, { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import axios from 'axios';

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/content');
        if (data?.gallery?.images) {
          setImages(data.gallery.images);
        }
      } catch (error) {
        console.error('Failed to fetch gallery', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Extract unique categories from images, then add 'All' to the front
  const uniqueCategories = [...new Set(images.map(img => img.category).filter(Boolean))];
  const categories = ['All', ...uniqueCategories];

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  if (loading) {
    return <div className="min-h-screen bg-background pt-32 text-center text-gray-500">Loading Gallery...</div>;
  }

  return (
    <div className="bg-background pt-24 pb-20 min-h-screen">
      <div className="bg-primary text-white py-16 px-4 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Gallery</h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-light">
          A visual journey through our luxurious properties, stunning interiors, and world-class amenities.
        </p>
      </div>

      <div className="container mx-auto px-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-sm font-medium transition ${filter === cat ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, i) => (
            <div 
              key={i} 
              className="relative group overflow-hidden break-inside-avoid cursor-pointer shadow-sm rounded-sm"
              onClick={() => setSelectedImage(img.src)}
            >
              <img src={img.src} alt={`Gallery ${i}`} className="w-full h-auto object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn size={32} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <button 
            className="absolute top-6 right-6 text-white hover:text-accent transition"
            onClick={() => setSelectedImage(null)}
          >
            <X size={36} />
          </button>
          <img src={selectedImage} alt="Fullscreen View" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
