import React, { useState, useRef, useEffect } from "react";
import apiClient from "../auth/apiClient";
import OrderList from "../assets/orderlist";

const Orders = ()=>{
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    
    fetchUserData();
  }, []);
    const fetchUserData = async () => {
        try {
          const userString = localStorage.getItem("user");
          const user = userString ? JSON.parse(userString) : null;
    
          if (user && user.id) {
            const response = await apiClient.get(`/api/user/${user.id}`);
            setOrders(response.data.data.orders);
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
    return(
      <>
        <OrderList orders={orders} showBreadcrumb={false}/>
      </>
    )
}
export default Orders;