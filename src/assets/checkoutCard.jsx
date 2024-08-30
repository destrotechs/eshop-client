import React, { useState } from 'react';
import { useCart } from './CartContext'; // Adjust the import path as necessary
import ShoppingCart from '../components/cartComponent';
import FormattedPrice from "../assets/formatedprice";

const CheckoutPage = ({ addresses = [],paymentMethods={} }) => {
  const { cart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  return (
    <div className="flex flex-wrap p-6 bg-gray-100">
      {/* Left Column */}
      <div className="w-full lg:w-7/12 lg:pr-6 space-y-6">
        {/* Shipping Address Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          <div className="mb-4">
            <div className="space-y-3 mb-4">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                  <input
                    type="radio"
                    id={`address-${address.id}`}
                    name="shippingAddress"
                    value={address.shipping_address}
                    checked={selectedAddress === address.shipping_address}
                    onChange={handleAddressChange}
                    className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`address-${address.id}`} className="text-gray-700">
                    {address.shipping_address}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter new shipping address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                Add New Address
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
          <div className="mb-4">
          <div className="space-y-3 mb-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                <input
                  type="radio"
                  id={`payment-${method.id}`}
                  name="paymentMethod"
                  value={method.payment_mode_name}
                  checked={selectedPaymentMethod === method.payment_mode_name}
                  onChange={handlePaymentMethodChange}
                  className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`payment-${method.id}`} className="text-gray-700">
                  {method.payment_mode_name}
                </label>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Cart Items Section */}
        <ShoppingCart title="Order Items" showSubtotalSection={false} />
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-5/12 bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Subtotal</span>
            <span><FormattedPrice price={cart.subtotal} /></span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Discount</span>
            <span><FormattedPrice price={cart.discount} /></span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Tax</span>
            <span><FormattedPrice price={cart.tax} /></span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Shipping Cost</span>
            <span><FormattedPrice price={cart.shippingCost} /></span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-4">
            <span>Total</span>
            <span><FormattedPrice price={cart.total} /></span>
          </div>
          <button className="mt-4 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
