import React, { useState, useRef, useEffect } from "react";
import { UserCircleIcon, MapPinIcon, CreditCardIcon, ListBulletIcon, PlusIcon, TrashIcon, DocumentIcon } from "@heroicons/react/24/outline";
import apiClient from "../auth/apiClient";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import OrderList from "../assets/orderlist";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState({ type: "", lastFour: "", expiry: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (user && user.id) {
        const response = await apiClient.get(`/api/user/${user.id}`);
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
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = async () => {
    try {
      const response = await apiClient.put(`/api/user/${user.id}`, personalInfo);
      console.log("Personal info updated:", response.data);
    } catch (error) {
      console.error("Error updating personal info:", error);
    }
  };

  const handleAddAddress = async () => {
    if (newAddress) {
      try {
        const response = await apiClient.post(`/api/users/address`, { address: newAddress });
        fetchUserData();
        setIsAddressModalOpen(false);
        setNewAddress('')
      } catch (error) {
        console.error("Error adding address:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget.type === "address") {
        await apiClient.delete(`/api/users/address/${deleteTarget.id}`);
        fetchUserData();
      } else if (deleteTarget.type === "paymentMethod") {
        await apiClient.delete(`/api/user/${user.id}/payment-method/${deleteTarget.id}`);
        setPaymentMethods(paymentMethods.filter((method) => method.id !== deleteTarget.id));
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const openDeleteModal = (type, id) => {
    setDeleteTarget({ type, id });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const personalInfoRef = useRef(null);
  const addressesRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const ordersRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <img className="w-24 h-24 mx-auto rounded-full object-cover mb-4" src="/path-to-UserCircleIcon-image.jpg" alt="Profile" />
              <h3 className="text-xl font-semibold text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</h3>
              <p className="text-sm text-gray-500">{personalInfo.email}</p>
            </div>
            <ul className="mt-6 space-y-4">
              <li>
                <button onClick={() => scrollToSection(personalInfoRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <UserCircleIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Personal Info</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(addressesRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <MapPinIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Shipping Addresses</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(paymentMethodsRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <CreditCardIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Payment Methods</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(ordersRef)} className="flex items-center w-full text-gray-900 hover:text-indigo-600">
                  <ListBulletIcon className="w-6 h-6 mr-3" />
                  <span className="font-medium">Orders</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-8">
          <div ref={personalInfoRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-1xl font-medium text-gray-600 mb-6">Personal Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="John Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="johndoe@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="+1234567890" />
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleSavePersonalInfo} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 flex items-center">
                <DocumentIcon className="w-6 h-6 mr-2" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div ref={addressesRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-1xl font-medium text-gray-600 mb-6">Shipping Addresses</h2>
            {addresses.length > 0 ? (
              <ul className="space-y-4">
                {addresses.map((address, index) => (
                  <li key={index} className="p-4 border rounded-lg shadow-sm relative group">
                    <p className="text-gray-900 font-medium">{address.shipping_address}</p>
                    <button
                      onClick={() => openDeleteModal("address", address.id)}
                      className="absolute top-4 right-2 text-red-500 hidden group-hover:block hover:bg-red-700 hover:text-white hover:p-1 rounded-lg shadow-"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No addresses available.</p>
            )}
            <div className="mt-6">
              <button onClick={() => setIsAddressModalOpen(true)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 flex items-center">
                <PlusIcon className="w-6 h-6 mr-2" />
                <span>New Address</span>
              </button>
            </div>
          </div>

          

          <div ref={ordersRef} className="bg-white rounded-lg shadow-lg p-6">
            {/* <h2 className="text-1xl font-medium text-gray-600 mb-6">Orders</h2> */}
            <OrderList orders={orders}/>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Confirm Deletion
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Are you sure you want to delete this item? This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>&nbsp;
                    <button
                      type="button"
                      className="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* Address Modal */}
      <Transition appear show={isAddressModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddressModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Add New Address
                      </Dialog.Title>
                      <div className="mt-2">
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      onClick={handleAddAddress}
                    >
                      Add Address
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Payment Method Modal */}
      <Transition appear show={isPaymentModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsPaymentModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default Profile;
