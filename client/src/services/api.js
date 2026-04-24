import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const propertyAPI = {
  getAll: (params) => API.get('/properties', { params }),
  getById: (id) => API.get(`/properties/${id}`),
  create: (data) => API.post('/properties', data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  getFeatured: () => API.get('/properties/featured'),
  getMy: () => API.get('/properties/my'),
  getCities: () => API.get('/properties/cities'),
  getLocalities: (city) => API.get('/properties/localities', { params: { city } }),
};

export const valuationAPI = {
  calculate: (data) => API.post('/valuation', data),
};

export const marketAPI = {
  getOverview: () => API.get('/market/overview'),
  getCities: () => API.get('/market/cities'),
  getCityTrends: (city) => API.get(`/market/city/${city}`),
  getLocalityDetail: (city, locality) => API.get(`/market/locality/${city}/${locality}`),
  getTopLocalities: () => API.get('/market/top-localities'),
};

export const leadAPI = {
  create: (data) => API.post('/leads', data),
  getMy: () => API.get('/leads/my'),
  update: (id, data) => API.put(`/leads/${id}`, data),
  getAll: () => API.get('/leads/all'),
};

export const userAPI = {
  getAll: () => API.get('/users'),
  updateRole: (id, role) => API.put(`/users/${id}/role`, { role }),
  delete: (id) => API.delete(`/users/${id}`),
  saveProperty: (id) => API.post(`/users/save-property/${id}`),
  getSavedProperties: () => API.get('/users/saved-properties'),
  createSavedSearch: (data) => API.post('/users/saved-searches', data),
  getSavedSearches: () => API.get('/users/saved-searches'),
  deleteSavedSearch: (id) => API.delete(`/users/saved-searches/${id}`),
  getDashboardStats: () => API.get('/users/dashboard-stats'),
};

export default API;
