import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, hsl(260, 85%, 20%) 0%, hsl(240, 20%, 8%) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          letterSpacing: '-1px',
          background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Tu Tienda E-commerce de Confianza
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 2.5rem auto'
        }}>
          Explora los últimos productos electrónicos con el mejor soporte y entrega inmediata. Diseñado para tu comodidad.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {/* Al hacer clic acá, viaja a /products y carga las listas separadas */}
          <Link to="/products" className="btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '50px' }}>
            Explorar Catálogo 🚀
          </Link>
        </div>
      </section>

      {/* Categories / Pillars */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2>Categorías Populares</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            /* 👇 Modificado: Nombre y slug adaptados a las descripciones reales de tu base de datos */
            { name: 'Hogar', icon: '🏠', slug: 'Hogar', desc: 'Aires acondicionados, confort y hogar' },
            { name: 'Tecnología', icon: '💻', slug: 'Tecnologia', desc: 'Computadoras, tablets y gadgets' },
            { name: 'Audio', icon: '🎧', slug: 'Audio', desc: 'Auriculares, parlantes y sonido' },
            { name: 'Electrodomésticos', icon: '🔌', slug: 'Electrodomesticos', desc: 'Cocina y artículos eléctricos' }
          ].map((cat) => (
            <Link key={cat.slug} to={`/products?categoria=${cat.slug}`} className="glass-card" style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '2rem 1.5rem'
            }}>
              <span style={{ fontSize: '3rem' }}>{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '3rem'
      }}>
        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>🚚</span>
          <div>
            <h3>Envío Rápido</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Enviamos tus compras de inmediato directamente a tu domicilio.</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <div>
            <h3>Compra Segura</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Todos tus pagos están encriptados y procesados de manera segura.</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>💬</span>
          <div>
            <h3>Soporte 24/7</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Nuestro equipo está listo para ayudarte en cualquier momento del día.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;