import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      marginTop: 'auto',
      backgroundColor: 'hsl(240, 20%, 6%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          © {new Date().getFullYear()} UADE - Materia: Aplicaciones Interactivas. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
