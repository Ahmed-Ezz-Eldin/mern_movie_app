import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, thunkAPI) => {
    try {
      const res = await api.post('/auth/signin', data);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/auth/signup', formData);
      return response.data; // 👈 MUST return this for .fulfilled
    } catch (err) {
      console.log(err);
      // Ensure we grab the actual message from the server error
      const message = err.response?.data?.message || err.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. التعامل مع نجاح تسجيل الدخول
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      // 2. التعامل مع نجاح التسجيل (فقط إيقاف التحميل)
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      // 3. استخدام isAnyOf لتوحيد حالات الـ Pending (الانتظار)
      .addMatcher(isAnyOf(loginUser.pending, registerUser.pending), (state) => {
        state.loading = true;
        state.error = null;
      })

      // 4. استخدام isAnyOf لتوحيد حالات الـ Rejected (الأخطاء)
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;
