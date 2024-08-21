import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GlobeAltIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', formData);
      alert(response.data.message); // or handle success accordingly
      navigate('/login'); // Redirect to login page or other page after successful signup
    } catch (error) {
      setErrors(error.response.data.errors || {});
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `/auth/${provider}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 bg-white shadow-lg z-50">
        <div className="text-center py-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Shop<span className="text-blue-500">MATT</span>
          </h1>
          <p className="text-lg text-gray-600">Your one-stop shop for everything!</p>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-lg p-3 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-lg p-3 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-lg p-3 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="********"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-lg p-3 ${
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="********"
              />
              {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 mb-4"
            >
              Sign Up
            </button>
            <div className="flex flex-col gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
              >
                <GlobeAltIcon className="w-6 h-6 mr-2" /> Sign Up with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('facebook')}
                className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                <PhoneIcon className="w-6 h-6 mr-2" /> Sign Up with Facebook
              </button>
            </div>
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <a href="/signin" className="text-blue-500 hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
