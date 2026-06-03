import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirección después de autenticarse (por ejemplo, volver al carrito)
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || location.state?.from?.pathname || '/';

  const [isLogin, setIsLogin] = useState(true); // Toggle login/register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Campos para login
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Campos para registro
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    sexo: 'M'
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await login(loginData);
    setLoading(false);
    if (success) {
      navigate(redirectPath);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validación básica de edad en frontend (el backend también lo valida)
    const birthDate = new Date(registerData.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('Debes ser mayor de 18 años para registrarte.');
      setLoading(false);
      return;
    }

    const success = await register(registerData);
    setLoading(false);
    if (success) {
      navigate(redirectPath);
    }
  };

  const displayError = error || authError;

  return (
    <div className="fade-in" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 0'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'hsl(240, 15%, 10%)'
      }}>
        {/* Toggle tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          paddingBottom: '0.5rem'
        }}>
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: isLogin ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '0.5rem 0',
              cursor: 'pointer',
              borderBottom: isLogin ? '2px solid var(--primary-color)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: !isLogin ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '0.5rem 0',
              cursor: 'pointer',
              borderBottom: !isLogin ? '2px solid var(--primary-color)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Error message box */}
        {displayError && (
          <div style={{
            padding: '0.8rem 1.2rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            color: 'var(--error-color)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            {displayError}
          </div>
        )}

        {isLogin ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Correo Electrónico</label>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="ejemplo@uade.edu.ar"
                value={loginData.email}
                onChange={handleLoginChange}
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-nombre">Nombre</label>
                <input
                  id="reg-nombre"
                  type="text"
                  name="nombre"
                  required
                  className="form-input"
                  placeholder="Juan"
                  value={registerData.nombre}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-apellido">Apellido</label>
                <input
                  id="reg-apellido"
                  type="text"
                  name="apellido"
                  required
                  className="form-input"
                  placeholder="Pérez"
                  value={registerData.apellido}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-email">Correo Electrónico</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="ejemplo@uade.edu.ar"
                value={registerData.email}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-password">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                required
                className="form-input"
                placeholder="•••••••• (mín. 6 caracteres)"
                value={registerData.password}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-dob">Fecha de Nacimiento</label>
                <input
                  id="reg-dob"
                  type="date"
                  name="fechaNacimiento"
                  required
                  className="form-input"
                  value={registerData.fechaNacimiento}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-sexo">Sexo</label>
                <select
                  id="reg-sexo"
                  name="sexo"
                  className="form-input"
                  value={registerData.sexo}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="M">Masc</option>
                  <option value="F">Fem</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }} disabled={loading}>
              {loading ? 'Creando Cuenta...' : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
