import axiosInstance from './axiosInstance.jsx';
import axios from 'axios';

const BASE_URL = 'http://localhost:7654/user';


export const registerUser = (userData) =>
  axios.post(`${BASE_URL}/registration`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const loginUser = (loginDetails) =>
  axios.post(`${BASE_URL}/login`, loginDetails, {
    headers: { 'Content-Type': 'application/json' },
  });

export const generateOtp = (userData) =>
  axios.post(`${BASE_URL}/generate-otp`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const verifyForgotUsernameOtp = (userData) =>
  axios.post(`${BASE_URL}/forgot-username/verify-otp`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const verifyForgotPasswordOtp = (userData) =>
  axios.post(`${BASE_URL}/forgot-password/verify-otp`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const updateForgotPassword = (updatePasswordDetails) =>
  axios.post(`${BASE_URL}/update-forgot-password`, updatePasswordDetails, {
    headers: { 'Content-Type': 'application/json' },
  });

export const updateProfile = (userId, userData) =>
  axiosInstance.put(`/user/update-profile/${userId}`, userData);

export const updatePassword = (userId, updatePasswordDetails) =>
  axiosInstance.put(`/user/update-password/${userId}`, updatePasswordDetails);

export const getAllProducts = (userId) =>
  axiosInstance.get(`/user/all-products/${userId}`);

export const subscribePrime = (userId) =>
  axiosInstance.put(`/user/subscribe-prime/${userId}`);

export const reviewProduct = (userId, productId, reviewData) =>
  axiosInstance.post(`/user/review-product/${userId}/${productId}`, reviewData);

export const updateReview = (userId, productId, reviewData) =>
  axiosInstance.put(`/user/update-review/${userId}/${productId}`, reviewData);

export const getCart = (userId) =>
  axiosInstance.get(`/user/get-cart/${userId}`);


export const addToCart = (userId, productId) =>
  axiosInstance.post(`/user/add-to-cart/${userId}/${productId}`);

export const deleteFromCart = (userId, productId) =>
  axiosInstance.delete(`/user/delete-from-cart/${userId}/${productId}`);

export const getProductDetails = (userId, productId) =>
  axiosInstance.get(`/user/get-product/${userId}/${productId}`);

export const initiateOrder = (userId) =>
  axiosInstance.post(`/user/initiate-order/${userId}`);

export const orderPayment = (userId, orderId, payments) =>
  axiosInstance.post(`/user/order-payment/${userId}/${orderId}`, payments);

export const getOrderDetails = (userId, orderId) =>
  axiosInstance.get(`/user/get-order/${userId}/${orderId}`);

export const getOrdersDetails = (userId) =>
  axiosInstance.get(`/user/get-orders/${userId}`);
