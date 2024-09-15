import React from 'react';
import { useLocation } from 'react-router-dom';
import FormattedPrice from '../assets/formatedprice';

const Payment = () => {
  const location = useLocation();
  const { order, selectedPaymentMode } = location.state; // Extract the order and payment mode

  return (
    <div>
      <h2 className="text-2xl font-medium mb-4">Payment for Order #{order.order_number}</h2>
      <p>
        Total: <FormattedPrice price={order.total_cost} />
      </p>
      <p>Selected Payment Mode: {selectedPaymentMode}</p>

      {/* Implement payment processing logic here */}
    </div>
  );
};

export default Payment;
