import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  loading: false,
  error: null
};

// Acción asíncrona para procesar el Checkout
export const checkoutCart = createAsyncThunk(
  'cart/checkoutCart',
  async ({ usuarioId, email, numeroTarjeta, cvv, fechaVencimiento }, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const payload = {
        usuarioId: usuarioId || null,
        email: email,
        datosEnvio: { calle: "Sin especificar", codigoPostal: "0000" },
        items: cart.cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.quantity
        }))
      };
      
      await api.post(
        `/api/compras?numeroTarjeta=${numeroTarjeta}&cvv=${cvv}&fechaVencimiento=${encodeURIComponent(fechaVencimiento)}`,
        payload
      );
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al procesar el pago.');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`No puedes agregar más unidades. El stock máximo es de ${product.stock}`);
          return;
        }
        existingItem.quantity = newQuantity;
      } else {
        state.cartItems.push({ ...product, quantity });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        localStorage.removeItem('cartItems');
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;