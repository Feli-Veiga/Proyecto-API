import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { getProductImage } from '../utils/productImage';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const categorias = [
    { id: 1, nombre: 'Tecnologia' },
    { id: 2, nombre: 'Hogar' },
    { id: 3, nombre: 'Indumentaria' },
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: '',
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoriaId) {
      setError('Seleccioná una categoría');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/api/productos', {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        categoria: { id: parseInt(form.categoriaId) },
        usuario: { id: user?.id },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card fade-in" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <h2 style={{ color: 'var(--success-color, #22c55e)', marginBottom: '1rem' }}>¡Producto creado!</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => { setSuccess(false); setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '' }); }} className="btn-secondary">
            Crear otro
          </button>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  const previewImage = form.nombre ? getProductImage(form.nombre) : null;

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Crear Producto</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

        <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {error && (
            <div style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--error-color)', borderRadius: '6px', color: 'var(--error-color)', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              className="form-input"
              placeholder="ej: iPhone 13"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Descripción</label>
            <textarea
              name="descripcion"
              className="form-input"
              placeholder="Descripción del producto"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Precio ($)</label>
              <input
                type="number"
                name="precio"
                required
                min="0"
                step="0.01"
                className="form-input"
                placeholder="50000"
                value={form.precio}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Stock</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                className="form-input"
                placeholder="10"
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Categoría</label>
            <select
              name="categoriaId"
              className="form-input"
              value={form.categoriaId}
              onChange={handleChange}
            >
              <option value="">Seleccioná una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
        </form>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vista previa de imagen</span>
          <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'hsl(240,15%,8%)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewImage ? (
              <img src={previewImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Escribí el nombre para ver la imagen</span>
            )}
          </div>
          {form.nombre && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              La imagen se asigna automáticamente según el nombre del producto
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateProduct;
