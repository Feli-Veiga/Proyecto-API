import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Sincronizamos el buscador con lo que haya en la URL por si limpian la búsqueda
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('q') || '');

  useEffect(() => {
    setSearchTerm(queryParams.get('q') || '');
  }, [location.search]);

  // Traemos los estados desde Redux
  const auth = useSelector((state) => state.auth) || {};
  const cart = useSelector((state) => state.cart) || {};
  
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const cartItems = cart.cartItems || [];
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  // Función para manejar la búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header style={{
      width: '100%',
      backgroundColor: 'hsl(240, 15%, 10%)',
      borderBottom: '1px solid var(--border-color, #2a2a30)',
      padding: '1rem 2rem',
      display: 'block'
    }}>
      <div className="flex-between" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary-color, #3b82f6)', fontSize: '1.5rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
          🚀 UADE E-Commerce
        </Link>

        {/* 🔍 BARRA DE BÚSQUEDA RECUPERADA */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, maxWidth: '500px', minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="¿Qué estás buscando?..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              backgroundColor: 'hsl(240, 20%, 6%)',
              height: '40px'
            }}
          />
          <button type="submit" className="btn-primary" style={{
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            padding: '0 1.25rem',
            height: '40px',
            cursor: 'pointer'
          }}>
            Buscar
          </button>
        </form>

        {/* Links y Perfil */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/products" style={{ textDecoration: 'none', color: '#ffffff', fontWeight: 500 }}>
            Catálogo
          </Link>
          
          <Link to="/cart" style={{ textDecoration: 'none', color: '#ffffff', fontWeight: 500, position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🛒 Carrito
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', 
                top: '-10px', 
                right: '-15px',
                backgroundColor: 'var(--primary-color, #3b82f6)', 
                color: 'white',
                fontSize: '0.75rem', 
                padding: '2px 6px', 
                borderRadius: '50%',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          <span style={{ color: '#4a4a52' }}>|</span>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                Hola, <strong style={{ color: '#ffffff' }}>{user?.email?.split('@')[0]}</strong>
              </span>
              <button onClick={handleLogoutClick} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.9rem' }}>
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;