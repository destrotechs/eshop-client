// FeaturedProducts.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../auth/apiClient';
import ProductCard from '../pages/productCard';
import Slider from 'react-slick';

const FeaturedProducts = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768, // Medium screens
        settings: {
          slidesToShow: 1, // Show 2 slides
        },
      },
      {
        breakpoint: 1024, // Large screens
        settings: {
          slidesToShow: 3, // Show 3 slides
        },
      },
    ],
  };
  
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const response = await apiClient.get('/api/products/featured/all');
      if (response.status === 200 && response.data.data) {
        setFeaturedProducts(response.data.data);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-semibold text-center mb-8">Featured Products</h2>
      <Slider {...settings}>
        {featuredProducts?.map((product) => (
          <div 
            key={product.id} 
            className="p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:gap-4 gap-1"
          >
            <ProductCard product={product} isFeatured={true} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedProducts;
