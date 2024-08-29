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
        <>
        <header className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white z-50 flex justify-between items-center p-4">
    <div className='flex items-center justify-between px-4 py-4 max-w-screen-xl mx-auto'>
    <div className="flex text-xl  px-4 max-w-screen-xl font-bold">
        <Link to={'/'}>shopMATT</Link>
    </div>
    <div className="flex space-x-4">
        <a href="https://www.facebook.com" target="_blank" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.676 0h-21.352c-.732 0-1.324.593-1.324 1.324v21.353c0 .73.593 1.323 1.324 1.323h11.497v-9.294h-3.121v-3.621h3.121v-2.673c0-3.066 1.87-4.738 4.598-4.738 1.307 0 2.431.097 2.759.14v3.197l-1.895.001c-1.487 0-1.774.706-1.774 1.743v2.331h3.548l-.463 3.621h-3.085v9.294h6.052c.73 0 1.323-.593 1.323-1.323v-21.353c-.001-.731-.594-1.324-1.325-1.324z"/>
            </svg>
        </a>
        <a href="https://www.twitter.com" target="_blank" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.92 2.201-4.92 4.917 0 .386.044.762.127 1.124-4.088-.205-7.713-2.164-10.141-5.144-.423.725-.666 1.562-.666 2.456 0 1.694.863 3.188 2.177 4.066-.801-.025-1.554-.245-2.213-.611v.062c0 2.367 1.685 4.342 3.918 4.788-.411.112-.843.171-1.288.171-.315 0-.623-.031-.923-.087.625 1.951 2.436 3.374 4.584 3.413-1.679 1.316-3.797 2.101-6.097 2.101-.396 0-.788-.023-1.175-.069 2.176 1.397 4.757 2.212 7.536 2.212 9.045 0 13.999-7.496 13.999-13.986 0-.213-.005-.425-.014-.636.961-.693 1.797-1.562 2.457-2.549z"/>
            </svg>
        </a>
        <a href="https://www.instagram.com" target="_blank" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.063 2.633.324 3.608 1.299.974.975 1.236 2.242 1.299 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.063 1.366-.324 2.633-1.299 3.608-.975.974-2.242 1.236-3.608 1.299-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.063-2.633-.324-3.608-1.299-.974-.975-1.236-2.242-1.299-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.07-4.85c.063-1.366.324-2.633 1.299-3.608.975-.974 2.242-1.236 3.608-1.299 1.266-.057 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.013-4.947.072-1.517.068-2.555.335-3.549 1.33-.994.994-1.262 2.032-1.33 3.549-.059 1.28-.072 1.688-.072 4.947s.013 3.667.072 4.947c.068 1.517.335 2.555 1.33 3.549.994.994 2.032 1.262 3.549 1.33 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c1.517-.068 2.555-.335 3.549-1.33.994-.994 1.262-2.032 1.33-3.549.059-1.28.072-1.688.072-4.947s-.013-3.667-.072-4.947c-.068-1.517-.335-2.555-1.33-3.549-.994-.994-2.032-1.262-3.549-1.33-1.28-.059-1.688-.072-4.947-.072z"/>
                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.123c-2.187 0-3.961-1.774-3.961-3.961s1.774-3.961 3.961-3.961 3.961 1.774 3.961 3.961-1.774 3.961-3.961 3.961zm6.406-11.845c-.796 0-1.443.648-1.443 1.443 0 .795.648 1.443 1.443 1.443.795 0 1.443-.648 1.443-1.443s-.648-1.443-1.443-1.443z"/>
            </svg>
        </a>
    </div>
    </div>
</header>

        <header className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white z-50">
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
                    {/* <Link to="/" onClick={closeMobileMenu} className="text-white-800 hover:text-gray-600 text-lg font-medium flex items-center">
                        <span className="text-cream-800 font-bold hover:text-indigo-900">ShopMATT</span>
                    </Link> */}

                    {/* Categories Dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center text-white-800 hover:text-blue-600 text-lg font-medium">
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

                    <Link to="/shop" onClick={closeMobileMenu} className="text-white-800 hover:text-blue-600 text-lg font-medium flex items-center">
                        Shop
                    </Link>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative flex-grow mx-6 max-w-md">
                    <div className='relative w-full'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                    /></div>
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 text-gray-700 hover:bg-gray-400 hover:text-white rounded-full flex items-center">
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
                                <Menu.Button className="flex items-center text-white-800 hover:text-blue-600">
                                <UserCircleIcon className="w-7 h-7 text-white-100" />
                                    <ChevronDownIcon className="w-5 h-5 ml-2 text-white" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 w-48 mt-2 bg-white shadow-lg ring-1 ring-gray-300 divide-y divide-gray-100 rounded-xl">
                                    <Link className='p-4 flex mx-6 text-gray-800 items-center'>{user.name}</Link>
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
                                <Link to="/shoppingcart" onClick={closeMobileMenu} className="text-white-800 hover:text-gray-600">
                                    <ShoppingCartIcon className="w-7 h-7" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white-100 bg-yellow-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Wishlist */}
                            <div className="relative">
                                <Link to="/wishlist" onClick={closeMobileMenu} className="text-white-800 hover:text-blue-600">
                                    <HeartIcon className="w-7 h-7 text-orange-200" />
                                    {wishlistItemCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white-700 bg-yellow-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                            {wishlistItemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" onClick={closeMobileMenu} className="text-white-800 hover:text-blue-600 text-lg font-medium">
                                Sign Up
                            </Link>
                            <Link to="/signin" onClick={closeMobileMenu} className="text-white-800 hover:text-blue-600 text-lg font-medium">
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
                            Shop
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
        </>
    );
};

export default Navbar;
