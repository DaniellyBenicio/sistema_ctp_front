import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const MainScreen = ({ setAuthenticated }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthenticated(false);
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const agora = Date.now() / 1000;
        if (decoded.exp < agora) {
          throw new Error("Token expirado");
        }

        const fullName = decoded.nome || "Usuário Desconhecido";
        const firstTwoNames = fullName.split(" ").slice(0, 2).join(" ");
        setUserName(firstTwoNames);
        setUserRole(decoded.cargo || null);

        if (!initialRedirectDone) {
          setInitialRedirectDone(true);
          if (decoded.cargo === "Admin") {
            navigate("/users", { replace: true });
          } else {
            navigate("/demands", { replace: true });
          }
        }

      } catch (erro) {
        console.error("Erro ao validar token:", erro);
        localStorage.removeItem("token");
        setAuthenticated(false);
        navigate("/login");
      }
    };

    validarToken();
  }, [navigate, setAuthenticated, initialRedirectDone, userRole]);

  if (!userRole) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Sidebar
        setAuthenticated={setAuthenticated}
        userRole={userRole}
        userName={userName}
      />
      <div
        style={{
          flexGrow: 1,
          width: isMobile ? "100%" : "calc(100% - 240px)",
          overflowY: "auto",
          background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
          paddingTop: isMobile ? "48px" : 0,
        }}
      >
        <Outlet context={{ userRole }} />
      </div>
    </div>
  );
};

export default MainScreen;