import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = 'http://localhost:4000'; 

   axios.defaults.withCredentials = true;
  axios.defaults.baseURL = backendUrl;

  const getUserData = async () => {
    try {
      const response = await axios.get('/api/user/data');
      if (response.data.success) {
        setUserData(response.data.userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.post('/api/auth/is-Auth');
      if (response.data.success) {
        await getUserData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    loading,
    backendUrl,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
