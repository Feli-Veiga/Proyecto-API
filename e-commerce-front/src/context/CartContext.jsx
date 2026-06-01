import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga inicial del carrito desde el backend usando el ID en localStorage
  useEffect(() => {
    const fetchCart = async () => {
      const carritoId = localStorage.getItem('carritoId');
      if (carritoId) {
        setLoading(true);
        try {
          const response = await api.get(`/api/carrito/${carritoId}`);
          if (response.data && response.data.items) {
            setCartItems(mapBackendItems(response.data.items));
          }
        } catch (err) {
          console.error('Error al cargar el carrito:', err);
          // Si el carrito no existe en la BD (ej. se borró la base de datos), limpiamos el localStorage
          if (err.response?.status === 404 || err.response?.status === 500) {
            localStorage.removeItem('carritoId');
            setCartItems([]);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [isAuthenticated]); // Recargar si cambia el estado de autenticación

  // Helper para mapear el formato de ItemCarrito del backend a la estructura plana del profesor
  const mapBackendItems = (items) => {
    return items.map(item => ({
      id: item.id, // ID de la fila ItemCarrito (sirve para eliminar)
      productId: item.producto.id,
      nombre: item.producto.nombre,
      imagen: item.producto.imagen,
      precio: item.producto.precio,
      quantity: item.cantidad, // Compatible con "item.quantity" del profesor
      stock: item.producto.stock
    }));
  };

  // Obtener o crear un ID de carrito
  const getOrCreateCarritoId = async () => {
    let carritoId = localStorage.getItem('carritoId');
    if (!carritoId) {
      const response = await api.post('/api/carrito');
      carritoId = response.data.id;
      localStorage.setItem('carritoId', carritoId);
    }
    return carritoId;
  };

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const carritoId = await getOrCreateCarritoId();
      const response = await api.post(`/api/carrito/${carritoId}/producto/${product.id}?cantidad=${quantity}`);
      if (response.data && response.data.items) {
        setCartItems(mapBackendItems(response.data.items));
      }
      return true;
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      setError(err.response?.data?.message || 'Error al agregar el producto.');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un ítem del carrito (usa el item.id del ItemCarrito)
  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    const carritoId = localStorage.getItem('carritoId');
    if (!carritoId) return;

    try {
      const response = await api.delete(`/api/carrito/${carritoId}/item/${itemId}`);
      if (response.data && response.data.items) {
        setCartItems(mapBackendItems(response.data.items));
      }
    } catch (err) {
      console.error('Error al eliminar del carrito:', err);
      setError(err.response?.data?.message || 'Error al eliminar el ítem.');
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    const carritoId = localStorage.getItem('carritoId');
    if (!carritoId) return;

    try {
      const response = await api.post(`/api/carrito/${carritoId}/vaciar`);
      if (response.data) {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error al vaciar el carrito:', err);
      setError(err.response?.data?.message || 'Error al vaciar el carrito.');
    } finally {
      setLoading(false);
    }
  };

  // Checkout (procesar compra)
  const checkoutCart = async () => {
    setLoading(true);
    setError(null);
    const carritoId = localStorage.getItem('carritoId');
    if (!carritoId) return false;

    try {
      await api.post(`/api/carrito/${carritoId}/checkout`);
      // Al hacer checkout con éxito, el backend limpia los ítems y actualiza stock.
      // Limpiamos en el frontend también
      setCartItems([]);
      localStorage.removeItem('carritoId');
      return true;
    } catch (err) {
      console.error('Error en checkout:', err);
      setError(err.response?.data?.message || 'Error al procesar el pago.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calcular total de la compra en el frontend (para evitar latencias de red)
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      error, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      checkoutCart, 
      getCartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
