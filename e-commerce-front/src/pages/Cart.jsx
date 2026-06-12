import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, loading, removeFromCart, clearCart, getCartTotal, checkoutCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    numeroTarjeta: '',
    cvv: '',
    fechaVencimiento: ''
  });

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    setShowCardForm(true);
  };

  const handleConfirmPago = async () => {
    setErrorMessage(null);
    setCheckingOut(true);
    const success = await checkoutCart(
      user?.id || null,
      user?.email || '',
      cardData.numeroTarjeta,
      cardData.cvv,
      cardData.fechaVencimiento
    );
    setCheckingOut(false);
    if (success) {
      setShowCardForm(false);
      setSuccessMessage('¡Tu compra ha sido procesada con éxito!');
    } else {
      setErrorMessage('Error al procesar el pago. Verificá los datos de tu tarjeta.');
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
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
        <Link to="/products" className="btn-primary">Seguir Comprando</Link>
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
          <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Aún no agregaste productos.</p>
          <Link to="/products" className="btn-primary">Ir al Catálogo</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{item.nombre}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Precio: ${item.precio.toLocaleString('es-AR')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cantidad: {item.quantity}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 600 }}>${(item.precio * item.quantity).toLocaleString('es-AR')}</span>
                  <br />
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>🗑️ Vaciar Carrito</button>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Resumen del Pedido</h3>
            <div className="flex-between" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>${getCartTotal().toLocaleString('es-AR')}</span>
            </div>

            {showCardForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <h4>💳 Datos de pago</h4>
                <input
                  type="text"
                  placeholder="Número de tarjeta (16 dígitos)"
                  maxLength={16}
                  value={cardData.numeroTarjeta}
                  onChange={e => setCardData({ ...cardData, numeroTarjeta: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
                <input
                  type="text"
                  placeholder="CVV (3 dígitos)"
                  maxLength={3}
                  value={cardData.cvv}
                  onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
                <input
                  type="text"
                  placeholder="Vencimiento (MM/AA)"
                  maxLength={5}
                  value={cardData.fechaVencimiento}
                  onChange={e => setCardData({ ...cardData, fechaVencimiento: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
                {errorMessage && (
                  <div style={{ color: 'var(--error-color)', fontSize: '0.85rem', textAlign: 'center' }}>{errorMessage}</div>
                )}
                <button onClick={handleConfirmPago} className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={checkingOut}>
                  {checkingOut ? 'Procesando...' : '✅ Confirmar Pago'}
                </button>
                <button onClick={() => setShowCardForm(false)} className="btn-secondary" style={{ width: '100%' }}>
                  Cancelar
                </button>
              </div>
            )}

            {!showCardForm && (
              <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                {isAuthenticated ? '💳 Confirmar Compra' : '🔑 Iniciar Sesión para Comprar'}
              </button>
            )}

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