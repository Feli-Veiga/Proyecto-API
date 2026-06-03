import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, loading, removeFromCart, clearCart, getCartTotal, checkoutCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Si no está autenticado, lo mandamos a login pero guardamos que querían ir a checkout
      navigate('/login?redirect=/cart');
      return;
    }
    
    setCheckingOut(true);
    const success = await checkoutCart();
    setCheckingOut(false);
    if (success) {
      setSuccessMessage('¡Tu compra ha sido procesada con éxito! El inventario ha sido actualizado.');
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h2>Cargando carrito...</h2>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="glass-card fade-in" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <span style={{ fontSize: '4rem' }}>🎉</span>
        <h2 style={{ marginTop: '1.5rem', color: 'var(--success-color)' }}>¡Compra Exitosa!</h2>
        <p style={{ margin: '1rem 0 2rem 0', fontSize: '1.1rem' }}>{successMessage}</p>
        <Link to="/products" className="btn-primary">
          Seguir Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Tu Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <h3 style={{ marginTop: '1rem' }}>El carrito está vacío</h3>
          <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Parece que aún no has agregado productos al carrito.</p>
          <Link to="/products" className="btn-primary">Ir al Catálogo</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* List of items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.id} className="glass-card" style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'hsl(240, 15%, 10%)'
              }}>
                {item.imagen ? (
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📦
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.nombre}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Precio unitario: ${item.precio.toLocaleString('es-AR')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Cantidad: {item.quantity}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    ${(item.precio * item.quantity).toLocaleString('es-AR')}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--error-color)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="btn-secondary" style={{ alignSelf: 'flex-start', color: 'var(--error-color)', borderColor: 'hsla(0, 85%, 60%, 0.2)' }}>
              🗑️ Vaciar Carrito
            </button>
          </div>

          {/* Cart Summary */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Resumen del Pedido</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${getCartTotal().toLocaleString('es-AR')}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Envío</span>
                <span style={{ color: 'var(--success-color)', fontWeight: 500 }}>Gratis</span>
              </div>
            </div>

            <div className="flex-between" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--text-primary)' }}>
                ${getCartTotal().toLocaleString('es-AR')}
              </span>
            </div>

            {!isAuthenticated && (
              <div style={{
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.85rem',
                color: '#eab308',
                textAlign: 'center'
              }}>
                Debes iniciar sesión para realizar la compra.
              </div>
            )}

            <button 
              onClick={handleCheckout} 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              disabled={checkingOut}
            >
              {checkingOut ? 'Procesando...' : isAuthenticated ? '💳 Confirmar Compra' : '🔑 Iniciar Sesión para Comprar'}
            </button>

            <Link to="/products" style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
              Seguir Comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
