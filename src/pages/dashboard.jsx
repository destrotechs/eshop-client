// HomePage.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to ShopMATT</h1>
          <p className="text-xl mb-8">Discover amazing products at unbeatable prices!</p>
          <a href="/shop" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300">
            Shop Now
          </a>
        </div>
      </header>

      {/* Categories Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-12">Shop by Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Example Category Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src="https://via.placeholder.com/400x300" alt="Category" className="w-full h-56 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold">Category Name</h3>
              <a href="/category/1" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-300">Explore</a>
            </div>
          </div>
          {/* Repeat the above card for more categories */}
        </div>
      </section>

      {/* Last Viewed Products Section */}
      <section className="bg-gray-200 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Last Viewed Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Example Product Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src="https://via.placeholder.com/400x300" alt="Product" className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Product Name</h3>
                <p className="text-gray-700 text-lg mb-4">$99.99</p>
                <a href="/product/1" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-300">View Product</a>
              </div>
            </div>
            {/* Repeat the above card for more products */}
          </div>
        </div>
      </section>

      {/* Best Deals Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Best Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Example Deal Card */}
            <div className="bg-yellow-500 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="https://via.placeholder.com/400x300" alt="Deal" className="w-full h-56 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2">Deal of the Day</h3>
                <p className="text-lg mb-4">Save up to 70% on selected items!</p>
                <a href="/deals" className="bg-white text-yellow-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition duration-300">Shop Deals</a>
              </div>
            </div>
            {/* Repeat the above card for more deals */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8">
        <div className="container mx-auto px-4">
          <p className="text-sm">&copy; 2024 Your E-Commerce Store. All rights reserved.</p>
          <p className="text-sm mt-2">Follow us on <a href="#" className="text-blue-400 hover:underline">Twitter</a>, <a href="#" className="text-blue-400 hover:underline">Facebook</a>, and <a href="#" className="text-blue-400 hover:underline">Instagram</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
