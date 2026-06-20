import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, checkoutCart } from '../store/cartSlice';
import { getProductImage } from '../utils/productImage';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, loading, error: checkoutError } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [paymentData, setPaymentData] = useState({ numeroTarjeta: '', cvv: '', fechaVencimiento: '' });
  const [localError, setLocalError] = useState(null);
  // Estado para controlar la vista de éxito sin cambiar el diseño original
  const [orderCompleted, setOrderCompleted] = useState(false);

  const totalCart = cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0);

  const handleInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (paymentData.numeroTarjeta.length !== 16) {
      setLocalError('El número de tarjeta debe tener 16 dígitos.');
      return;
    }
    if (paymentData.cvv.length !== 3) {
      setLocalError('El CVV debe ser de 3 dígitos.');
      return;
    }

    const resultAction = await dispatch(checkoutCart({
      usuarioId: user?.id ?? null,
      email: user?.email,
      ...paymentData
    }));

    if (checkoutCart.fulfilled.match(resultAction)) {
      // AQUÍ EL CAMBIO: Marcamos como completado para mostrar el mensaje, no redireccionamos aún
      setOrderCompleted(true);
    }
  };

  const displayError = localError || checkoutError;

  // Renderizado condicional del mensaje de éxito (usando tus mismos estilos)
  if (orderCompleted) {
    return (
      <div className="glass-card fade-in" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--success-color, #22c55e)' }}>¡Gracias por tu compra!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Tu pedido fue procesado correctamente.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al Inicio</button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="glass-card fade-in" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>¡Date una vuelta por nuestro catálogo para agregar productos!</p>
        <Link to="/products" className="btn-primary">Ver Productos</Link>
      </div>
    );
  }

  return (
    <div className="grid-auto fade-in" style={{ gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'start' }}>
      
      {/* Lista de productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Tu Carrito</h2>
        {cartItems.map(item => (
          <div key={item.id} className="glass-card flex-between" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={getProductImage(item.nombre)} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{item.nombre}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {item.quantity} x ${item.precio?.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontWeight: 600 }}>${(item.precio * item.quantity).toLocaleString('es-AR')}</span>
              <button onClick={() => dispatch(removeFromCart(item.id))} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '1.2rem' }} title="Eliminar producto">
                🗑️
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => dispatch(clearCart())} className="btn-secondary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>
          Vaciar Carrito
        </button>
      </div>

      {/* Formulario de Pago / Checkout */}
      <div className="glass-card" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3>Resumen de Compra</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div className="flex-between">
            <span style={{ color: 'var(--text-secondary)' }}>Productos:</span>
            <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex-between" style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary-color)' }}>${totalCart.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4>Datos de Pago</h4>
          
          {displayError && (
            <div style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error-color)', borderRadius: '6px', color: 'var(--error-color)', fontSize: '0.85rem' }}>
              {displayError}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Número de Tarjeta</label>
            <input type="text" name="numeroTarjeta" required className="form-input" placeholder="1234567812345678" maxLength="16" value={paymentData.numeroTarjeta} onChange={handleInputChange} disabled={loading} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Vencimiento</label>
              <input type="text" name="fechaVencimiento" required className="form-input" placeholder="MM/AA" maxLength="5" value={paymentData.fechaVencimiento} onChange={handleInputChange} disabled={loading} />
            </div>
            <div className="input-group">
              <label className="input-label">CVV</label>
              <input type="password" name="cvv" required className="form-input" placeholder="123" maxLength="3" value={paymentData.cvv} onChange={handleInputChange} disabled={loading} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Procesando Pago...' : isAuthenticated ? '🔒 Confirmar y Pagar' : 'Iniciá Sesión para Pagar'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Cart;