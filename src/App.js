import React, { useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from './logo.svg';
import './App.css';
import MainLayout from './assets/layout';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './auth/authSlice';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './auth/signin';
import Dashboad from './pages/dashboard';
import ProductList from './pages/productlist';
import Profile from './pages/myaccount';
import ShoppingCart from './pages/shoppingcart';
import ProductOverview from './pages/productOverview';
import Signup from './auth/signup';
import { CartProvider } from './assets/CartContext';
import { WishlistProvider } from './assets/WishlistContext';
import Wishlist from './pages/wishlist';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      dispatch(loginSuccess({
        accessToken: storedToken,
        user: JSON.parse(storedUser),
      }));
    }
  }, [dispatch]);

  return (
    <CartProvider>
      <WishlistProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<MainLayout><SignIn/></MainLayout>}></Route>
        <Route path="/signup" element={<MainLayout><Signup/></MainLayout>}></Route>
        <Route path="/" element={<MainLayout><Dashboad/></MainLayout>}> </Route>
          <Route path="/categories/:category_code" element={<MainLayout><ProductList/></MainLayout>}></Route>
          <Route path="/products/" element={<MainLayout><ProductList/></MainLayout>}></Route>
          <Route path="/shop/" element={<MainLayout><ProductList/></MainLayout>}></Route>
          <Route path="/products/:common_name" element={<MainLayout><ProductList/></MainLayout>}></Route>
          <Route path='/account' element={<MainLayout><Profile/></MainLayout>}></Route>
          <Route path='/shoppingcart' element={<MainLayout><ShoppingCart/></MainLayout>}></Route>
          <Route path='/product/:productId' element={<MainLayout><ProductOverview/></MainLayout>}></Route>
          <Route path='/wishlist' element={<MainLayout><Wishlist/></MainLayout>}></Route>
      </Routes>
    </BrowserRouter>
    </WishlistProvider>
    </CartProvider>
  );
}

export default App;
