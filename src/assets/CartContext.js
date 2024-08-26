// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../auth/apiClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: {}, subtotal: 0, total: 0, tax: 0, discount: 0 });
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCart = async () => {
        try {
            const response = await apiClient.get('api/shopping/cart'); // Replace with your API endpoint
            const data = response.data.data;
            setCart(data);

            const totalItemCount = Object.values(data.items || {}).reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(totalItemCount);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, cartItemCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
