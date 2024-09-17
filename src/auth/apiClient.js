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
    console.log("Status: " + error.response.status);
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      window.location.href = '/signin'; // or use history.push('/login') if you're using react-router
    }
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, simply return the response
    return response;
  },
  (error) => {
    console.log("Error: " + JSON.stringify(error));

    // Avoid redirect loop for 401 errors by checking if the request is already on the login page
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;

      // Check if the current path is not the login page to prevent a redirect loop
      if (currentPath !== '/signin') {
        // Redirect to login page
        window.location.href = '/signin';
      }
    }

    // Return the error to be handled elsewhere in the app
    return Promise.reject(error);
  }
);

export default apiClient;
