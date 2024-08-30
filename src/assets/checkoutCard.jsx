import React, { useState } from 'react';
import { useCart } from './CartContext'; // Adjust the import path as necessary
import ShoppingCart from '../components/cartComponent';
import FormattedPrice from "../assets/formatedprice";
import { Transition, Disclosure } from '@headlessui/react';

const CheckoutCard = ({ addresses = [], paymentMethods = [] }) => {
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
          <h2 className="text-1xl font-semibold mb-4 flex items-center">
            <svg className="mr-2 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 12h.01M12 16h.01M12 8h.01M5 7h14M5 17h14" />
            </svg>
            Shipping Address
          </h2>
          <div className="mb-4">
            <div className="space-y-3 mb-4">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105">
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
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter new shipping address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center">
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Add New Address
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <Disclosure as="div" className="bg-white rounded-lg shadow-md p-6">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between w-full text-1xl font-semibold mb-4">
                <span className="flex items-center">
                  <svg className="mr-2 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M12 3v18" />
                  </svg>
                  Payment Method
                </span>
                <span className="text-gray-500">{open ? '−' : '+'}</span>
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Disclosure.Panel>
                  <div className="space-y-3 mb-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105">
                        <input
                          type="radio"
                          id={`payment-${method.id}`}
                          name="paymentMethod"
                          value={method.payment_mode_name}
                          checked={selectedPaymentMethod === method.payment_mode_name}
                          onChange={handlePaymentMethodChange}
                          className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`payment-${method.id}`} className="text-gray-700 flex items-center space-x-2">
                          {method.payment_mode_name === 'Credit Card' && (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16m-6 4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6z" />
                            </svg>
                          )}
                          {method.payment_mode_name === 'PayPal' && (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10l5 5 5-5-5-5-5 5z" />
                            </svg>
                          )}
                          {method.payment_mode_name === 'Bank Transfer' && (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14" />
                            </svg>
                          )}
                          <span>{method.payment_mode_name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>

        {/* Cart Items Section */}
        <ShoppingCart title="Order Items" showSubtotalSection={false} />
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-5/12 bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-1xl font-semibold mb-4 flex items-center">
          <svg className="mr-2 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Order Summary
        </h2>
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

export default CheckoutCard;
