import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const { loading } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;