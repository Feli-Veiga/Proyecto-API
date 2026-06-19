import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {

  const location = useLocation();

  const {
    isAuthenticated,
    loading
  } = useSelector((state) => state.auth);


  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#e8e6df',
        fontFamily: 'sans-serif'
      }}>
        <h2>Cargando sesión...</h2>
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }


  return children;
};

export default ProtectedRoute;