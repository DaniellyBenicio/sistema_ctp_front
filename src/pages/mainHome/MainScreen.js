import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { jwtDecode } from "jwt-decode";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const MainScreen = ({ setAuthenticated }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        const fullName = decode.nome || "Usuário Desconhecido";
        const firstTwoNames = fullName.split(" ").slice(0, 2).join(" ");
        setUserName(firstTwoNames);
        setUserRole(decode.cargo || null);
      } catch (erro) {
        console.error("Erro ao decodificar token:", erro);
        localStorage.removeItem("token");
      }
    }
  }, []);

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