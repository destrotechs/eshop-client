import React, { useState, useRef, useEffect } from 'react';
import FormattedPrice from '../assets/formatedprice';
import apiClient from '../auth/apiClient';
import { toSentenceCase } from '../assets/textUtil';
import StarRatings from 'react-star-ratings';

const OrderList = ({ orders = [] }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const ordersRef = useRef(null);
  const [orderList, setOrderList] = useState([]);

  const handleToggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleOpenReviewModal = (item) => {
    setSelectedItem(item);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedItem(null);
    setRating(0);
    setReviewText('');
  };

  const handleSubmitReview = async () => {
    if (!selectedItem) return;

    const reviewData = {
      product_id: selectedItem.product.id,
      orderId: selectedItem.order_id,
      rating,
      review: reviewText,
    };

    try {
      const response = await apiClient.post('/api/review/add', reviewData);
      if (response.status === 200) {
        // Handle success, e.g., update UI, show notification
        console.log('Review submitted:', response.data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }

    handleCloseReviewModal();
  };

  useEffect(() => {
    if (orders && orders.length > 0) {
      setOrderList(orders);
    }
    fetchOrders();
  }, [orders]);

  const fetchOrders = async () => {
    const response = await apiClient.get('/api/orders');
    if (response.status === 200) {
      setOrderList(response.data.data);
    }
  };

  // Function to safely parse JSON items
  const parseItems = (items) => {
    try {
      const parsedItems = JSON.parse(items[0]['items']);
      return parsedItems;
    } catch (error) {
      console.error("Error parsing items:", error);
      return {};
    }
  };

  return (
    <div ref={ordersRef} className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">Orders</h2>
      {orderList?.length > 0 ? (
        <ul className="space-y-6">
          {orderList?.map((order) => (
            <li
              key={order.id}
              className="relative p-6 border rounded-lg shadow-sm hover:bg-gray-50"
              onClick={() => handleToggleExpand(order.id)}
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-900 font-semibold">
                  {`Order #${order.order_number} - Status: ${order.status}`}
                </p>
                <p className="text-gray-600">
                  {order.shipping_address?.shipping_address}
                </p>
              </div>

              {/* Expanded order details */}
              {expandedOrderId === order.id && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Ordered Items
                  </h3>
                  <ul className="space-y-4">
                    {/* Parse and render items */}
                    {Object.entries(parseItems(order.items)).map(([key, item]) => (
                      <li
                        key={key}
                        className="flex items-center justify-between py-3 border-b last:border-none border-gray-300"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.product.images && item.product.images.length > 0
                              ? `${apiClient.defaults.baseURL}${item.product.images[0].img_url.replace(/^\//, '')}`
                              : '/path/to/placeholder-image.jpg'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-gray-900 font-medium">
                              {toSentenceCase(item.product.name)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} x <FormattedPrice price={item.price} />
                            </p>
                          </div>
                        </div>
                        <div className="text-gray-900 font-medium">
                          <FormattedPrice price={item.total} />
                        </div>
                        {order.status === 'Created' && (
                          <button
                            onClick={() => handleOpenReviewModal(item)}
                            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                          >
                            Add Review
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="text-right mt-6">
                    <span className="text-xl font-semibold text-gray-900">
                      Total: <FormattedPrice price={order.total_cost || 0} />
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No orders available.</p>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Review for {selectedItem?.product.name}</h3>
            <div className="mb-4">
              <StarRatings
                rating={rating}
                starRatedColor="gold"
                changeRating={(newRating) => setRating(newRating)}
                numberOfStars={5}
                name='rating'
                starDimension="22px"
                starSpacing="2px"
              />
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-4 border border-gray-300 rounded mb-4"
              rows={10}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseReviewModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
