// HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-center" style={{ backgroundImage: 'url(/path/to/hero-image.jpg)' }}>
      <div className="bg-black bg-opacity-50 p-8 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold text-white">Discover the Latest Trends</h1>
        <p className="text-lg text-gray-300 mt-4">Shop our collection of fashion, electronics, and more</p>
        <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
