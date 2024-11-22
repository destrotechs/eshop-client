// HeroSection.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-center" style={{ backgroundImage: 'url(/path/to/hero-image.jpg)' }}>
      <div className="bg-primary bg-opacity-100 p-8 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold text-white">Discover the Latest Trends</h1>
        <p className="text-lg text-gray-300 mt-4">Shop our collection of fashion, electronics, and more</p>
        <Link to="/shop">
        <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          Shop Now
        </button>
        </Link>
        
      </div>
    </section>
  );
};

export default HeroSection;
