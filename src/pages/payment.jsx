import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import FormattedPrice from '../assets/formatedprice';
import apiClient from '../auth/apiClient';
import Toast from '../assets/Toast';
import Loader from '../assets/Loader';
import Order from '../components/Order'; // Import the Order component

// Load Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  const { order, message, showtoast } = location.state; // Extract the order details from location state
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(showtoast);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleToggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
console.log("ORDER: " + order.total_cost);
  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      // Create Payment Intent on the backend
      const response = await apiClient.post('/api/create-payment-intent', {
        amount: order.total_cost * 100, // Stripe expects the amount in cents
      });

      const { clientSecret } = response.data;

      // Confirm the payment using Stripe's confirmCardPayment method
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.error('Payment error:', error);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        // Handle post-payment actions (e.g., show success message, update order status)
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto p-2">
          <div className="bg-white shadow-md overflow-hidden p-4">
            {/* Card Header */}
            <div className="text-black font-bold p-4">
              <h2 className="text-2xl font-semibold">Order Payment</h2>
            </div>

            {/* Order Component */}
            <Order
              key={order.id}
              order={order}
              expandedOrderId={expandedOrderId}
              handleToggleExpand={handleToggleExpand}
              showPay={false} // Don't show payment option in Order component since it's handled here
            />

            {/* Stripe Card Element for capturing payment details */}
            <CardElement className="border p-3 rounded-md mt-5 mb-4" />

            {/* Payment Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleProcessPayment}
            >
              Pay {<FormattedPrice price={order?.total_cost} />}
            </button>
          </div>

          {/* Toast Notification */}
          <Toast
            message={message}
            show={showToast}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </>
  );
};

// Wrap the PaymentForm with the Elements provider for Stripe context
const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
