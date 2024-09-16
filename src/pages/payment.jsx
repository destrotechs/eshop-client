import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormattedPrice from '../assets/formatedprice';
import apiClient from '../auth/apiClient';
import { toSentenceCase } from '../assets/textUtil';
import Order from '../components/Order';

const Payment = () => {
  const location = useLocation();
  const { order, selectedPaymentMode } = location.state; // Extract the order and payment mode
  const [details, setDetails] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({}); // State to hold payment details inputs
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  useEffect(() => {
    fetchPaymentModeDetails();
  }, [selectedPaymentMode]);

  const fetchPaymentModeDetails = async () => {
    try {
      const response = await apiClient.get(`/api/paymentmodes/details/${selectedPaymentMode}`);
      if (response.status === 200) {
        setDetails(response.data.data.payment_mode_details);
      }
    } catch (error) {
      console.error('Error fetching payment mode details:', error);
    }
  };
  const handleToggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Handle change for dynamic inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  function createLetterWord(str) {
    // Split the string by underscores
    const words = str.split('_');
    
    // Extract the first letter of each word and join them
    const letterWord = words.map(word => word.toUpperCase()).join(' ');
    
    return letterWord;
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      {/* Payment Card */}
      <div className="bg-white shadow-md overflow-hidden p-4">
        {/* Card Header */}
        <div className="text-black font-bold p-4">
          <h2 className="text-2xl font-semibold">Order Payment</h2>
        </div>
        <Order
          key={order.id}
          order={order}
          expandedOrderId={expandedOrderId}
          handleToggleExpand={handleToggleExpand}
          showPay={false}
        />
        {/* Card Body */}
        <div className="p-3">
          

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Payment Details</h3>
            {details.length > 0 ? (
              details.map((detail, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-600 text-lg">{toSentenceCase(createLetterWord(detail))}</label>
                  <input
                    type={detail.type === 'date' ? 'date' : 'text'}
                    id={detail}
                    name={detail}
                    value={paymentDetails[detail] || ''} // Track the input value in state
                    onChange={handleChange}
                    placeholder={toSentenceCase(createLetterWord(detail))}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No payment details available.</p>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-100 p-4 flex justify-end">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => alert(JSON.stringify(paymentDetails, null, 2))} // Alert the payment details for demonstration
          >
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
