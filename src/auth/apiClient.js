import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8001/', // Base URL for your API
  withCredentials: true, // Ensures cookies are sent with the request
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Set the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set Content-Type header to JSON
    config.headers['Content-Type'] = 'application/json';
    // config.headers['Accept'] = 'application/json';
    
    // Optionally set CSRF token if using one
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    // if (csrfToken) {
      // config.headers['X-CSRF-TOKEN'] = '';
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
