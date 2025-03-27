import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/login/Login.js";
import MainScreen from "../pages/mainHome/MainScreen";
import UsersList from "../pages/admin/UsersList";
import Demands from "../pages/demandas/Demands.js";
import DemandaRegisterPage from "../pages/demandas/DemandaRegisterPage";
import Students from "../pages/alunos/Students";
import StudentRegisterPage from "../pages/alunos/StudentRegisterPage";

const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to="/demands" />
          )
        }
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
        <Route path="alunos" element={<Students />} />
        <Route path="alunos/register" element={<StudentRegisterPage />} />
        <Route path="editar-aluno/:matricula" element={<StudentRegisterPage />} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
};

export default AppRoutes;
