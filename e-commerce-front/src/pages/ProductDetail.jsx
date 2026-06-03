import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/productos/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error al cargar detalle del producto:', err);
        setError('El producto solicitado no existe o hubo un problema al obtener sus datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (val) => {
    const newQty = Math.max(1, Math.min(product.stock, val));
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    const success = await addToCart(product, quantity);
    setAdding(false);
    if (success) {
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        color: 'var(--text-secondary)'
      }}>
        <h2>Cargando detalles del producto...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card fade-in" style={{ padding: '3rem', textAlign: 'center', borderColor: 'var(--error-color)', maxWidth: '600px', margin: '2rem auto' }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h2 style={{ marginTop: '1rem', color: 'var(--error-color)' }}>Error</h2>
        <p>{error}</p>
        <Link to="/products" className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <Link to="/" style={{ color: 'var(--primary-color)' }}>Inicio</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to="/products" style={{ color: 'var(--primary-color)' }}>Productos</Link>
        {product.categoria?.nombre && (
          <>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link to={`/products?categoria=${product.categoria.nombre}`} style={{ color: 'var(--primary-color)' }}>
              {product.categoria.nombre}
            </Link>
          </>
        )}
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-muted)' }}>{product.nombre}</span>
      </nav>

      {/* Main product columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Product Image */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {product.imagen ? (
            <img 
              src={product.imagen} 
              alt={product.nombre} 
              style={{
                width: '100%',
                maxHeight: '450px',
                objectFit: 'contain',
                borderRadius: '12px'
              }} 
            />
          ) : (
            <div style={{
              width: '100%',
              height: '350px',
              background: 'linear-gradient(135deg, hsl(260, 85%, 20%) 0%, hsl(240, 20%, 8%) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '4rem'
            }}>
              📦
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            {product.categoria?.nombre && (
              <span className="badge" style={{ marginBottom: '0.75rem' }}>
                {product.categoria.nombre}
              </span>
            )}
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{product.nombre}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ${product.precio.toLocaleString('es-AR')}
              </span>
              
              {product.stock > 0 ? (
                <span className="badge badge-success">Stock Disponible</span>
              ) : (
                <span className="badge" style={{ backgroundColor: 'var(--error-color)', color: 'white', borderColor: 'transparent' }}>
                  Sin Stock
                </span>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Descripción</h3>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>{product.descripcion}</p>
          </div>

          {/* Action Box */}
          {product.stock > 0 && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'hsl(240, 15%, 10%)' }}>
              <div className="flex-between">
                <span style={{ fontWeight: 500 }}>Cantidad:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="btn-secondary" 
                    style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
                    disabled={quantity <= 1 || adding}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, width: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="btn-secondary" 
                    style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
                    disabled={quantity >= product.stock || adding}
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart} 
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem' }}
                disabled={adding}
              >
                {adding ? 'Agregando...' : '🛒 Agregar al Carrito'}
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Stock disponible: {product.stock} unidades.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
