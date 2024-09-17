import React, { useState, useEffect, useRef } from 'react';
import Order from '../components/Order';
import apiClient from '../auth/apiClient';
import Toast from '../assets/Toast';
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import Loader from './Loader';
import Breadcrumb from '../assets/breadCrump';
const OrderList = ({ orders = [], showAll = true ,showBreadcrumb=true}) => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [orderList, setOrderList] = useState([]);
  const ordersRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleToggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleOpenReviewModal = (item) => {
    setSelectedItem(item);
    setReviewModalOpen(true);
  };
  const breadcrumbPaths = [
    { label: 'Home', href: '/' },
    { label: 'Account', href: '/account' },
    { label: 'Orders' }
  ];

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
        console.log('Review submitted:', response.data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }

    handleCloseReviewModal();
  };

  const handlePay = async (order) => {
    try {
      navigate('/order/payment/', {
        state: {
          order,
          selectedPaymentMode: order.payment_mode,
        },
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      setToastMessage('Error processing payment.');
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (orders && orders.length > 0) {
      setOrderList(orders);
    }
    fetchOrders();
  }, [orders]);

  const fetchOrders = async () => {
    const response = await apiClient.get('/api/orders');
    if (response.status === 200 && showAll) {
      setOrderList(response.data.data);
      setLoading(false);
    }
  };

  return (
    <div ref={ordersRef}>
      <section className="max-w-7xl mx-auto py-1 sm:px-6 lg:px-8">
     {showBreadcrumb && <Breadcrumb paths={breadcrumbPaths} />}
      {loading ? (
        <Loader />
      ) : (
        <div>
         <h4 className="text-1xl font-medium text-gray-600 mb-6">My Orders</h4>
          {orderList.length > 0 ? (
            <ul className="space-y-4">
              {orderList.map((order) => (
                <Order
                  key={order.id}
                  order={order}
                  expandedOrderId={expandedOrderId}
                  handleToggleExpand={handleToggleExpand}
                  handleOpenReviewModal={handleOpenReviewModal}
                  handlePay={handlePay}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No orders available.</p>
          )}

          {reviewModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  Add Review for {selectedItem?.product.name}
                </h3>
                <div className="mb-4">
                  <StarRatings
                    rating={rating}
                    starRatedColor="gold"
                    changeRating={(newRating) => setRating(newRating)}
                    numberOfStars={5}
                    name="rating"
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
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
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
        </div>
      )}
      </section>
    </div>
  );
};

export default OrderList;
