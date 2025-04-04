import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "../pages/login/Login.js";
import MainScreen from "../pages/mainHome/MainScreen";
import UsersList from "../pages/admin/UsersList";
import Demands from "../pages/demandas/Demands.js";
import DemandaRegisterPage from "../pages/demandas/DemandaRegisterPage";
import DemandaDetailsPage from "../pages/demandas/DemandaDetailsPage.js";
import Students from "../pages/Alunos/Students.js";
import StudentRegisterPage from "../pages/Alunos/StudentRegisterPage.js";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.js";
import ResetPassword from "../pages/ForgotPassword/ResetPassword.js";
import ArchivedDemands from "../pages/demandas/ArchivedDemands.js";

const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogin = (userRole) => {
    setAuthenticated(true);
    localStorage.setItem("userRole", userRole);
    console.log("User Role:", userRole);
    navigate("/");
  };

  const getDefaultRoute = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole === "Admin" ? "/users" : "/demands";
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to={getDefaultRoute()} />
          )
        }
      />
      <Route path="/recuperar-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha/:token" element={<ResetPassword />} />
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
        <Route index element={<Navigate to={getDefaultRoute()} />} />{" "}
        <Route path="users" element={<UsersList />} />
        <Route path="demands" element={<Demands />} />
        <Route path="demands/register" element={<DemandaRegisterPage />} />
        <Route path="demands/:id" element={<DemandaDetailsPage />} />
        <Route path="demandas-fechadas" element={<ArchivedDemands />} />
        <Route path="alunos" element={<Students />} />
        <Route path="alunos/register" element={<StudentRegisterPage />} />
        <Route
          path="editar-aluno/:matricula"
          element={<StudentRegisterPage />}
        />
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
