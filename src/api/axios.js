import axios from 'axios';

// API CONNECT

const api = axios.create({
  baseURL: 'http://10.83.53.159:8000/api/v1', 
    headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
        const isLoginRequest = error.config.url && error.config.url.includes('/auth/login');

        if (!isLoginRequest) {
            localStorage.removeItem('token');
            window.location.href = '/login'; 
        } 
    }

    return Promise.reject(error);
  }
);

export default api;