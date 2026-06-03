import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedAuth = localStorage.getItem('isAuthenticated') === 'true';

      if (token && savedAuth) {
        setIsAuthenticated(true);
        // Podríamos hacer una llamada a /api/usuarios/me o similar si el backend lo soportara
        // Por ahora confiamos en el token almacenado y decodificamos el email si es necesario.
        setUser({ email: localStorage.getItem('userEmail') || 'usuario@uade.edu.ar' });
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', credentials.email);
        
        setIsAuthenticated(true);
        setUser({ email: credentials.email });
        setLoading(false);
        return true;
      } else {
        throw new Error('No se recibió el token de acceso');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.response?.data?.message || 'Credenciales inválidas. Por favor intente de nuevo.');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Registramos al usuario en /api/usuarios
      const response = await api.post('/api/usuarios', userData);
      if (response.data) {
        // Después de registrar, hacemos login automático si el endpoint requiere login,
        // o si prefieres, le pedimos que inicie sesión.
        // Aquí intentaremos iniciar sesión con las credenciales que se acaban de registrar
        const loginSuccess = await login({ email: userData.email, password: userData.password });
        setLoading(false);
        return loginSuccess;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('carritoId');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
