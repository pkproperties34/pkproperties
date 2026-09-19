import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  const [global, setGlobal] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/content`);
        if (data && data.global) {
          setGlobal(data.global);
        }
      } catch (error) {
        console.error('Failed to fetch footer content', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <footer className="bg-[#2a358c] text-white pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/20 pb-8 mb-8">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
             <div className="flex space-x-1 items-end">
                <div className="w-1.5 h-4 bg-[#3AB0E2]"></div>
                <div className="w-1.5 h-6 bg-[#8BC53F]"></div>
                <div className="w-1.5 h-8 bg-[#F8981D]"></div>
                <div className="w-1.5 h-10 bg-[#ED1C24]"></div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white text-xl font-bold uppercase">PK</span>
                <span className="text-white text-2xl font-bold uppercase">PROPERTIES</span>
              </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <a href={`tel:${global.phone}`} className="flex items-center hover:text-gray-300 transition font-medium">
              <Phone size={18} className="mr-2" /> {global.phone || '+91 98765 43210'}
            </a>
            <a href={`mailto:${global.email}`} className="flex items-center hover:text-gray-300 transition font-medium">
              <Mail size={18} className="mr-2" /> {global.email || 'info@pkproperties.com'}
            </a>
          </div>
        </div>

        {/* Disclaimer / Intro */}
        <div className="mb-12">
          <p className="text-xs text-blue-200 leading-relaxed max-w-4xl uppercase font-semibold tracking-wider">
            PK Properties is a premier luxury real estate developer committed to creating architectural marvels. 
            All images, floor plans, and amenities shown are artist's impressions and are subject to change. 
            Please refer to the official RERA website for complete project details and approvals.
          </p>
          <p className="text-sm font-bold text-white mt-4 uppercase">
            TGRERA No: P02400010916
          </p>
          <p className="text-xs text-blue-200 mt-2 font-medium">
            TGRERA Website: <a href="http://rerait.telangana.gov.in" className="hover:underline">http://rerait.telangana.gov.in</a>
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16 relative">
          
          <div>
            <h4 className="font-bold mb-6 text-white text-sm tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-3 text-xs text-blue-100">
              <li><a href="#overview" className="hover:text-white transition">The Developer</a></li>
              <li><a href="#overview" className="hover:text-white transition">About PK Properties</a></li>
              <li><a href="#overview" className="hover:text-white transition">Media</a></li>
              <li><a href="#overview" className="hover:text-white transition">Awards</a></li>
              <li><a href="#overview" className="hover:text-white transition">Sitemap</a></li>
              <li><a href="#overview" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white text-sm tracking-wide">PROJECT INFO</h4>
            <ul className="space-y-3 text-xs text-blue-100">
              <li><a href="#overview" className="hover:text-white transition">Project Overview</a></li>
              <li><a href="#amenities" className="hover:text-white transition">Amenities</a></li>
              <li><a href="#plans" className="hover:text-white transition">Floor Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-sm tracking-wide">IMPORTANT LINKS</h4>
            <ul className="space-y-3 text-xs text-blue-100">
              <li><a href="#faqs" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#faqs" className="hover:text-white transition">T&C</a></li>
              <li><a href="#faqs" className="hover:text-white transition">Disclaimer</a></li>
              <li><a href="#faqs" className="hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#faqs" className="hover:text-white transition">RERA Details</a></li>
              <li><a href="#faqs" className="hover:text-white transition">Property Management</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold mb-6 text-white text-sm tracking-wide">FOLLOW US ON</h4>
            <div className="flex space-x-3 mb-8">
              <a href={global.socials?.instagram || '#'} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition text-white text-xs font-bold">
                IG
              </a>
              <a href={global.socials?.facebook || '#'} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition text-white text-xs font-bold">
                FB
              </a>
              <a href={global.socials?.twitter || '#'} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition text-white text-xs font-bold">
                TW
              </a>
              <a href={global.socials?.linkedin || '#'} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition text-white text-xs font-bold">
                IN
              </a>
            </div>
            
            <h4 className="font-bold mb-6 text-white text-sm tracking-wide mt-8">CONTACT US</h4>
            <p className="text-xs text-blue-100 leading-relaxed max-w-sm">
              {global.address || 'Neopolis, Kokapet, Hyderabad'}
            </p>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-white/20 text-xs text-blue-200">
          <p>Any reproduction of this website in whole or in part without the prior written permission of PK PROPERTIES is prohibited.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} PK PROPERTIES. All rights reserved.</p>
        </div>

      </div>

      {/* Decorative Silhouette */}
      <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none z-0">
         <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 300 V 200 H 200 V 100 H 250 V 50 H 300 V 150 H 350 V 300 Z" stroke="white" strokeWidth="2" fill="none" />
            <path d="M100 300 V 250 H 150 M200 200 H 150 M250 100 H 200 M300 50 H 250 M350 150 H 300 M400 300 H 350" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
            <rect x="220" y="120" width="10" height="20" fill="white" />
            <rect x="220" y="160" width="10" height="20" fill="white" />
            <rect x="270" y="70" width="10" height="20" fill="white" />
            <rect x="270" y="110" width="10" height="20" fill="white" />
         </svg>
      </div>

    </footer>
  );
};

export default Footer;
