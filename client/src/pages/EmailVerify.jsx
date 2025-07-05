import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const EmailVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();
  const { getUserData } = useAppContext();

  const sendOtp = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/send-verify-otp');
      if (response.data.success) {
        setOtpSent(true);
        setMessage('OTP sent successfully to your email!');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/verify-account', { otp });
      if (response.data.success) {
        setMessage('Email verified successfully!');
        await getUserData();
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'll send you a verification code to confirm your email address
          </p>
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <button
              onClick={sendOtp}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={verifyOtp}>
            <div>
              <label htmlFor="otp" className="sr-only">Verification Code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit verification code"
                maxLength="6"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="text-blue-600 hover:text-blue-500"
              >
                Resend Code
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
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;