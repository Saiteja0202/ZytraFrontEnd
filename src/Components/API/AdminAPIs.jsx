import axios from "axios";
import axiosInstance from "./axiosInstance.jsx";

const BASE_URL = "http://localhost:7654/admin";

export const registerAdmin = (adminData) =>
  axios.post(`${BASE_URL}/registration`, adminData);

export const loginAdmin = (loginDetails) =>
  axios.post(`${BASE_URL}/login`, loginDetails);

export const updateAdminProfile = (adminId, adminData) =>
  axiosInstance.put(`/admin/update-profile/${adminId}`, adminData);

export const updateAdminPassword = (adminId, updatePasswordDetails) =>
  axiosInstance.put(`/admin/update-password/${adminId}`, updatePasswordDetails);

export const getAllUserDetails = (adminId) =>
  axiosInstance.get(`/admin/get-all-user-details/${adminId}`);

export const getAdminDetails = (adminId) =>
  axiosInstance.get(`/admin/get-admin-details/${adminId}`);

export const addCategory = (adminId, categoryData) =>
  axiosInstance.post(`/admin/inventory/add-category/${adminId}`, categoryData);

export const getAllCategories = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-categories/${adminId}`);

export const addSubCategory = (adminId, subCategoryData) =>
  axiosInstance.post(`/admin/inventory/add-subcategory/${adminId}`, subCategoryData);

export const getAllSubCategories = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-subcategories/${adminId}`);

export const addBrand = (adminId, brandData) =>
  axiosInstance.post(`/admin/inventory/add-brand/${adminId}`, brandData);

export const getAllBrands = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-brands/${adminId}`);

export const addSeller = (adminId, sellerData) =>
  axiosInstance.post(`/admin/inventory/add-seller/${adminId}`, sellerData);

export const getAllSellers = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-sellers/${adminId}`);

export const activateSeller = (adminId, sellerId) =>
  axiosInstance.put(`/admin/inventory/activate-seller/${adminId}/${sellerId}`);

export const deactivateSeller = (adminId, sellerId) =>
  axiosInstance.put(`/admin/inventory/deactivate-seller/${adminId}/${sellerId}`);

export const addDiscount = (adminId, discountData) =>
  axiosInstance.post(`/admin/inventory/add-discount/${adminId}`, discountData);

export const getAllDiscounts = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-discounts/${adminId}`);

export const addProduct = (adminId, productData) =>
  axiosInstance.post(`/admin/inventory/add-new-product/${adminId}`, productData);

export const getAllProducts = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-products/${adminId}`);

export const updateProductDetails = (adminId, productId, productData) =>
  axiosInstance.put(`/admin/inventory/update-product-details/${adminId}/${productId}`,productData);

export const addInventory = (adminId, inventoryData) =>
  axiosInstance.post(`/admin/inventory/add-inventory/${adminId}`, inventoryData);

export const getAllInventory = (adminId) =>
  axiosInstance.get(`/admin/inventory/get-all-inventory/${adminId}`);

export const updateInventory = (adminId, inventoryId, inventoryData) =>
  axiosInstance.put(`/admin/inventory/update-inventory/${adminId}/${inventoryId}`, inventoryData);

export const updateCategory = (adminId, categoryId, categoryData) =>
  axiosInstance.put(`/admin/inventory/update-category/${adminId}/${categoryId}`,categoryData);

export const updateSubCategory = (adminId, subcategoryId, subCategoryData) =>
  axiosInstance.put(`/admin/inventory/update-subcategory/${adminId}/${subcategoryId}`,subCategoryData);

export const updateBrand = (adminId, brandId, brandData) =>
  axiosInstance.put(`/admin/inventory/update-brand/${adminId}/${brandId}`,brandData);

export const updateSeller = (adminId, sellerId, sellerData) =>
  axiosInstance.put(`/admin/inventory/update-seller/${adminId}/${sellerId}`,sellerData);

export const updateDiscount = (adminId, discountId, discountData) =>
  axiosInstance.put(`/admin/inventory/update-discount/${adminId}/${discountId}`,discountData);