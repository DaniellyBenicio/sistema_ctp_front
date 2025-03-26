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
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar com largura fixa */}
      <div style={{ width: "240px" }}>
        <Sidebar setAuthenticated={setAuthenticated} useRole={userRole} />
      </div>

      {/* Conteúdo da página (Outlet) ocupa o restante do espaço */}
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        <Outlet context={{ userRole }} />
      </div>
    </div>
  );
};

export default MainScreen;
