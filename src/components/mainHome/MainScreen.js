import React from 'react';
import Sidebar from './SideBar';
import RecentDemands from '../demandas/RecentDemands';

const MainScreen = ({ setAuthenticated }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar setAuthenticated={setAuthenticated} />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Bem-vindo ao Sistema</h1>
        <RecentDemands /> {}
      </div>
    </div>
  );
};

export default MainScreen;
