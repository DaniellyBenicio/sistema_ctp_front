import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SignUp } from '../components/signUp/signUp.js';
import { Hello } from '../components/HelloReact.js';
import Login from '../components/Login';

  const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
    const handleLogin = () => {
      setAuthenticated(true);
    };

    return (
      <Routes>
        {/* Rota de Login */}
        <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
      />
      

        <Route path="/signUp" element={<SignUp />} />
        <Route path="/*"
          element = {
            <Hello />
          }
        />
      </Routes>
    );
  };


export default AppRoutes;