import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useToast } from '@chakra-ui/react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // True initially until first auth check
  const navigate = useNavigate();
  const toast = useToast();

  const loadUserFromToken = useCallback(async () => {
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      try {
        // No need to set token in apiClient header here, interceptor does it.
        const response = await apiService.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to load user from token", err);
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // No token, ensure clean state
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []); // No dependencies needed if it reads token directly from localStorage

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]); // Runs on mount and if loadUserFromToken identity changes (it won't here)

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      const response = await apiService.loginUser(identifier, password);
      const newAuthToken = response.data.access_token;
      localStorage.setItem('authToken', newAuthToken);
      setToken(newAuthToken); // Update token state
      
      // Fetch user details with the new token to confirm and get user object
      const userResponse = await apiService.getCurrentUser();
      setUser(userResponse.data);
      setIsAuthenticated(true);

      toast({
        title: 'Login Successful',
        description: "Welcome back!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      localStorage.removeItem('authToken'); // Clear token on failed login
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: err.response?.data || { detail: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      await apiService.registerUser({ username, email, password });
      toast({
        title: 'Registration Successful',
        description: 'You can now log in with your new account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
      return { success: true, error: null };
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'Registration failed. Please try again.';
      if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          // Handle FastAPI validation errors (array of objects)
          errorMessage = errorData.detail.map(e => `${e.loc.join('.')} - ${e.msg}`).join('; ');
        } else {
          errorMessage = 'Please check the form for errors.';
        }
      }
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return { success: false, error: errorData || { detail: 'Unknown registration error' } };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: 'Logged Out',
      description: "You have been successfully logged out.",
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setUser, // Allows direct manipulation for e.g. profile updates
    loadUserFromToken, // Expose if manual refresh is needed
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
