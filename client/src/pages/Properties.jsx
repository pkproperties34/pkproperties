import React from 'react';

const Properties = () => {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto bg-white p-10 rounded-sm shadow-xl border-t-4 border-accent">
        <h2 className="text-4xl font-serif text-primary mb-4">Properties</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The property search engine is currently being optimized for a premium experience. 
          It will allow you to filter through our extensive catalog of luxury properties.
        </p>
        <button className="bg-primary text-white px-8 py-3 font-medium hover:bg-gray-800 transition">
          Return Home
        </button>
      </div>
    </div>
  );
};

export default Properties;
