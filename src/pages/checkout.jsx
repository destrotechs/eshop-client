import React, { useState, useEffect} from "react";
import { TrashIcon, PlusIcon, MinusIcon, HeartIcon } from "@heroicons/react/24/outline";
import FormattedPrice from "../assets/formatedprice";
import apiClient from "../auth/apiClient";
import CheckoutCard from "../assets/checkoutCard";
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../assets/CartContext';
const Checkout = () =>{
    const [personalInfo, setPersonalInfo] = useState({});
    
    const { cart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = new useNavigate();
  const [error, setError] = useState(null);
    useEffect(() => {
    
        fetchUserData();
        fetchPaymentMethods();
        
      }, []);
      if(cart.items.length < 1){
        navigate('/shop')
    }
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
      const fetchPaymentMethods = async () => {
        try {
          const userString = localStorage.getItem("user");
          const user = userString ? JSON.parse(userString) : null;
    
          if (true) {
            const response = await apiClient.get(`/api/payments/modes`);
            if(response.status==200){
                console.log("Response ",response.data)
                setPaymentMethods(response.data.data);
            }
            
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
    return (
        <div>
            <CheckoutCard addresses={addresses} paymentMethods={paymentMethods}/>
        </div>
    );
}
export default Checkout;