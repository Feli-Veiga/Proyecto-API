import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

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
  "split 3000w": "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=80",
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

const LocalProductCard = ({ product }) => {
  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    backgroundColor: 'var(--border-color)'
  };

  // 🧠 LÓGICA DE SELECCIÓN POR MODELO:
  // Pasamos el nombre entero a minúsculas y buscamos si matchea con alguna clave de nuestro diccionario.
  const nombreMinuscula = product.nombre ? product.nombre.toLowerCase() : '';
  
  // Buscamos cuál de nuestras claves está metida dentro del nombre del producto
  const claveEncontrada = Object.keys(IMAGENES_POR_MODELO).find(modelo => 
    nombreMinuscula.includes(modelo)
  );

  const srcImagen = claveEncontrada ? IMAGENES_POR_MODELO[claveEncontrada] : IMAGEN_GENERICA;

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
          <img src={srcImagen} alt={product.nombre} style={imageStyle} />
          
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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('q') || '';
  const categoryParam = queryParams.get('categoria') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/productos');
        setProducts(response.data || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Asegúrate de que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (searchParam) {
      const query = searchParam.toLowerCase();
      const matchName = product.nombre?.toLowerCase().includes(query);
      const matchDesc = product.descripcion?.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }
    
    if (categoryParam) {
      const cat = categoryParam.toLowerCase();
      const productCategory = product.categoria?.nombre?.toLowerCase() || '';
      if (!productCategory.includes(cat) && product.categoria?.id?.toString() !== cat) {
        return false;
      }
    }
    return true;
  });

  if (loading) return <div style={{ padding: '2rem 0', textAlign: 'center' }}><h2>Cargando catálogo...</h2></div>;
  if (error) return <div style={{ padding: '3rem', textAlign: 'center' }}><h2>Error: {error}</h2></div>;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>
            {searchParam ? `Resultados para "${searchParam}"` : categoryParam ? `Categoría: ${categoryParam}` : 'Catálogo de Productos'}
          </h2>
          <p style={{ margin: 0 }}>Se encontraron {filteredProducts.length} productos</p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <h3>No se encontraron productos</h3>
        </div>
      ) : (
        <div className="grid-auto">
          {filteredProducts.map(product => (
            <LocalProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;