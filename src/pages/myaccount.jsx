import React from "react";
import { UserCircleIcon, MapPinIcon, CreditCardIcon, ListBulletIcon } from "@heroicons/react/24/outline";


const Profile = () => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <img
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                src="/path-to-UserCircleIcon-image.jpg"
                alt="Profile"
              />
              <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
              <p className="text-sm text-gray-500">johndoe@example.com</p>
            </div>
            <ul className="mt-6 space-y-4">
              <li>
                <button className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <UserCircleIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Personal Info</span>
                </button>
              </li>
              <li>
                <button className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <MapPinIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Shipping Addresses</span>
                </button>
              </li>
              <li>
                <button className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <CreditCardIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Payment Methods</span>
                </button>
              </li>
              <li>
                <button className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <ListBulletIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Orders</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Profile Content */}
        <main className="lg:col-span-3 space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John"
                  defaultValue="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Doe"
                  defaultValue="Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="johndoe@example.com"
                  defaultValue="johndoe@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1234567890"
                  defaultValue="+1234567890"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Addresses</h2>
            <ul className="space-y-4">
              <li className="p-4 border rounded-lg shadow-sm">
                <p className="text-gray-900 font-medium">123 Main St, New York, NY 10001</p>
                <p className="text-gray-500">United States</p>
              </li>
              <li className="p-4 border rounded-lg shadow-sm">
                <p className="text-gray-900 font-medium">456 Oak Ave, San Francisco, CA 94103</p>
                <p className="text-gray-500">United States</p>
              </li>
            </ul>
            <div className="mt-6">
              <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Add New Address
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Methods</h2>
            <ul className="space-y-4">
              <li className="p-4 border rounded-lg shadow-sm flex items-center">
                <CreditCardIcon className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <p className="text-gray-900 font-medium">Visa ending in 1234</p>
                  <p className="text-gray-500">Expires 09/2024</p>
                </div>
              </li>
              <li className="p-4 border rounded-lg shadow-sm flex items-center">
                <CreditCardIcon className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <p className="text-gray-900 font-medium">MasterCard ending in 5678</p>
                  <p className="text-gray-500">Expires 01/2025</p>
                </div>
              </li>
            </ul>
            <div className="mt-6">
              <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Add New Payment Method
              </button>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
            <ul className="space-y-4">
              <li className="p-4 border rounded-lg shadow-sm">
                <p className="text-gray-900 font-medium">Order #123456 - $120.00</p>
                <p className="text-gray-500">Placed on August 12, 2024</p>
              </li>
              <li className="p-4 border rounded-lg shadow-sm">
                <p className="text-gray-900 font-medium">Order #789012 - $45.00</p>
                <p className="text-gray-500">Placed on August 2, 2024</p>
              </li>
            </ul>
            <div className="mt-6">
              <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                View All Orders
              </button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Profile;
