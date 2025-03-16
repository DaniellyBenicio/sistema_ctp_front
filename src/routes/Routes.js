import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { SignUp } from '../components/signUp/signUp.js';
import Login from '../components/Login';
import { login } from '../service/auth';
import MainScreen from '../components/MainScreen';

const Layout = ({ children, setAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token de autenticação
    setAuthenticated(false);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f8f8' }}>
        <h1>Bem-vindo ao Sistema</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
          Sair
        </button>
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

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
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />

        {/* Rota de Cadastro */}
        <Route path="/signUp" element={<SignUp />} />

        {/* Rota após autenticação com Layout */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout setAuthenticated={setAuthenticated}>
                <MainScreen setAuthenticated={setAuthenticated} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirecionamento para rotas inválidas */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
      </Routes>
      </BrowserRouter>
  
  );
};

export default AppRoutes;
