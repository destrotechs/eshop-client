import React, { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import FormattedPrice from "../assets/formatedprice";

// Sample dummy data
const defaultCartItems = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    quantity: 2,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Product 2",
    price: 29.99,
    quantity: 1,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "Product 3",
    price: 9.99,
    quantity: 3,
    imageUrl: "https://via.placeholder.com/150"
  }
];

const ShoppingCart = ({ cartItems = defaultCartItems, onUpdateQuantity, onRemoveItem }) => {
  const [items, setItems] = useState(cartItems);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(0.07); // 7% tax rate

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const handleQuantityChange = (itemId, change) => {
    onUpdateQuantity(itemId, change);
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + change } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleCouponApply = () => {
    // Simulate coupon application
    if (couponCode === "DISCOUNT10") {
      setDiscount(0.10); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * discount;
  const totalPrice = subtotal + tax - discountAmount;

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl || "/path/to/placeholder-image.jpg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">{item.name}</p>
                      <p className="text-gray-500"><FormattedPrice price={item.price}/></p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-200"
                        >
                          <MinusIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="mx-4">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-200"
                        >
                          <PlusIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 mb-6">
              <div className="flex mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="border p-2 rounded-md mr-2 flex-grow"
                />
                <button
                  onClick={handleCouponApply}
                  className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700"
                >
                  Apply Coupon
                </button>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-900 font-medium">Subtotal:</p>
                <FormattedPrice price={subtotal} />
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-900 font-medium">Discount:</p>
                <FormattedPrice price={-discountAmount} />
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-900 font-medium">Tax (7%):</p>
                <FormattedPrice price={tax} />
              </div>
              <div className="flex justify-between mb-6">
                <p className="text-2xl font-bold text-gray-900">Total:</p>
                <FormattedPrice price={totalPrice} />
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShoppingCart;
