// NewsletterSignup.jsx
import React from 'react';

const NewsletterSignup = () => {
  return (
    <section className="py-16 bg-blue-600 text-white text-center">
      <h2 className="text-3xl font-semibold mb-4">Stay Updated</h2>
      <p className="mb-6">Subscribe to our newsletter and get exclusive discounts!</p>
      <form className="flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-l-md text-black outline-none"
        />
        <button className="px-6 py-2 bg-orange-500 rounded-r-md hover:bg-orange-600">Subscribe</button>
      </form>
    </section>
  );
};

export default NewsletterSignup;
