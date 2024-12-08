import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import apiClient from '../auth/apiClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Access isLoggedIn from authSlice
    const [cart, setCart] = useState({ items: {}, subtotal: 0, total: 0, tax: 0, discount: 0 });
    const [cartItemCount, setCartItemCount] = useState(0);
    console.log("logged in", isLoggedIn);
    const fetchCart = async () => {
        if (!isLoggedIn) return; // Skip fetching if the user is not logged in
        try {
            const response = await apiClient.get('api/shopping/cart'); // Replace with your API endpoint
            const data = response.data.data;
            console.log("CART ",data)
            setCart(data);

            const totalItemCount = Object.values(data.items || {}).reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(totalItemCount);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const clearCart = () => {
        setCart({
            items: {},
            subtotal: 0,
            discount: 0,
            tax: 0,
            total: 0,
        });
        setCartItemCount(0);
    };

    useEffect(() => {
        fetchCart(); // Fetch cart only if the user is logged in
    }, [isLoggedIn]); // Re-run when `isLoggedIn` changes

    return (
        <CartContext.Provider value={{ cart, cartItemCount, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
