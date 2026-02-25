import api from '../api/axios';

const userService = {
  // Get latest profile data
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update text details (Name, Bio, etc.)
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  // Update Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  // Upload Avatar (Multipart form data)
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // Should return new image URL
  }
};

export default userService;