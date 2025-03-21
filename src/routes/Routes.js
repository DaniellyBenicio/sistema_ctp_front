import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/login/Login.js';
import MainScreen from '../pages/mainHome/MainScreen';
import UsersList from '../pages/admin/UsersList';

const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/MainScreen" />}
      />

      {/* Rota após autenticação */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainScreen setAuthenticated={setAuthenticated} />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="users" element={<UsersList />} />
      </Route>

      {/* Redirecionamento para rotas inválidas */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;