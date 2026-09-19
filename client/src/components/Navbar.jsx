import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white shadow-sm transition-all duration-300">
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
        <div className="hidden lg:flex items-center space-x-8">
          <a href="#overview" className="text-sm font-semibold text-gray-800 hover:text-[#2A358C] transition">Overview</a>
          <span className="text-gray-300">|</span>
          <a href="#amenities" className="text-sm font-semibold text-gray-800 hover:text-[#2A358C] transition">Amenities</a>
          <span className="text-gray-300">|</span>
          <a href="#plans" className="text-sm font-semibold text-gray-800 hover:text-[#2A358C] transition">Plans</a>
          <span className="text-gray-300">|</span>
          <a href="#location" className="text-sm font-semibold text-gray-800 hover:text-[#2A358C] transition">Location</a>
        </div>

        {/* Action Button */}
        <div className="hidden lg:block">
          <button className="bg-sattva-btn text-white px-8 py-3 text-sm font-semibold hover:bg-sattva-btn-hover transition">
            Express your interest
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white flex flex-col items-center py-6 space-y-4 shadow-xl border-t border-gray-100">
          <a href="#overview" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Overview</a>
          <a href="#amenities" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Amenities</a>
          <a href="#plans" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Plans</a>
          <a href="#location" className="text-gray-800 font-semibold text-lg" onClick={() => setIsOpen(false)}>Location</a>
          <button className="bg-sattva-btn text-white px-8 py-3 text-sm font-semibold mt-4">
            Express your interest
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
