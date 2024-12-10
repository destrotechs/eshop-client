// apiClient.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://192.168.142.196:8001/', // Change to localhost
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
    console.error("Request error: ", error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling and Toast logic
let showToast; // External function to show Toast, injected later

apiClient.interceptors.response.use(
  (response) => {
    // Optionally show success Toast for specific responses
    if (response.data && response.data.success!==null && showToast) {
      showToast(response.data.success, 'success');
    }
    return response;
  },
  (error) => {
    console.error("Response error: ", error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/signin') {
          sessionStorage.setItem('redirectUrl', currentPath);
          if (showToast) showToast('Unauthorized access. Redirecting to login.', 'error');
          setTimeout(() => {
            window.location.href = '/signin';
          }, 3000); // Delay for user to see the Toast
        }
      } else if (status === 400) {
        // Display specific error message from response.data.error if available
        if (data.error && showToast) {
          showToast(data.error, 'error');
        } else if (showToast) {
          showToast('Invalid form data. Please check your inputs.', 'error');
        }
      } else {
        // Display general errors from response.data.error or fallback to a default message
        if (data.error && showToast) {
          showToast(data.error, 'error');
        } else if (showToast) {
          showToast('An unexpected error occurred. Please try again.', 'error');
        }
      }
    } else {
      if (showToast) showToast('Network error. Please check your connection.', 'error');
    }

    return Promise.reject(error);
  }
);

// Function to inject the showToast function
export const setToastFunction = (toastFn) => {
  showToast = toastFn;
};

export default apiClient;
