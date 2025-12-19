import axios from 'axios';

const BASE_URL = 'http://localhost:7654';

const getData = (endpoint) =>
  axios.get(`${BASE_URL}/${endpoint}`).then((res) => res.data);

export const getAllProducts = () => getData('all-products');

export const getAllCategories = () => getData('all-categories');

export const getAllSubCategories = () => getData('all-sub-categories');

export const getAllBrands = () => getData('all-brands');