import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

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
    // Redirigimos al login pero guardamos la ubicación previa para volver después de loguearse
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
