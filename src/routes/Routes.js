import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SignUp } from '../components/signUp/signUp.js';
import {Hello} from '../components/HelloReact.js'


  const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
    const handleLogin = () => {
      setAuthenticated(true);
    };

    return (
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/*"
          element = {
            <Hello />
          }
        />
      </Routes>
    );
  };


export default AppRoutes;