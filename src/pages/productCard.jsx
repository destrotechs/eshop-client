import React, { useState } from 'react';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../auth/apiClient';
import FormattedPrice from '../assets/formatedprice';
import { toSentenceCase } from '../assets/textUtil';
import Toast from '../assets/Toast';
import { eventEmitter } from '../assets/EventEmitter';
import { useWishlist } from '../assets/WishlistContext';
import OutputContent from '../assets/product_description';
const ProductCard = ({ product, isFeatured = false }) => {
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const navigate = useNavigate();
    const { fetchWishlist } = useWishlist();

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const imageUrl = product.images && product.images.length > 0
        ? `${apiClient.defaults.baseURL}${product.images[0].img_url.replace(/^\//, '')}`
        : '/path/to/placeholder-image.jpg';

    const handleAddToCart = async (product) => {
        const response = await apiClient.post('/api/shopping/cart/', { 'product_id': product.id });
        if (response.status === 200) {
            // Emit an event to update the cart item count
            eventEmitter.emit('cartUpdated');
            setToastMessage(response.data.message);
            setShowToast(true);
        } else {
            setToastMessage('Failed to add item to cart.');
            setShowToast(true);
        }
    };

    const handleAddToWishlist = async (product) => {
        const response = await apiClient.post('/api/shopping/wishlist/', { 'product_id': product.id });
        if (response.status === 200) {
            await fetchWishlist();
            setToastMessage(response.data.message);
            setShowToast(true);
        }
    };

    const handleExpandDescription = () => {
        setExpanded(!expanded);
    };

    const truncateDescription = (description, maxLength) => {
        return description.length <= maxLength ? description : expanded ? description : `${description.slice(0, maxLength)}...`;
    };

    const handleOpenRatingModal = () => {
        setShowRatingModal(true);
    };

    const handleCloseRatingModal = () => {
        setShowRatingModal(false);
        setRating(0);
        setReview('');
    };

    const handleSubmitReview = async () => {
        try {
            const response = await apiClient.post('/api/review/add', {
                product_id: product.id,
                rating,
                review,
            });
            if (response.status === 200) {
                setToastMessage('Review submitted successfully.');
            } else {
                setToastMessage('Failed to submit review.');
            }
        } catch (error) {
            setToastMessage('An error occurred while submitting the review.');
        } finally {
            setShowRatingModal(false);
            setShowToast(true);
            setRating(0);
            setReview('');
        }
    };

    const isOutOfStock = product.stock === 0;
    const stockRemaining = product.stock <= 5 && product.stock > 0 ? `Only ${product.stock} left!` : null;
    const discountedPrice = (1-product.discount/100)*product.price;

    return (
        <>
            <div
  className={`bg-white shadow-sm rounded-lg pb-4 
              ${!isFeatured ? 'w-full sm:w-60 max-w-sm' : 'w-full sm:w-80 max-w-md'} 
              mb-3 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg relative`}
>
  <Link to={`/product/${product.id}`} className="block">
    <img
      src={imageUrl}
      alt={product.name}
      className="w-full h-40 object-cover rounded-t-lg"
    />
  </Link>
  {/* Floating Discount */}
  {product.discount > 0 && (
    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 text-sm rounded-full">
      {parseInt(product.discount)}% OFF
    </div>
  )}

  <div className="mt-4 pl-3 pr-3">
    <h4 className="text-xl font-bold">{toSentenceCase(product.name)}</h4>
    <p className="text-gray-700 mt-2">
    <OutputContent htmlContent={truncateDescription(toSentenceCase(product.description), 40)}/>
      {product.description.length > 40 && (
        <span
          className="text-blue-500 cursor-pointer ml-1"
          onClick={handleExpandDescription}
        >
          {expanded ? ' Show less' : ' ...more'}
        </span>
      )}
    </p>
    <p className="text-lg font-semibold mt-4">
      <FormattedPrice price={parseInt(discountedPrice)} />&nbsp;
      {product.discount && (
        <FormattedPrice price={parseInt(product.price)} crossed={true} />
      )}
    </p>

    {/* Stock Availability */}
    {isOutOfStock ? (
      <p className="text-red-500 font-semibold mt-2">Out of Stock</p>
    ) : stockRemaining ? (
      <p className="text-yellow-600 font-semibold mt-2">{stockRemaining}</p>
    ) : null}
  </div>

  {!isOutOfStock && (
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
        onClick={handleOpenRatingModal}
      >
        <StarIcon className="w-6 h-6" />
      </button>
    </div>
  )}
</div>


            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
                        <h3 className="text-2xl font-bold mb-4">Rate & Review</h3>
                        <div className="mb-4">
                            <label className="text-lg font-semibold">Rating:</label>
                            <div className="flex space-x-2 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={`w-8 h-8 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-lg font-semibold">Review:</label>
                            <textarea
                                className="w-full mt-2 p-2 border rounded-lg"
                                rows="4"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={handleCloseRatingModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={handleSubmitReview}
                                disabled={rating === 0 || !review.trim()}
                            >
                                Submit
                            </button>
                        </div>
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

export default ProductCard;
