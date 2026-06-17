import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const token = localStorage.getItem('token');
const savedAuth = localStorage.getItem('isAuthenticated') === 'true';

const initialState = {
  user: token && savedAuth ? { email: localStorage.getItem('userEmail') || 'usuario@uade.edu.ar' } : null,
  isAuthenticated: !!(token && savedAuth),
  loading: false,
  error: null
};

// AsyncThunk para el Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', credentials.email);
        
        return { email: credentials.email };
      } else {
        throw new Error('No se recibió el token de acceso');
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Credenciales inválidas. Por favor intente de nuevo.');
    }
  }
);

// AsyncThunk para el Registro (con Login automático)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/usuarios', userData);
      if (response.data) {
        // Ejecuta el login automático si el registro fue exitoso
        const loginResult = await dispatch(loginUser({ email: userData.email, password: userData.password }));
        if (loginUser.fulfilled.match(loginResult)) {
          return loginResult.payload;
        } else {
          return rejectWithValue(loginResult.payload);
        }
      }
      return rejectWithValue('Error al registrar el usuario.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error al registrar el usuario.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('carritoId');
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Hooks
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Hooks
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;