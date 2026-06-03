import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Cuenta total de unidades en el carrito (ej. 2 de producto A + 1 de producto B = 3)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'hsla(240, 20%, 8%, 0.75)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          UADE E-commerce
        </Link>

        {/* Buscador */}
        <form onSubmit={handleSearch} style={{
          flex: '1',
          maxWidth: '500px',
          minWidth: '200px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'hsl(240, 12%, 12%)',
              border: '1px solid var(--border-color)',
              borderRadius: '50px',
              padding: '0.6rem 1.2rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              paddingRight: '3rem',
              transition: 'var(--transition-smooth)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <button type="submit" style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1.1rem'
          }}>
            🔍
          </button>
        </form>

        {/* Navegación y Auth */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <Link to="/products" style={{
            color: 'var(--text-secondary)',
            fontWeight: 500,
            fontSize: '0.95rem'
          }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
             onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            Productos
          </Link>

          {/* Carrito */}
          <Link to="/cart" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            🛒 Carrito
            {cartCount > 0 && (
              <span style={{
                background: 'var(--primary-color)',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                border: '2px solid var(--bg-color)',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Autenticación */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                borderRight: '1px solid var(--border-color)',
                paddingRight: '1rem'
              }}>
                👤 {user?.email}
              </span>
              <button onClick={logout} style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--error-color)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '50px',
              fontSize: '0.9rem'
            }}>
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
