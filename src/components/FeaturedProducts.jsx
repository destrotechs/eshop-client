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
          <div key={product.id} className="p-4">
            <ProductCard product={product} isFeatured={true} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedProducts;
