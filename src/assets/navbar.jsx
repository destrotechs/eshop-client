import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import {
    ChevronDownIcon, ShoppingCartIcon, ListBulletIcon, HeartIcon,
    MagnifyingGlassIcon, UserCircleIcon, PowerIcon, XMarkIcon, Bars3Icon
} from '@heroicons/react/24/outline';
import apiClient from '../auth/apiClient';
import { toSentenceCase } from './textUtil';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext'; // Import WishlistContext
import { eventEmitter } from './EventEmitter';

const Navbar = ({ isLoggedIn, onLogout, user }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { cartItemCount, fetchCart } = useCart();
    const { wishlistItemCount, fetchWishlist } = useWishlist(); // Use WishlistContext
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('api/categories/all'); // Replace with your API endpoint
                setCategories(response.data.data); // Adjust based on your API response structure
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
        fetchCart();
        fetchWishlist(); // Fetch wishlist

        // Handle cart updates
        const handleCartUpdate = (newCartData) => {
            fetchCart();
        };

        // Handle wishlist updates
        const handleWishlistUpdate = () => {
            fetchWishlist();
        };

        eventEmitter.on('cartUpdated', handleCartUpdate);
        eventEmitter.on('wishlistUpdated', handleWishlistUpdate);

        return () => {
            eventEmitter.off('cartUpdated', handleCartUpdate);
            eventEmitter.off('wishlistUpdated', handleWishlistUpdate);
        };
    }, []);

    useEffect(() => {
        // Fetch search suggestions
        const fetchSuggestions = async () => {
            if (searchQuery.length > 2) {
                try {
                    const response = await apiClient.get(`api/search/suggestions/${searchQuery}`);
                    setSuggestions(response.data.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                setSuggestions([]);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSelectedSuggestion(suggestion);
        setSearchQuery(suggestion);
        setSuggestions([]);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/products/${searchQuery}`);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 bg-white shadow-md z-50">
            <nav className="flex items-center justify-between px-4 py-4 max-w-screen-xl mx-auto">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="text-gray-800 hover:text-gray-600 md:hidden"
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="w-6 h-6" />
                    ) : (
                        <Bars3Icon className="w-6 h-6" />
                    )}
                </button>

                {/* Left Menu */}
                <div className={`flex items-center space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:flex`}>
                    <Link to="/" onClick={closeMobileMenu} className="text-gray-800 hover:text-gray-600 text-lg font-medium flex items-center">
                        <span className="text-indigo-800 font-bold hover:text-indigo-900">ShopMATT</span>
                    </Link>

                    {/* Categories Dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center text-gray-800 hover:text-gray-600 text-lg font-medium">
                            Categories
                            <ChevronDownIcon className="w-5 h-5 ml-2" />
                        </Menu.Button>
                        <Menu.Items className="absolute left-0 w-48 mt-2 bg-white shadow-lg ring-1 ring-gray-300 divide-y divide-gray-100 rounded-md">
                            {categories.map(category => (
                                <Link
                                    key={category.id}
                                    to={`/categories/${category.category_code}`}
                                    onClick={closeMobileMenu}
                                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    <ListBulletIcon className="w-5 h-5 mr-2 text-gray-600" />
                                    {toSentenceCase(category.category_name)}
                                </Link>
                            ))}
                        </Menu.Items>
                    </Menu>

                    <Link to="/products" onClick={closeMobileMenu} className="text-gray-800 hover:text-gray-600 text-lg font-medium flex items-center">
                        Products
                    </Link>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative flex-grow mx-6 max-w-md">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                    {suggestions.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white shadow-lg ring-1 ring-gray-300 max-h-60 overflow-auto z-10 rounded-md">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </form>

                {/* Right Side Menu */}
                <div className={`flex items-center space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:flex`}>
                    {isLoggedIn ? (
                        <>
                            {/* User Profile */}
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center text-gray-800 hover:text-gray-600">
                                    <img
                                        src={user.profilePicture || 'https://via.placeholder.com/40'} // Default profile picture URL
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border border-gray-300"
                                    />
                                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 w-48 mt-2 bg-white shadow-lg ring-1 ring-gray-300 divide-y divide-gray-100 rounded-md">
                                    <Link className='p-4 flex items-center'>{user.name}</Link>
                                    <Link to="/account" onClick={closeMobileMenu} className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900">
                                        <UserCircleIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        Account
                                    </Link>

                                    <Link to="/orders" onClick={closeMobileMenu} className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900">
                                        <ListBulletIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        Orders
                                    </Link>

                                    <button
                                        onClick={onLogout}
                                        className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900 text-left"
                                    >
                                        <PowerIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        Logout
                                    </button>
                                </Menu.Items>
                            </Menu>

                            {/* Cart */}
                            <div className="relative">
                                <Link to="/shoppingcart" onClick={closeMobileMenu} className="text-gray-800 hover:text-gray-600">
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-indigo-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Wishlist */}
                            <div className="relative">
                                <Link to="/wishlist" onClick={closeMobileMenu} className="text-gray-800 hover:text-gray-600">
                                    <HeartIcon className="w-6 h-6" />
                                    {wishlistItemCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-indigo-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                            {wishlistItemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" onClick={closeMobileMenu} className="text-gray-800 hover:text-gray-600 text-lg font-medium">
                                Sign Up
                            </Link>
                            <Link to="/signin" onClick={closeMobileMenu} className="text-gray-800 hover:text-gray-600 text-lg font-medium">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg ring-1 ring-gray-300 absolute top-16 inset-x-0">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                            Home
                        </Link>
                        <Link to="/products" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                            Products
                        </Link>
                        <Link to="/categories" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                            Categories
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/account" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                                    Account
                                </Link>
                                <Link to="/orders" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                                    Orders
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white text-left"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                                    Sign Up
                                </Link>
                                <Link to="/signin" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
