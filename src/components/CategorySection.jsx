import React, { useState, useEffect } from 'react';
import apiClient from '../auth/apiClient';
import { Link } from 'react-router-dom';

// Function to generate a random gradient color
const generateRandomGradient = () => {
  const colors = [
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 
    'pink', 'teal', 'purple', 'cyan', 'lime', 'amber', 'fuchsia', 'rose'
  ];

  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];

  return `from-${randomColor1}-500 to-${randomColor2}-500`;
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const response = await apiClient.get('/api/categories/all');
    console.log('Cats', response);
    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };
  

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-semibold text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.category_name} className="relative group">
            <Link to={`/categories/${category.category_code}`} className="block">
              <div
                className={`w-full h-64 rounded-md shadow-lg bg-gradient-to-r ${generateRandomGradient()} flex items-center justify-center`}
              >
                <span className="text-white text-xl font-semibold">{category.category_name}</span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xl font-semibold">{category.category_name}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
