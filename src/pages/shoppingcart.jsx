import React, { useState, useEffect} from "react";
import { TrashIcon, PlusIcon, MinusIcon, HeartIcon } from "@heroicons/react/24/outline";
import FormattedPrice from "../assets/formatedprice";
import apiClient from "../auth/apiClient";
import { toSentenceCase } from '../assets/textUtil';
import { useNavigate, Link } from 'react-router-dom';
const ShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(0.07); // 7% tax rate
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await apiClient.get("/api/shopping/cart");
        const itemsArray = Object.values(response.data.data.items);
        setItems(itemsArray || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Handle quantity changes
  const handleQuantityChange = (itemId, change) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Handle remove item with confirmation
  const handleRemoveItem = () => {
    setItems(items.filter((item) => item.id !== itemToRemove.id));
    setShowModal(false);
    setItemToRemove(null);
  };

  // Show modal for confirmation
  const confirmRemoveItem = (item) => {
    setItemToRemove(item);
    setShowModal(true);
  };

  // Handle coupon application
  const handleCouponApply = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscount(0.10); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * discount;
  const totalPrice = subtotal + tax - discountAmount;

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Your cart is empty. Start <Link to="/shop" className="text-blue-600">shopping </Link> to fill it up!</p>
          </div>
        ) : (
          <div>
            <ul className="space-y-4">
              {items.map((item) => (
                
                <li key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <Link to={`/product/`+item.product.id}><img
                      src={item.product.images && item.product.images[0] ?  `${apiClient.defaults.baseURL}${item.product.images[0] .img_url.replace(/^\//, '')}`
                      : '/path/to/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    /></Link>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{toSentenceCase(item.product.name)}</p>
                      <p className="text-gray-500 mt-1"><FormattedPrice price={item.product.price} /></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Quantity buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                      >
                        <MinusIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <span className="font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                      >
                        <PlusIcon className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>

                    {/* Add to wishlist and Remove item */}
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-500 hover:text-pink-500 focus:outline-none focus:ring focus:ring-pink-300"
                      >
                        <HeartIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => confirmRemoveItem(item)}
                        className="text-red-500 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-300"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Coupon & Total Section */}
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleCouponApply}
                  className="bg-indigo-600 text-white font-semibold p-2 rounded-md shadow-md hover:bg-indigo-700 transition"
                >
                  Apply Coupon
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-700 font-medium">Subtotal:</p>
                  <FormattedPrice price={subtotal} />
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700 font-medium">Discount:</p>
                  <FormattedPrice price={-discountAmount} />
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700 font-medium">Tax (7%):</p>
                  <FormattedPrice price={tax} />
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
                  <p className="text-gray-900">Total:</p>
                  <FormattedPrice price={totalPrice} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="bg-indigo-600 text-white text-lg font-bold py-4 px-8 rounded-md shadow-md hover:bg-indigo-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Removal</h3>
            <p className="text-gray-700">Are you sure you want to remove <strong>{toSentenceCase(itemToRemove.product.name)}</strong> from your cart?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveItem}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShoppingCart;
