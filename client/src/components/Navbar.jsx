import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useAppContext();

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout');
      if (response.data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm">
      <img 
        src={assets.logo} 
        alt="Logo" 
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />
      
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={assets.header_img} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 font-medium hidden sm:block">
                {userData?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;