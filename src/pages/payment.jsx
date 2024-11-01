import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import FormattedPrice from '../assets/formatedprice';
import apiClient from '../auth/apiClient';
import Toast from '../assets/Toast';
import Loader from '../assets/Loader';
import Order from '../components/Order'; // Import the Order component
import { useNavigate } from 'react-router-dom';
// Load Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key');

const PaymentForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  const { order, message, showtoast } = location.state; // Extract the order details from location state
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(showtoast);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [phone_number, setPhoneNumber] = useState(null);
  const [toastmessage, setMessage] = useState(null);
  const[toasttype, setToastType] = useState('success');
  const formatAmount = (amount) => {
    // Convert amount to a number first, in case it was passed as a string
    amount = Number(amount);
    
    // Return as integer if there's no decimal part, otherwise as a float with two decimals
    return parseInt(amount);
};
  const handleToggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  const handlePhoneNumberChange = (e)=>{
    setPhoneNumber(e.target.value)
  }
console.log("ORDER: " + order.total_cost);
console.log("ORDER: " + order.payment_mode.payment_mode_name);
  const handleProcessPayment = async () => {
    setLoading(true);
    if (order.payment_mode.payment_mode=='VISA CARD') {
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
    }else if (order.payment_mode.payment_mode_name === 'MPESA') {
      console.log("Payment happening...");
    
      try {
        const response = await apiClient.post('/api/pay-via-mpesa', {
          'amount': formatAmount(order.total_cost),
          'phone_number': phone_number,
          'orderID': order.id,
          'payment_mode_id': order.payment_mode.id,
        });
    
        console.log("Payment Response ", response);
    
        if (response.status === 200) {
          setMessage(response.data.message);
          setToastType('success');
          const redirectPath = '/orders'; 
          const timer = setTimeout(() => {
              navigate(redirectPath); // Redirect to the specified path
          }, 5000);
              
        } else {
          setMessage("Payment was not successful. Please try again.");
        }
      } catch (error) {
        console.error("Payment Error: ", error);
    
        // Check if error response exists and has a message, fallback to generic error message
        const errorMessage = error.response && error.response.data && error.response.data.message 
          ? error.response.data.message 
          : "An error occurred while processing the payment. Please try again.";
    
        setMessage(errorMessage);
        setToastType('error');
      } finally {
        setLoading(false);
        setShowToast(true);
      }
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
            {order.payment_mode.payment_mode_name=='VISA CARD'? (<CardElement className="border p-3 rounded-md mt-5 mb-4" />): (
              <div className="flex mt-4">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 border border-e-0 rounded-s-md">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
              </span>
              <input type="text" onChange={handlePhoneNumberChange} className="rounded-none rounded-e-lg border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 " placeholder="Phone Number"/>
            </div>
            )}

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
            message={toastmessage?toastmessage:message}
            show={showToast}
            onClose={() => setShowToast(false)}
            type={toasttype}
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
