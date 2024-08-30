import React, { useState, useEffect} from "react";
import { TrashIcon, PlusIcon, MinusIcon, HeartIcon } from "@heroicons/react/24/outline";
import FormattedPrice from "../assets/formatedprice";
import apiClient from "../auth/apiClient";
import { toSentenceCase } from '../assets/textUtil';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../assets/breadCrump';
import { eventEmitter } from '../assets/EventEmitter';
import Toast from '../assets/Toast';
import ShoppingCart from "../components/cartComponent";
import { useCart } from '../assets/CartContext';
const Cart = () => {
  const breadcrumbPaths = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Products' }
  ];
  const navigate = new useNavigate()
  const handleCheckoutNav = () => {
    navigate('/checkout');
  };
  const { cart } = useCart();
  console.log("CART",cart['items']);
  return (
    <section className="max-w-6xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
    <Breadcrumb paths={breadcrumbPaths} />
    <ShoppingCart title="Shopping Cart"/>
    {Object.keys(cart['items']).length > 0 && (<div className="mt-6 flex justify-end">
      <button onClick={handleCheckoutNav} className="bg-indigo-600 text-white text-lg font-bold py-4 px-8 rounded-md shadow-md hover:bg-indigo-700 transition">
        Proceed to Checkout
      </button>
    </div>)}
    </section>
  
  );
};

export default Cart;
