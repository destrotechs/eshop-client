// FeaturedProducts.jsx
import React,{useEffect,useState} from 'react';
import apiClient from '../auth/apiClient';
import ProductCard from '../pages/productCard';
import Slider from 'react-slick';
import FormattedPrice from '../assets/formatedprice';
const featuredp = [
  { name: 'Product 1', image: '/path/to/product1.jpg', price: '$49.99' },
  { name: 'Product 2', image: '/path/to/product2.jpg', price: '$69.99' },
  { name: 'Product 3', image: '/path/to/product3.jpg', price: '$89.99' },
];

const FeaturedProducts = () => {
  const settings = { dots: true, infinite: true, slidesToShow: 3, slidesToScroll: 1 };
  const [featuredProducts, setFeaturedProducts] = useState(featuredp);

  const fetchFeaturedProducts = async () => {
    const response = await apiClient.get('/api/products/featured/all');
    console.log('Featured', response);
    if (response.status === 200) {
      // Handle featured products
      if (response.data.data){
          setFeaturedProducts(response.data.data);
      }
    }
  };
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  return (
    <section className="py-16">
      <h2 className="text-3xl font-semibold text-center mb-8">Featured Products</h2>
      <Slider {...settings}>
        {featuredProducts.map((product) => (
          <div key={product.name} className="p-4">
            <div className="bg-white shadow-lg rounded-md overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600"><FormattedPrice price={product.price}/></p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedProducts;
