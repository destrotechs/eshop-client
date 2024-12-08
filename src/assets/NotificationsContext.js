import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '../auth/apiClient'; 

// Create a context for notifications
const NotificationsContext = createContext();

// Custom hook to use notifications context
export const useNotifications = () => useContext(NotificationsContext);

// NotificationsProvider component
export const NotificationsProvider = ({ children }) => {
    // State to store notifications data
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Access isLoggedIn from authSlice
    const [notifications, setNotifications] = useState({ items: [], itemCount: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0)

    // Function to fetch notifications from the backend
    const fetchNotifications = async () => {
      if (!isLoggedIn) return; // Skip fetching if the user is not logged in
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const response = await apiClient.get('api/notifications'); // Your API endpoint for fetching user notifications
            const data = response.data.data; // Assuming the data structure contains a 'data' field

            console.log("Fetched notifications:", data);

            // Update state with notifications data
            setNotifications({
                items: data,  // Assuming the actual notifications are inside the 'data' array
                itemCount: data.length // The total number of notifications can be derived from the length of the array
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };
    const markAsRead = async (notificationId) => {
        try {
          const response = await apiClient.patch(`api/notifications/${notificationId}/read`);
          // Update local state to mark the notification as read
          setNotifications((prevNotifications) => ({
            ...prevNotifications,
            items: prevNotifications.items.map(notification =>
              notification.id === notificationId ? { ...notification, read: true } : notification
            ),
          }));
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      };
      

    // UseEffect to fetch notifications when the component mounts
    useEffect(() => {
        fetchNotifications();
    }, [isLoggedIn]);  // This will run once when the component mounts

    return (
        <NotificationsContext.Provider value={{ notificationsCount:notifications.itemCount,notifications, fetchNotifications,markAsRead, loading, error }}>
            {children}
        </NotificationsContext.Provider>
    );
};
