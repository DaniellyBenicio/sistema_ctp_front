import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SignUp } from '../components/signUp/signUp.js';
import Login from '../components/login/Login.js';
import { login } from '../service/auth';
import MainScreen from '../components/mainHome/MainScreen';
import Demandas from '../components/demandas/Demandas'; // Importação correta do componente Demandas

const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
  const handleLogin = async (email, senha) => {
    try {
      const token = await login(email, senha);
      if (token) {
        setAuthenticated(true);
        localStorage.setItem('token', token); // Salva o token no armazenamento local
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Routes>
      {/* Rota de Login */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/MainScreen" />}
      />

      {/* Rota de Cadastro */}
      <Route path="/signUp" element={<SignUp />} />

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
        {/* Rota de demanda */}
        <Route path="demanda" element={<Demandas />} />
      </Route>

      {/* Redirecionamento para rotas inválidas */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;