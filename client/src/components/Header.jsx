import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isLoggedIn, userData } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <img 
        src={assets.header_img} 
        alt="Profile" 
        className="w-36 h-36 rounded-full mb-6 border-4 border-blue-200 shadow-lg"
      />
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          Hey {isLoggedIn ? userData?.name || 'Developer' : 'Developer'}
          <img 
            className="w-8 h-8" 
            src={assets.hand_wave} 
            alt="Wave"
          />
        </h1>
        
        <p className="text-gray-600 mb-6 text-lg">
          {isLoggedIn 
            ? `Welcome back! Your account is ${userData?.isAccountVerified ? 'verified' : 'pending verification'}.`
            : 'Welcome to our authentication system. Please login to continue.'
          }
        </p>

        {isLoggedIn ? (
          <div className="space-y-4">
            {!userData?.isAccountVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  Your account is not verified yet.
                </p>
                <button
                  onClick={() => navigate('/emailverify')}
                  className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Verify Now
                </button>
              </div>
            )}
            
            {userData?.isAccountVerified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✅ Your account is verified!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;