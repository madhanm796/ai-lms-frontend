import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initialize User from Local Storage (fixes reload issue)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const isAuthenticated = !!token;

  // 2. Modified Login: Save User to Storage
  const login = (userData, accessToken) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData)); // ✅ Persist user
    
    setToken(accessToken);
    setUser(userData);
  };

  // 3. Modified Logout: Clear User from Storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ✅ Clear user
    setToken(null);
    setUser(null);
  };

  // 4. New Helper: Update User Data (e.g., for XP gain)
  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      // Merge old data with new updates
      const updatedUser = { ...prevUser, ...newUserData };
      // Sync with storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};