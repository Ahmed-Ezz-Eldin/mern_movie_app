import { configureStore } from '@reduxjs/toolkit';
import settingsSlice from '../store/slices/settings';
import moviesSlice from '../store/slices/movie';
import authSlice from '../store/slices/auth';
import movieDetails from '../store/slices/details';
import reviewSlice from "../store/slices/review"
export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    movies: moviesSlice,
    auth: authSlice,
    movieDetails,
    reviews: reviewSlice
  },
});
