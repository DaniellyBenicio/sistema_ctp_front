import React, { useState } from 'react';
import AppRoutes from './routes/Routes';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  return (
    <Router>
      <AppRoutes
      isAuthenticated={isAuthenticated}
      setAuthenticated={setIsAuthenticated} 
      />
    </Router>
  );
};

export default App;
