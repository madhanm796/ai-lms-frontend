import api from '../api/axios';

const authService = {
  login: async (email, password) => {
    const params = new URLSearchParams();
    
    params.append('username', email); 
    params.append('password', password);

      const response = await api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
      const response = await api.get('/users/me');
      return response.data;
  }
};

export default authService;