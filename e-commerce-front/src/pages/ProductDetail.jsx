import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

// 📸 FALLBACK ABSOLUTO (Por si algún modelo no se encuentra)
const IMAGEN_GENERICA = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80";

// 🖼️ MAPEO EXACTO BASADO EN LOS MODELOS DE TU SCRIPT DE PYTHON
const IMAGENES_POR_MODELO = {
  // --- Celulares ---
  "s24 ultra": "https://images.unsplash.com/photo-1715014798606-bd58045f06be?w=600&auto=format&fit=crop&q=80",
  "s24+": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
  "a55": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
  "z fold 5": "https://images.unsplash.com/photo-1678911820864-a2c968726500?w=600&auto=format&fit=crop&q=80",
  "a34": "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=600&auto=format&fit=crop&q=80",
  "iphone 15 pro": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
  "iphone 15": "https://images.unsplash.com/photo-1695048132845-685223c26511?w=600&auto=format&fit=crop&q=80",
  "iphone 14": "https://images.unsplash.com/photo-1663499482523-1c0c1ebe4cc2?w=600&auto=format&fit=crop&q=80",
  "iphone 13": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&auto=format&fit=crop&q=80",
  "14 ultra": "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=600&auto=format&fit=crop&q=80",
  "redmi note 13": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
  "poco x6": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
  "13t": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",

  // --- Computadoras & Notebooks ---
  "thinkpad x1": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
  "ideapad 3": "https://images.unsplash.com/photo-1603302576837-37561b2fe536?w=600&auto=format&fit=crop&q=80",
  "legion 5": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
  "yoga 9i": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
  "zenbook 14": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
  "tuf gaming": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80",
  "rog strix": "https://images.unsplash.com/photo-1603302576837-37561b2fe536?w=600&auto=format&fit=crop&q=80",
  "vivobook": "https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&auto=format&fit=crop&q=80",
  "spectre x360": "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600&auto=format&fit=crop&q=80",
  "pavilion": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
  "victus": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80",
  "envy": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
  "inspiron 15": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
  "xps 13": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
  "aspire 5": "https://images.unsplash.com/photo-1603302576837-37561b2fe536?w=600&auto=format&fit=crop&q=80",
  "nitro 5": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80",
  "katana": "https://images.unsplash.com/photo-1603302576837-37561b2fe536?w=600&auto=format&fit=crop&q=80",
  "stealth": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80",

  // --- Monitores ---
  "ultragear 27": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
  "ergo 32": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
  "ultrawide 34": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
  "odyssey g9": "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
  "viewfinity s8": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",

  // --- Tablets ---
  "galaxy tab s9": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  "galaxy tab a9": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  "ipad air": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  "ipad pro": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  "tab p12": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  "tab m10": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",

  // --- Auriculares ---
  "wh-1000xm5": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
  "wf-1000xm5": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
  "tune 770": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  "live 660": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  "g733": "https://images.unsplash.com/photo-1606220532402-13110093177c?w=600&auto=format&fit=crop&q=80",
  "g435": "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&auto=format&fit=crop&q=80",

  // --- Smartwatches ---
  "watch series 9": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
  "watch ultra": "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80",
  "watch 6": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  "watch 6 classic": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  "watch s3": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
  "mi watch": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",

  // --- Impresoras ---
  "laserjet m110": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "deskjet 2775": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "l3250": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "l4260": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "g3110": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "g6010": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",

  // --- Teclados & Mouses ---
  "mx keys": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  "g915": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
  "k552": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
  "k530": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
  "alloy origins": "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=600&auto=format&fit=crop&q=80",
  "alloy core": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
  "g502": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  "mx master 3s": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  "deathadder v3": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  "basilisk": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  "pulsefire haste": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  "pulsefire dart": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",

  // --- Hogar (Heladeras, TVs, Aires) ---
  "rs65": "https://images.unsplash.com/photo-1571175432247-52319dfa2088?w=600&auto=format&fit=crop&q=80",
  "rt38": "https://images.unsplash.com/photo-1571175432247-52319dfa2088?w=600&auto=format&fit=crop&q=80",
  "side-by-side inox": "https://images.unsplash.com/photo-1571175432247-52319dfa2088?w=600&auto=format&fit=crop&q=80",
  "wro85": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
  "wrm44": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
  "wrx50": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
  "instaview": "https://images.unsplash.com/photo-1571175432247-52319dfa2088?w=600&auto=format&fit=crop&q=80",
  "top mount": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
  "oled c3": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "nanocell 55": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "qned 80": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "crystal uhd": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "the frame": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "neo qled": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "bravia xr": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "a80l": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
  "Split 3000W": "https://magnoliapublic.newsan.com.ar/.imaging/mte/optimization-theme/1600/dam/dam-electronica/noblex/aire-acondicionado/aire-acondicionado-residencial/split-inverter/NXIN35HA3BN/NXIN35HA3BNI-NXIN52HA3BNI-NXIN64HA3BNI.JPG/jcr:content/NXIN35HA3BNI-NXIN52HA3BNI-NXIN64HA3BNI.JPG",
  "inverter 4500w": "https://www.evvohome.com/cdn/shop/articles/portada_climawifi.png?v=1738651791&width=2048",
  "windfree 3000": "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=80",
  "digital inverter": "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=80",

  // --- Indumentaria (Zapatillas & Remeras) ---
  "air max 90": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  "revolution 6": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  "pegasus 40": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
  "air force 1": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
  "ultraboost": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
  "superstar": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
  "gazelle": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
  "dunk": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
  "rs-x": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  "caven 2.0": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
  "palermo": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
  "classic fit": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  "graphic tee": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  "polo slim": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80",
  "casual v-neck": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "basic oversize": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  "premium cotton": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
};

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

  // 🧠 LÓGICA DE SELECCIÓN POR MODELO REUTILIZADA DESDE PRODUCTLIST
  const nombreMinuscula = product.nombre ? product.nombre.toLowerCase() : '';
  const claveEncontrada = Object.keys(IMAGENES_POR_MODELO).find(modelo => 
    nombreMinuscula.includes(modelo)
  );
  const srcImagen = claveEncontrada ? IMAGENES_POR_MODELO[claveEncontrada] : IMAGEN_GENERICA;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* 📸 Ahora renderiza dinámicamente según el modelo matched */}
          <img 
            src={srcImagen} 
            alt={product.nombre} 
            style={{
              width: '100%',
              maxHeight: '450px',
              objectFit: 'contain',
              borderRadius: '12px'
            }} 
          />
        </div>

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
                ${product.precio?.toLocaleString('es-AR')}
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