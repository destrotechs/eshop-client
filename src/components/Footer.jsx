// Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul>
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p>Email: support@ecommerce.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4 mt-2">
            <a href="#"><i className="fab fa-facebook-square text-2xl"></i></a>
            <a href="#"><i className="fab fa-twitter-square text-2xl"></i></a>
            <a href="#"><i className="fab fa-instagram text-2xl"></i></a>
          </div>
        </div>
      </div>
      <p className="text-center mt-8">&copy; 2024 E-Commerce. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
