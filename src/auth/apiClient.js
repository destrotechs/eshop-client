import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8001/', // Change to localhost
  withCredentials: true, // Ensures cookies are sent with the request
});

// Add a request interceptor to include the token and CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the access token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Set the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("Error: " + JSON.stringify(error));
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      window.location.href = '/signin'; // or use history.push('/login') if you're using react-router
    }
    return Promise.reject(error);
  }
);

export default apiClient;
