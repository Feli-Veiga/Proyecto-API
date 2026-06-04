import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // 📸 URL FIJA PARA TODO EL CATÁLOGO
  const IMAGEN_UNICA = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80";

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    backgroundColor: 'var(--border-color)'
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      justifyContent: 'space-between',
      height: '100%'
    }}>
      <div>
        <div style={{ position: 'relative' }}>
          {/* Forzamos la imagen estática aquí */}
          <img src={IMAGEN_UNICA} alt={product.nombre} style={imageStyle} />
          
          {product.stock <= 0 ? (
            <span className="badge" style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'var(--error-color)',
              color: 'white',
              borderColor: 'transparent'
            }}>
              Sin Stock
            </span>
          ) : product.stock < 5 ? (
            <span className="badge" style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'var(--error-color)',
              color: 'white',
              borderColor: 'transparent'
            }}>
              ¡Últimas {product.stock}!
            </span>
          ) : null}
        </div>
        
        <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{product.nombre}</h3>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '2.8rem',
          margin: '0.25rem 0'
        }}>
          {product.descripcion}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        <div className="flex-between">
          <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ${product.precio?.toLocaleString('es-AR')}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Stock: {product.stock}
          </span>
        </div>
        
        <Link to={`/products/${product.id}`} className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
          Ver Detalle
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;