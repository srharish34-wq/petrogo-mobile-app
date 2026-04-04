import axios from 'axios';

// ✅ Use VITE_API_URL in production (Vercel), fallback to relative URL for local dev (Vite proxy)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

api.interceptors.request.use(
  (config) => {
    const userPhone = localStorage.getItem('userPhone');
    if (userPhone) config.headers['x-user-phone'] = userPhone;
    console.log('📡 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;