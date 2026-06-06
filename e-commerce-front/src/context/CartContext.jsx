import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al parsear el carrito del localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    let success = false;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`No puedes agregar más unidades. El stock máximo es de ${product.stock}`);
          success = false;
          return prevItems;
        }
        success = true;
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      success = true;
      return [...prevItems, { ...product, quantity }];
    });
    return success;
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
  };

  const checkoutCart = async (usuarioId, email, numeroTarjeta, cvv, fechaVencimiento) => {
    setLoading(true);
    try {
      const payload = {
        usuarioId: usuarioId || null,
        email: email,
        datosEnvio: { calle: "Sin especificar", codigoPostal: "0000" },
        items: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.quantity
        }))
      };
      await api.post(
        `/api/compras?numeroTarjeta=${numeroTarjeta}&cvv=${cvv}&fechaVencimiento=${encodeURIComponent(fechaVencimiento)}`,
        payload
      );
      clearCart();
      return true;
    } catch (error) {
      console.error('Error en checkout:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems,
      loading,
      addToCart, 
      removeFromCart, 
      clearCart, 
      getCartTotal,
      checkoutCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);