// frontend/src/Store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Safe localStorage parsing
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('helpdesk_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    localStorage.removeItem('helpdesk_user');
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  role: localStorage.getItem('helpdesk_role') || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      authService.logout();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload.user || {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role
        };
        state.role = action.payload.role;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.role = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.role = null;
      });
  }
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;