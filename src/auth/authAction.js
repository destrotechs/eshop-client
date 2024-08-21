import apiClient from './apiClient';
import { loginStart, loginSuccess, loginFailure } from './authSlice';

import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginStart());

    // Make the API call to the login endpoint
    const response = await apiClient.post('api/users/login', {
      email: email,
      password: password
    });
    console.log(response)
    const userData = response.data.data; // Adjust to match your response structure

    // Save the token and user data in localStorage
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData.user));
    // On successful login, dispatch loginSuccess with the user data
    dispatch(loginSuccess(userData));
  } catch (error) {
    // Handle errors and dispatch loginFailure with an appropriate error message
    dispatch(loginFailure(error.response?.data?.message || 'Something went wrong'));
  }
};
