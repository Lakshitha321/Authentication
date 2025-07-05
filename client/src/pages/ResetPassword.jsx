import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp + password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/send-reset-otp', {
        email: formData.email
      });
      
      if (response.data.success) {
        setStep(2);
        setMessage('Reset code sent to your email!');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/reset-password', formData);
      
      if (response.data.success) {
        setMessage('Password reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={sendResetOtp}>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={resetPassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">Reset Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6-digit reset code"
                  maxLength="6"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="sr-only">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="New password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-500"
              >
                Back to Email
              </button>
            </div>
          </form>
        )}

        {message && (
          <div className={`rounded-md p-4 ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;