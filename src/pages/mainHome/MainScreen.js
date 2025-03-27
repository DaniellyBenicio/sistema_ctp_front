import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { jwtDecode } from "jwt-decode";
import { Outlet } from "react-router-dom";

const MainScreen = ({ setAuthenticated }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        setUserRole(decode.cargo);
      } catch (erro) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Sidebar com largura fixa */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sidebar setAuthenticated={setAuthenticated} useRole={userRole} />
      </div>

      {/* Conteúdo da página ocupa o restante do espaço */}
      <div style={{ flexGrow: 1, width: "100%", overflowY: "auto", background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)" }}>
        <Outlet context={{ userRole }} />
      </div>
    </div>
  );
};

export default MainScreen;
