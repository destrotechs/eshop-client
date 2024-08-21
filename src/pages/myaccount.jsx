import React, { useState,useRef,useEffect } from "react";
import { UserCircleIcon, MapPinIcon, CreditCardIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import apiClient from "../auth/apiClient";

const Profile = () => {
    const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const userString = localStorage.getItem("user");
      
            // Parse user string into an object
            const user = userString ? JSON.parse(userString) : null;
            
            // Fetch user data from your API
            if (user && user.id) {
              console.log("User ID: " + user.id);
              const response = await apiClient.get(`/api/user/${user.id}`);
              console.log("User Data", response);
              setUser(response.data.data);
              setPersonalInfo(response.data.data);
              setAddresses(response.data.data.addresses);
              setPaymentMethods(response.data.data.payment_modes);
              setOrders(response.data.data.orders);
            }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
    fetchUserData();
  },[]);

  
  // State for each section
  

  

  
  

  // Handlers for input changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = () => {
    // Save personal info logic
    console.log("Saved Personal Info:", personalInfo);
  };

  const handleAddAddress = () => {
    // Add new address logic
    setAddresses([...addresses, "New Address"]);
  };

  const handleAddPaymentMethod = () => {
    // Add new payment method logic
    setPaymentMethods([...paymentMethods, { type: "New Card", lastFour: "0000", expiry: "01/2026" }]);
  };

  const handleViewAllOrders = () => {
    // View all orders logic
    console.log("View all orders");
  };

  const personalInfoRef = useRef(null);
  const addressesRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const ordersRef = useRef(null);

  // Scroll to section function
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
              <h3 className="text-xl font-semibold text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</h3>
              <p className="text-sm text-gray-500">{personalInfo.email}</p>
            </div>
            <ul className="mt-6 space-y-4">
              <li>
                <button onClick={()=>scrollToSection(personalInfoRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <UserCircleIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Personal Info</span>
                </button>
              </li>
              <li>
                <button  onClick={()=>scrollToSection(addressesRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <MapPinIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Shipping Addresses</span>
                </button>
              </li>
              <li>
                <button onClick={()=>scrollToSection(paymentMethodsRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <CreditCardIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Payment Methods</span>
                </button>
              </li>
              <li>
                <button onClick={()=>scrollToSection(ordersRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
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
          <div ref={personalInfoRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
            <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="johndoe@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleSavePersonalInfo} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>

          {/* Shipping Addresses */}
          
          <div ref={addressesRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Addresses</h2>
            {addresses.length > 0 ? (
                <ul className="space-y-4">
                    {addresses.map((address, index) => (
                    <li key={index} className="p-4 border rounded-lg shadow-sm">
                        <p className="text-gray-900 font-medium">{address}</p>
                        <p className="text-gray-500">United States</p>
                    </li>
                    ))}
                </ul>
                ) : (
                    <div class="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                         No address available.
                        </div>
                    </div>
            )}

            <div className="mt-6">
              <button onClick={handleAddAddress} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Add New Address
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div ref={paymentMethodsRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Methods</h2>
            {paymentMethods.length>0?(
                <ul className="space-y-4">
              {paymentMethods.map((method, index) => (
                <li key={index} className="p-4 border rounded-lg shadow-sm flex items-center">
                  <CreditCardIcon className="w-6 h-6 text-gray-600 mr-3" />
                  <div>
                    <p className="text-gray-900 font-medium">{method.type} ending in {method.lastFour}</p>
                    <p className="text-gray-500">Expires {method.expiry}</p>
                  </div>
                </li>
              ))}
            </ul>
            ):(
                <div class="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                         No payment methods available.
                        </div>
                    </div>
            )}
            
            <div className="mt-6">
              <button onClick={handleAddPaymentMethod} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
                Add New Payment Method
              </button>
            </div>
          </div>

          {/* Orders */}
          <div ref={ordersRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
            {ordersRef.length>0?(
                <>
                <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="p-4 border rounded-lg shadow-sm">
                  <p className="text-gray-900 font-medium">Order #{order.id} - {order.amount}</p>
                  <p className="text-gray-500">Placed on {order.date}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
            <button onClick={handleViewAllOrders} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700">
              View All Orders
            </button>
          </div>
          </>
            ):(
                <div class="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                         You have not placed an order yet.
                        </div>
                    </div>
            )}
            
            
          </div>
        </main>
      </div>
    </section>
  );
};

export default Profile;
