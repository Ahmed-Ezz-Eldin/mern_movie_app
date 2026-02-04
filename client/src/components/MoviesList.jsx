import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMovie, fetchMovies } from '../store/slices/movie';
import { useTranslation } from 'react-i18next';
import { serverAPI } from '../api/axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import MovieCard from './MovieCard';

const MoviesList = () => {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const { movies, loading, error } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMovies(i18n.language));
  }, [dispatch, i18n.language]);

  const handleDelete = useCallback((movieId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it!',
      background: '#0f172a',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteMovie(movieId));
      }
    });
  }, [dispatch]);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 py-12">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700"
          />
        ))}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-white">
          Featured <span className="text-blue-500">Movies</span>
        </h2>
        {user?.role === 'admin' && (
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl font-bold text-white hover:bg-blue-500 transition-all"
          >
            <Plus size={20} /> Add Movie
          </Link>
        )}
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {movies?.map((movie, index) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              index={index}
              user={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-20">No movies found.</p>
      )}
    </div>
  );
};

export default MoviesList;
