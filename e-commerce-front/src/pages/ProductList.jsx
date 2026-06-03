import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('q') || '';
  const categoryParam = queryParams.get('categoria') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/productos');
        setProducts(response.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Por favor, asegúrate de que el servidor backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrado de productos cliente-side (por categoría y por término de búsqueda)
  const filteredProducts = products.filter(product => {
    // 1. Filtrar por término de búsqueda (nombre o descripción)
    if (searchParam) {
      const query = searchParam.toLowerCase();
      const matchName = product.nombre?.toLowerCase().includes(query);
      const matchDesc = product.descripcion?.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }
    
    // 2. Filtrar por categoría (el producto del backend tiene un objeto categoria, o podemos comparar por nombre)
    if (categoryParam) {
      const cat = categoryParam.toLowerCase();
      // Verificamos si coincide el nombre de la categoría del producto
      const productCategory = product.categoria?.nombre?.toLowerCase() || '';
      if (!productCategory.includes(cat) && product.categoria?.id?.toString() !== cat) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2>Cargando catálogo...</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="glass-card" style={{ height: '380px', opacity: 0.6 }}>
              <div style={{ height: '200px', background: 'var(--border-color)', borderRadius: '12px' }} />
              <div style={{ height: '20px', background: 'var(--border-color)', width: '80%', margin: '1rem 0' }} />
              <div style={{ height: '20px', background: 'var(--border-color)', width: '40%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card fade-in" style={{ padding: '3rem', textAlign: 'center', borderColor: 'var(--error-color)' }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h2 style={{ marginTop: '1rem', color: 'var(--error-color)' }}>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '1rem' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>
            {searchParam ? `Resultados para "${searchParam}"` : categoryParam ? `Categoría: ${categoryParam}` : 'Catálogo de Productos'}
          </h2>
          <p style={{ margin: 0 }}>Se encontraron {filteredProducts.length} productos</p>
        </div>
        
        {/* Filtros rápidos */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-secondary" style={{
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            backgroundColor: !categoryParam ? 'var(--surface-hover)' : 'transparent'
          }}>
            Todos
          </Link>
          {['Tecnologia', 'Audio', 'Accesorios', 'Smartphones'].map(cat => (
            <Link key={cat} to={`/products?categoria=${cat}`} className="btn-secondary" style={{
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              backgroundColor: categoryParam.toLowerCase() === cat.toLowerCase() ? 'var(--surface-hover)' : 'transparent'
            }}>
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <h3 style={{ marginTop: '1rem' }}>No se encontraron productos</h3>
          <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Prueba buscando con otros términos o seleccionando otra categoría.</p>
          <Link to="/products" className="btn-primary">Ver Todos los Productos</Link>
        </div>
      ) : (
        <div className="grid-auto">
          {filteredProducts.map(product => {
            // Placeholder de imagen con degradado si no tiene url
            const imageStyle = {
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '12px',
              backgroundColor: 'var(--border-color)'
            };

            return (
              <div key={product.id} className="glass-card" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                justifyContent: 'space-between',
                height: '100%'
              }}>
                <div>
                  <div style={{ position: 'relative' }}>
                    {product.imagen ? (
                      <img src={product.imagen} alt={product.nombre} style={imageStyle} />
                    ) : (
                      <div style={{
                        ...imageStyle,
                        background: 'linear-gradient(135deg, hsl(260, 85%, 20%) 0%, hsl(240, 20%, 8%) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '2rem'
                      }}>
                        📦
                      </div>
                    )}
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
                      ${product.precio.toLocaleString('es-AR')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <Link to={`/products/${product.id}`} className="btn-primary" style={{ width: '100%' }}>
                    Ver Detalle
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
