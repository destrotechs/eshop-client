import React,{useState,useEffect} from 'react';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import apiClient from '../auth/apiClient';
import FormattedPrice from '../assets/formatedprice';
import { toSentenceCase } from '../assets/textUtil';
import Toast from '../assets/Toast';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product }) => {
console.log(apiClient?.baseURL)
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
      // Redirect to the Product Overview page with the product ID
      navigate(`/product/${productId}`);
    };

const imageUrl = product.images && product.images.length > 0
? `${apiClient.defaults.baseURL}${product.images[0].img_url.replace(/^\//, '')}`
: '/path/to/placeholder-image.jpg';


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



    return (
      <>
        <div className="bg-white shadow-lg rounded-lg p-6 w-80 mb-4 transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
           <Link to={`/product/${product.id}`} className="block">
            <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-60 object-cover rounded-t-lg"
            />
            </Link>
            <h2 className="text-2xl font-bold mt-4">{toSentenceCase(product.name)}</h2>
            <p className="text-gray-700 mt-2">{toSentenceCase(product.description)}</p>
            <p className="text-lg font-semibold mt-4"><FormattedPrice price={product.price}/></p>

            <div className="flex justify-between mt-4">
                <button
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => handleAddToCart(product)}
                >
                    <ShoppingCartIcon className="w-6 h-6" />
                </button>
                <button
                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    onClick={() => handleAddToWishlist(product)}
                >
                    <HeartIcon className="w-6 h-6" />
                </button>
                <button
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    onClick={() => handleViewReviews(product)}
                >
                    <StarIcon className="w-6 h-6" />
                </button>
            </div>
            
        </div>
        <Toast
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
        
    );
};

// Placeholder functions for button actions


const handleAddToWishlist = (product) => {
    // Implement add to wishlist functionality
    console.log('Added to wishlist:', product);
};

const handleViewReviews = (product) => {
    // Implement view reviews functionality
    console.log('View reviews for:', product);
};

export default ProductCard;
