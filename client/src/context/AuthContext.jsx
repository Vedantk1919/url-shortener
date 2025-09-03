import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(Cookies.get('token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      //verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
  try {
    console.log('Verifying token:', token); 
    const response = await axios.get('/api/auth/verify');
    console.log('Token verification successful:', response.data); 
    setUser(response.data.user);
  } catch (error) {
    console.log('Token verification failed:', error.response?.data || error.message); 
    logout();
  } finally {
    setLoading(false);
  }
};

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      Cookies.set('token', newToken, { expires: 1 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          error.message || 
                          'Login failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration with:', { username, email });
      const response = await axios.post('/api/auth/register', { 
        username, email, password 
      });
      console.log('Registration response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      Cookies.set('token', newToken, { expires: 1 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.log('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          error.message || 
                          'Registration failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};