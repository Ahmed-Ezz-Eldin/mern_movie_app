import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../api/axios";

export const fetchMovieDetails = createAsyncThunk(
  "movieDetails/fetchMovieDetails",
  async ({ id, lang }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/movies/${id}?lang=${lang}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const movieDetailsSlice = createSlice({
  name: "movieDetails",
  initialState: {
    movie: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMovie: (state) => {
      state.movie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMovie } = movieDetailsSlice.actions;
export default movieDetailsSlice.reducer;
