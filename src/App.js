import React, { useEffect,useState } from 'react';
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
import Cart from './pages/shoppingcart';
import ProductOverview from './pages/productOverview';
import Signup from './auth/signup';
import { CartProvider } from './assets/CartContext';
import { WishlistProvider } from './assets/WishlistContext';
import Wishlist from './pages/wishlist';
import Orders from './pages/customerOrders';
import Checkout from './pages/checkout';
import Payment from './pages/payment';
import MultiCaseUpload from './components/multiplecases';
import {NotificationsProvider} from './assets/NotificationsContext';
import apiClient, { setToastFunction } from './auth/apiClient'
import Toast from './assets/Toast';
import OrderDetails from './components/OrderDetails';
function App() {
  const dispatch = useDispatch();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Set the showToast function for the Axios interceptor
  React.useEffect(() => {
    setToastFunction(showToast);
  }, []);

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
    <>
    <NotificationsProvider>
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
          <Route path="/products/:deals?" element={<MainLayout><ProductList/></MainLayout>}></Route>
          <Route path='/account' element={<MainLayout><Profile/></MainLayout>}></Route>
          <Route path='/shoppingcart' element={<MainLayout><Cart/></MainLayout>}></Route>
          <Route path='/product/:productId' element={<MainLayout><ProductOverview/></MainLayout>}></Route>
          <Route path='/wishlist' element={<MainLayout><Wishlist/></MainLayout>}></Route>
          <Route path='/orders' element={<MainLayout><Orders/></MainLayout>}></Route>
          <Route path='/checkout' element={<MainLayout><Checkout/></MainLayout>}></Route>
          <Route path='/order/payment' element={<MainLayout><Payment/></MainLayout>}></Route>
          <Route path='/multipleuploas' element={<MainLayout><MultiCaseUpload/></MainLayout>}></Route>
          <Route path="/orders/:orderID" element={<MainLayout><OrderDetails/></MainLayout>} />
      </Routes>
    </BrowserRouter>
    </WishlistProvider>
    </CartProvider>
    </NotificationsProvider>
    <Toast
        message={toast.message}
        show={toast.show}
        onClose={closeToast}
        type={toast.type}
      />
      </>
  );
}

export default App;
