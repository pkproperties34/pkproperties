import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibility, setVisibility] = useState({ projects: true, properties: true, plans: true });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/content`);
        if (data?.global?.visibility) {
          setVisibility({
            projects: data.global.visibility.projects !== false,
            properties: data.global.visibility.properties !== false,
            plans: data.global.visibility.plans !== false
          });
        }
      } catch (error) {
        console.error('Failed to fetch navbar config', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* Logo area - using text as placeholder for real logo */}
        <Link to="/" className="flex flex-col items-start justify-center">
          <div className="flex items-end">
            <div className="flex space-x-1 items-end mr-2">
              <div className="w-1.5 h-4 bg-[#3AB0E2]"></div>
              <div className="w-1.5 h-6 bg-[#8BC53F]"></div>
              <div className="w-1.5 h-8 bg-[#F8981D]"></div>
              <div className="w-1.5 h-10 bg-[#ED1C24]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">PK</span>
              <span className="text-3xl font-bold text-[#2A358C] uppercase tracking-tight leading-none mt-1">PROPERTIES</span>
            </div>
          </div>
          <span className="text-[0.6rem] text-gray-400 mt-1 uppercase tracking-wider">HOMES DESIGNED LIKE A DESTINATION</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {visibility.projects && (
            <>
              <Link to="/projects" className="text-sm font-semibold text-gray-800 hover:text-accent transition">Projects</Link>
              <span className="text-gray-300">|</span>
            </>
          )}
          {visibility.properties && (
            <>
              <Link to="/properties" className="text-sm font-semibold text-gray-800 hover:text-accent transition">Properties</Link>
              <span className="text-gray-300">|</span>
            </>
          )}
          <a href="/#overview" className="text-sm font-semibold text-gray-800 hover:text-accent transition">Overview</a>
          <span className="text-gray-300">|</span>
          <a href="/#amenities" className="text-sm font-semibold text-gray-800 hover:text-accent transition">Amenities</a>
          <span className="text-gray-300">|</span>
          {visibility.plans && (
            <>
              <a href="/#plans" className="text-sm font-semibold text-gray-800 hover:text-accent transition">Plans</a>
              <span className="text-gray-300">|</span>
            </>
          )}
          <a href="/#location" className="text-sm font-semibold text-gray-800 hover:text-accent transition">Location</a>
        </div>

        {/* Action Button */}
        <div className="hidden lg:block">
          <a href="/#eoi-form" className="inline-block bg-primary text-white px-8 py-3 text-sm font-semibold hover:bg-accent transition rounded-full shadow-lg hover:shadow-xl">
            Express your interest
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md flex flex-col items-center py-6 space-y-4 shadow-xl border-t border-gray-100">
          {visibility.projects && <Link to="/projects" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Projects</Link>}
          {visibility.properties && <Link to="/properties" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Properties</Link>}
          <a href="/#overview" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Overview</a>
          <a href="/#amenities" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Amenities</a>
          {visibility.plans && <a href="/#plans" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Plans</a>}
          <a href="/#location" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Location</a>
          <a href="/#eoi-form" onClick={() => setIsOpen(false)} className="inline-block bg-primary text-white px-8 py-3 text-sm font-semibold mt-4 rounded-full">
            Express your interest
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
