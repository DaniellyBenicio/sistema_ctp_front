import React, { useState, useEffect } from "react";
import AppRoutes from "./routes/Routes";
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CustomAlert } from "../src/components/alert/CustomAlert";
import api from "../src/service/api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const verificarToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/recuperar-senha"
      ) {
        navigate("/login");
      }
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      const agora = Date.now() / 1000;
      if (decoded.exp < agora) {
        setAlert({
          message:
            "Sua sessão expirou por questões de segurança. Faça login novamente.",
          type: "error",
          position: "top",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setAlert(null);
          if (
            location.pathname !== "/login" &&
            location.pathname !== "/recuperar-senha"
          ) {
            navigate("/login");
          }
        }, 3000);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      return false;
    }
  };

  const verificarConectividade = async () => {
    try {
      await api.get("auth/health");
      return true;
    } catch (error) {
      setAlert({
        message: "Servidor indisponível. Você será redirecionado para o login.",
        type: "error",
        position: "top",
      });
      setTimeout(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setAlert(null);
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/recuperar-senha"
        ) {
          navigate("/login");
        }
      }, 3000);
      return false;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      if (!verificarToken()) return;
      await verificarConectividade();
    };

    checkSession();
    const intervalo = setInterval(checkSession, 10000);
    return () => clearInterval(intervalo);
  }, [navigate, location]);

  useEffect(() => {
    const handleSessionExpired = (e) => {
      if (!alert) {
        setAlert({
          message: e.detail.message,
          type: e.detail.type,
          position: e.detail.position,
        });
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, [alert]);

  return (
    <>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setAuthenticated={setIsAuthenticated}
      />
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          position={alert.position}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
