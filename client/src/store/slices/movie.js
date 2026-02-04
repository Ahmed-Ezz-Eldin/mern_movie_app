import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api/axios';
import i18next from 'i18next';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (lang = 'en', { rejectWithValue }) => {
    try {
      const res = await api.get(`/movies?lang=${lang}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addMovie = createAsyncThunk(
  'movies/addMovie',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // or your auth logic
      const response = await api.post('/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      await api.delete(`/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/movies/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const movieSlice = createSlice({
  name: 'movies',
  initialState: { movies: [], loading: false, error: null, lang: 'en' },
  reducers: {
    setLang: (state, action) => {
      state.lang = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter(
          (movie) => movie._id !== action.payload
        );
      })

      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex(
          (m) => m._id === action.payload._id
        );
        
        if (index !== -1) {
          // استخراج اللغة الحالية (ar أو en)
          const currentLang = i18next.language || 'en';
          
          // تحويل البيانات الكاملة العائدة من السيرفر إلى الشكل المختصر المعتاد في الصفحة الرئيسية
          const updatedMovieFormatted = {
            ...action.payload,
            title: action.payload.title[currentLang] || action.payload.title['en'],
            desc: action.payload.desc[currentLang] || action.payload.desc['en'],
          };
      
          state.movies[index] = updatedMovieFormatted;
        }
      });
  },
});

export const { setLang } = movieSlice.actions;
export default movieSlice.reducer;
