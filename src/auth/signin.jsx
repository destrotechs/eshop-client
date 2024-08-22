import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authAction';
import { useNavigate,Link } from 'react-router-dom';
const SignIn = ()=>{
    const [email, setEmail]= useState(null);
    const [password, setPassword]= useState(null);
    const dispatch = useDispatch();
    const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();


    const handleInputChange = (input, value)=>{
        switch(input){
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        // Perform authentication logic here
        dispatch(login(email, password));

    }
    if (isLoggedIn){
        // Redirect to dashboard page
        console.log('Login successful');
        navigate('/');
    }
    return (
        <div className="min-h-full flex flex-col justify-center">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-white shadow z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-extrabold text-indigo-600">ShopMATT</Link>
                    <nav>
                        <Link to="/shop" className="text-gray-800 hover:text-indigo-600">Shop</Link>
                    </nav>
                </div>
            </header>

            <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 font-bold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-bold leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    required
                                    className="block w-full font-bold rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default SignIn;