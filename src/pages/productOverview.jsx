import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import { useParams } from 'react-router-dom';
import apiClient from '../auth/apiClient';
import FormattedPrice from '../assets/formatedprice';
import { toSentenceCase } from '../assets/textUtil';
import Breadcrumb from '../assets/breadCrump';
import Toast from '../assets/Toast';
import ProductCard from './productCard';
const ProductOverview = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [similar_products, setSimilarProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isViewerOpen, setIsViewerOpen] = useState(false); // State for image viewer
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // State for the selected image index
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/api/products/${productId}`);
        if (response.status === 200) {
          setProduct(response.data.data.product);
          setSimilarProduct(response.data.data.similar_products);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const openViewer = (index) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = async(product) => {
    // Implement add to cart functionality
    const response = await apiClient.post('/api/shopping/cart/',{'product_id':product.id});
    if (response.status===200){
            setToastMessage(response.data.message);
            setShowToast(true);
            console.log("Add to cart ",response.data);
            console.log('Added to cart:', product);
    }else{
        setToastMessage('Failed to add item to cart.');
            setShowToast(true);
    }
    
};

  const sliderSettings = {
    dots: true,
    infinite: product.images && product.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    pauseOnDotsHover: true,
  };

  const breadcrumbPaths = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'View Product' },
  ];

  return (
    <>
      <Breadcrumb paths={breadcrumbPaths} />
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image Slider */}
            <div className="flex justify-center">
              <Slider {...sliderSettings} className="w-full max-w-md">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, idx) => {
                    const imageUrl = `${apiClient.defaults.baseURL}${image.img_url.replace(/^\//, '')}`;
                    return (
                      <div key={idx} className="flex justify-center">
                        <img
                          src={imageUrl}
                          alt={`Product Image ${idx + 1}`}
                          className="rounded-lg shadow-lg object-cover w-full h-64 sm:h-72 md:h-80 lg:h-96 cursor-pointer"
                          onClick={() => openViewer(idx)} // Open viewer on click, passing index
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center">
                    <img
                      src="/path/to/placeholder-image.jpg"
                      alt="Placeholder"
                      className="rounded-lg shadow-lg object-cover w-full h-64 sm:h-72 md:h-80 lg:h-96"
                    />
                  </div>
                )}
              </Slider>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-gray-900">{toSentenceCase(product.name)}</h2>
              <p className="text-gray-500 text-lg my-4">{product.description}</p>

              <div className="flex items-center my-4">
                <span className="text-2xl font-bold text-indigo-600">
                  <FormattedPrice price={product.price} />
                </span>
                {product.discount && (
                  <span className="text-sm line-through text-gray-400 ml-3">${product.originalPrice}</span>
                )}
              </div>

              {/* Ratings */}
              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  {Array.from({ length: product.ratings }).map((_, idx) => (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-yellow-400"
                    >
                      <path d="M12 18l-6.473 3.6 1.236-7.2L1 8.4l7.264-1.05L12 1l3.736 6.35L23 8.4l-5.763 6 1.236 7.2z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-500">{product.reviewsCount ?? 0} Reviews</span>
              </div>

              {/* Add to Cart */}
              <div className="mt-6 flex items-center space-x-3">
                <button onClick={() => handleAddToCart(product)} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700">
                  Add to Cart
                </button>
                <button className="bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {similar_products?.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h4 className="font-medium text-white bg-[#0369a1] rounded-t-lg p-4 text-center text-lg">
              Similar Products
            </h4>
            <div className="flex flex-wrap gap-8 mt-6">
              {similar_products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      
      {/* Image Viewer Modal */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black p-2 rounded-full hover:bg-gray-200 z-10"
            >
              &#8249;
            </button>
            <img
              src={`${apiClient.defaults.baseURL}${product.images[selectedImageIndex].img_url.replace(/^\//, '')}`}
              alt={`Selected Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full rounded-lg"
            />
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black p-2 rounded-full hover:bg-gray-200 z-10"
            >
              &#8250;
            </button>
            <button
              onClick={closeViewer}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full hover:bg-gray-200"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <Toast
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
    </>
  );
};

export default ProductOverview;
