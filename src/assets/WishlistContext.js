import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../auth/apiClient';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState({ items: {}, itemCount: 0 });
    const [wishlistItemCount, setWishlistItemCount] = useState(0)
    const fetchWishlist = async () => {
        try {
            const response = await apiClient.get('api/shopping/wishlist'); // Replace with your API endpoint
            const data = response.data.data;
            console.log("wishlist" ,data);
            const totalItemCount = Object.values(data.items || {}).reduce((sum, item) => sum + item.quantity, 0);
            setWishlist({ items: data.items, itemCount: totalItemCount });
            console.log("wishlist2" ,wishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <WishlistContext.Provider value={{ wishlistItemCount: wishlist.itemCount, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
