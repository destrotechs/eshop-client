import React, { useState } from 'react';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../auth/apiClient';
import FormattedPrice from '../assets/formatedprice';
import { toSentenceCase } from '../assets/textUtil';
import Toast from '../assets/Toast';
import { eventEmitter } from '../assets/EventEmitter';
import { useWishlist } from '../assets/WishlistContext'; // Import WishlistContext

const ProductCard = ({ product }) => {
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState({ items: {}, subtotal: 0, total: 0, tax: 0, discount: 0 });

    const { fetchWishlist } = useWishlist(); // Use WishlistContext

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const imageUrl = product.images && product.images.length > 0
        ? `${apiClient.defaults.baseURL}${product.images[0].img_url.replace(/^\//, '')}`
        : '/path/to/placeholder-image.jpg';

    const handleAddToCart = async (product) => {
        // await apiClient.get('/sanctum/csrf-cookie');
        const response = await apiClient.post('/api/shopping/cart/', { 'product_id': product.id });
        if (response.status === 200) {
            const updatedCart = response.data.data;
            setCart(updatedCart);

            // Emit cart update event
            eventEmitter.emit('cartUpdated', updatedCart);
            setToastMessage(response.data.message);
            setShowToast(true);
        } else {
            setToastMessage('Failed to add item to cart.');
            setShowToast(true);
        }
    };
    
    const handleAddToWishlist = async (product) => {
        // await apiClient.get('/sanctum/csrf-cookie');
        const response = await apiClient.post('/api/shopping/wishlist/', { 'product_id': product.id });
        if (response.status === 200) {
            // eventEmitter.emit('wishlistUpdated', updatedCart);
            // Fetch updated wishlist
            await fetchWishlist();
            setToastMessage(response.data.message);
            setShowToast(true);
        } 
        if (response.status === 204) {
            setToastMessage(response.data.message);
            setShowToast(true);
            }
    };

    const handleExpandDescription = () => {
        setExpanded(!expanded);
    };

    const truncateDescription = (description, maxLength) => {
        if (description.length <= maxLength) {
            return description;
        }
        return expanded ? description : `${description.slice(0, maxLength)}...`;
    };

    return (
        <>
            <div className="bg-white shadow-sm rounded-lg pb-4  w-60 mb-3 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <Link to={`/product/${product.id}`} className="block">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                    />
                </Link>
                <div className="mt-4 pl-3 pr-3">
                    <h4 className="text-xl font-bold">{toSentenceCase(product.name)}</h4>
                    <p className="text-gray-700 mt-2">
                        {truncateDescription(toSentenceCase(product.description), 40)}
                        {product.description.length > 40 && (
                            <span
                                className="text-blue-500 cursor-pointer ml-1"
                                onClick={handleExpandDescription}
                            >
                                {expanded ? ' Show less' : ' ...more'}
                            </span>
                        )}
                    </p>
                    <p className="text-lg font-semibold mt-4"><FormattedPrice price={product.price} /></p>
                </div>
                <div className="flex justify-between mt-4 pl-3 pr-3">
                    <button
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={() => handleAddToCart(product)}
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                    </button>
                    <button
                        className="p-2 rounded-full text-orange-500 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        onClick={() => handleAddToWishlist(product)}
                    >
                        <HeartIcon className="w-6 h-6" />
                    </button>
                    <button
                        className="p-2 rounded-full text-yellow-400 hover:bg-yellow-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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

// Placeholder function for viewing reviews
const handleViewReviews = (product) => {
    console.log('View reviews for:', product);
};

export default ProductCard;
