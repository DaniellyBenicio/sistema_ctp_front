import React from 'react';

const MainScreen = ({ setAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token de autenticação
    setAuthenticated(false);
  };

  return (
    <div>
      {/* Cabeçalho com o botão de logout */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f8f8' }}>
        <h1>Bem-vindo ao Sistema</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
          Sair
        </button>
      </header>
    </div>
  );
};

export default MainScreen;
