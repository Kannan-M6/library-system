/**
 * api/client.js
 * Axios instance with automatic JWT injection and error handling
 */
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling — redirect to login on 401
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
  me: () => client.get('/auth/me'),
};

export const booksAPI = {
  list: (params) => client.get('/books', { params }),
  get: (id) => client.get(`/books/${id}`),
  add: (data) => client.post('/books', data),
  update: (id, data) => client.put(`/books/${id}`, data),
  delete: (id) => client.delete(`/books/${id}`),
  stats: () => client.get('/books/stats'),
};

export const txnAPI = {
  borrow: (data) => client.post('/transactions/borrow', data),
  borrowManual: (data) => client.post('/transactions/borrow-manual', data),
  returnBook: (id) => client.post(`/transactions/return/${id}`),
  all: (params) => client.get('/transactions', { params }),
  my: () => client.get('/transactions/my'),
  overdue: () => client.get('/transactions/overdue'),
  getAllStudents: () => client.get('/transactions/get-all-students'),
  getAllBooks: () => client.get('/transactions/get-all-books'),
};

export const mlAPI = {
  chat: (message) => client.post('/chat', { message }),
  recommendations: (userId) => client.get(`/recommendations/${userId}`),
  demand: (bookId) => client.get(`/demand/${bookId}`),
};

export const cameraAPI = {
  scan: (image) => client.post('/camera/scan', { image }),
  borrowByScan: (data) => client.post('/camera/borrow-by-scan', data),
};

export default client;
