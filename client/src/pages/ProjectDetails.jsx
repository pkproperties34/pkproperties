import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Home, CheckCircle, Info, Download, Phone } from 'lucide-react';

const ProjectDetails = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dummy data for now (since backend might be empty)
  const project = {
    name: 'Sattva Lago Inspiration',
    location: { address: 'Jubilee Hills, Hyderabad' },
    status: 'Upcoming',
    startingPrice: '4,50,00,000',
    description: 'An exclusive collection of ultra-luxury residences designed for those who appreciate the finer things in life. Featuring expansive living spaces, panoramic views, and world-class amenities.',
    highlights: {
      landArea: '5 Acres',
      towers: 3,
      floors: 35,
      units: 150,
      possession: 'Dec 2027',
      reraInfo: 'P0123456789'
    },
    configurations: ['3 BHK', '4 BHK', 'Penthouse'],
    amenities: ['Infinity Pool', 'Clubhouse', 'Spa', 'Gymnasium', 'Concierge Service'],
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
            <span className="bg-accent text-white px-4 py-1 text-sm font-bold uppercase tracking-wider mb-4 inline-block">
              {project.status}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{project.name}</h1>
            <p className="text-gray-300 flex items-center text-lg"><MapPin size={20} className="mr-2 text-accent"/> {project.location.address}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {['overview', 'amenities', 'gallery', 'location'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-medium uppercase tracking-wide text-sm whitespace-nowrap pb-1 border-b-2 transition-colors ${activeTab === tab ? 'border-accent text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3">
          
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif text-primary mb-6 flex items-center"><Info className="mr-3 text-accent"/> Project Overview</h2>
              <p className="text-gray-600 leading-relaxed mb-10 text-lg">{project.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Starting Price</p>
                  <p className="text-xl font-bold text-primary">₹ {project.startingPrice}</p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Configurations</p>
                  <p className="text-xl font-bold text-primary">{project.configurations.join(', ')}</p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Possession</p>
                  <p className="text-xl font-bold text-primary">{project.highlights.possession}</p>
                </div>
              </div>

              <h3 className="text-2xl font-serif text-primary mb-6">Key Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center text-gray-700"><CheckCircle size={18} className="text-accent mr-3"/> Land Area: {project.highlights.landArea}</li>
                <li className="flex items-center text-gray-700"><CheckCircle size={18} className="text-accent mr-3"/> Towers: {project.highlights.towers}</li>
                <li className="flex items-center text-gray-700"><CheckCircle size={18} className="text-accent mr-3"/> Floors: {project.highlights.floors}</li>
                <li className="flex items-center text-gray-700"><CheckCircle size={18} className="text-accent mr-3"/> Total Units: {project.highlights.units}</li>
              </ul>
            </div>
          )}

          {/* Amenities */}
          {activeTab === 'amenities' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif text-primary mb-6">World Class Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {project.amenities.map((amenity, i) => (
                  <div key={i} className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-accent transition">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 text-accent">
                      <Home size={24} />
                    </div>
                    <span className="font-medium text-primary">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location (Map Iframe) */}
          {activeTab === 'location' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif text-primary mb-6">Location Map</h2>
              <div className="w-full h-96 bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x3bcb974751480b5b%3A0x628045d9cc0be3ad!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Project Location"
                ></iframe>
              </div>
            </div>
          )}

          {/* Gallery */}
          {activeTab === 'gallery' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif text-primary mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-64 object-cover rounded-sm shadow-sm hover:opacity-90 transition cursor-pointer" />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Enquiry Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 shadow-xl border-t-4 border-accent sticky top-24">
            <h3 className="text-2xl font-serif text-primary mb-2">Interested?</h3>
            <p className="text-gray-500 mb-6 text-sm">Register your interest to get priority access, floor plans, and pricing details.</p>
            
            <form className="space-y-4">
              <div>
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent" required />
              </div>
              <div>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent" required />
              </div>
              <div>
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 font-bold hover:bg-gray-900 transition mt-4">
                Submit Enquiry
              </button>
            </form>
            
            <div className="mt-6 flex flex-col space-y-3">
              <button className="w-full border border-gray-300 text-primary py-3 flex items-center justify-center hover:bg-gray-50 transition">
                <Download size={18} className="mr-2"/> Download Brochure
              </button>
              <button className="w-full bg-green-500 text-white py-3 flex items-center justify-center hover:bg-green-600 transition">
                <Phone size={18} className="mr-2"/> WhatsApp Us
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;
