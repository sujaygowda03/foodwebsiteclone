import React from 'react';
import LandingPage from './suby/pages/LandingPage';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProductMenu from './suby/components/ProductMenu';
import LoginPage from './suby/pages/LoginPage';
import SignupPage from './suby/pages/SignupPage';
import { AuthProvider } from './suby/context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/products/:firmId/:firmName' element={<ProductMenu />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;