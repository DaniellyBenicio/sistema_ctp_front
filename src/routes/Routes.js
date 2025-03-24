import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/login/Login.js';
import MainScreen from '../pages/mainHome/MainScreen';
import UsersList from '../pages/admin/UsersList';
import Demands from '../pages/demandas/Demands.js';
import DemandaRegisterPage from '../pages/demandas/DemandaRegisterPage';
import StudentsTable from '../pages/Alunos/StudentsTable.js';

const AppRoutes = ({ isAuthenticated, setAuthenticated, students }) => {
  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleSend = (matricula) => console.log("Enviar:", matricula);
  const handleViewDetails = (student) => console.log("Detalhes:", student);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/demands" />}
      />
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
        <Route path="demands" element={<Demands />} />
        <Route path="demands/register" element={<DemandaRegisterPage />} />
        <Route
          path="/alunos"
          element={<StudentsTable students={students} onSend={handleSend} onViewDetails={handleViewDetails} />}
        />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;