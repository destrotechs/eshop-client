import React, { useState, useEffect } from "react";
import { HeartIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import FormattedPrice from "../assets/formatedprice";
import apiClient from "../auth/apiClient";
import { toSentenceCase } from '../assets/textUtil';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../assets/breadCrump';
import Toast from '../assets/Toast';
import { eventEmitter } from '../assets/EventEmitter';
const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [cart, setCart] = useState({ items: {}, subtotal: 0, total: 0, tax: 0, discount: 0 });

  useEffect(() => {
    fetchWishlistItems();
  }, []);
  const fetchWishlistItems = async () => {
    try {
      const response = await apiClient.get("/api/shopping/wishlist"); // Update with your actual API endpoint
      const itemsArray = Object.values(response.data.data.items);
      setItems(itemsArray || []);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };
  const handleRemoveFromWishlist = async (item) => {
    try {
      const response = await apiClient.post(`/api/shopping/wishlist/remove`,{product_id: item.product.id}); // Update with your actual API endpoint
      fetchWishlistItems();
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const response = await apiClient.post("/api/shopping/cart", { product_id: item.product.id }); // Update with your actual API endpoint
      // Optionally, you can show a success message or update state
      console.log(`Added item ${item.id} to cart.`);
      const updatedCart = response.data.data;
            setCart(updatedCart);

            // Emit cart update event
            eventEmitter.emit('cartUpdated', updatedCart);
      setToastMessage(response.data.message);
      setShowToast(true);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <>
    <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm rounded-xl p-6">
       
        {items.length === 0 ? (
          
          <div className="text-center text-gray-500">
            <center><img src="images/wishlist2.jpg" alt="wishlist" className=""/></center>
            <p>Your wishlist is empty.</p>
          </div>
        ) : (
          <div>
             <h2 className="text-2xl font-semibold text-gray-900 mb-6">Wishlist</h2>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center">
                  <Link to={`/product/`+item.product.id}><img
                      src={item.product.images && item.product.images[0] ?  `${apiClient.defaults.baseURL}${item.product.images[0] .img_url.replace(/^\//, '')}`
                      : '/path/to/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    /></Link>
                    <div>
                      <p className="text-gray-900 font-bold">{toSentenceCase(item.product.name)}</p>
                      <p className="text-gray-500"><FormattedPrice price={item.product.price}/></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="text-indigo p-2 rounded-lg hover:bg-green-600 hover:text-white transition"
                    >
                      
                      <ShoppingCartIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item)}
                      className="text-red-500 rounded-md p-2  hover:bg-red-700 hover:text-white transition"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
    <Toast
    message={toastMessage}
    show={showToast}
    onClose={() => setShowToast(false)}
/>
</>
  );
};

export default Wishlist;
