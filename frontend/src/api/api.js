import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const customerAPI = {
  getAll: () => API.get('/customers/'),
  create: (data) => API.post('/customers/', data),
  update: (id, data) => API.put(`/customers/${id}/`, data),
  delete: (id) => API.delete(`/customers/${id}/`),
};

export const productAPI = {
  getAll: () => API.get('/products/'),
  create: (data) => API.post('/products/', data),
  update: (id, data) => API.put(`/products/${id}/`, data),
  delete: (id) => API.delete(`/products/${id}/`),
};

export const orderAPI = {
  getAll: () => API.get('/orders/'),
  create: (data) => API.post('/orders/', data),
  delete: (id) => API.delete(`/orders/${id}/`),
};

export const orderItemAPI = {
  getAll: () => API.get('/order-items/'),
  create: (data) => API.post('/order-items/', data),
  delete: (id) => API.delete(`/order-items/${id}/`),
};