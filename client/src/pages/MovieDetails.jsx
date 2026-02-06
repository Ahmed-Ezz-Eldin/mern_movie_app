import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, clearMovie } from '../store/slices/details';
import { addReview } from '../store/slices/review'; // Import the action
import { useTranslation } from 'react-i18next';
import {
  Star,
  Play,
  DollarSign,
  Calendar,
  Info,
  MessageSquare,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { serverAPI } from '../api/axios';
import { MySwal } from '../utils/swalConfig';

export default function MovieDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();

  const { movie, loading, error } = useSelector((state) => state.movieDetails);
  const { user } = useSelector((state) => state.auth);
  const { loading: reviewLoading } = useSelector((state) => state.reviews);

  // Local state for the review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchMovieDetails({ id, lang: i18n.language }));
    return () => {
      dispatch(clearMovie());
    };
  }, [dispatch, id, i18n.language]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user)
      return MySwal.fire('Error', 'Please login to leave a review', 'error');
    if (!comment.trim()) return;

    const result = await dispatch(addReview({ movieId: id, rating, comment }));

    if (addReview.fulfilled.match(result)) {
      setComment('');
      setRating(5);
      MySwal.fire({
        title: 'Success',
        text: 'Review added!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      // Refresh movie details to show the new review
      dispatch(fetchMovieDetails({ id, lang: i18n.language }));
    } else {
      MySwal.fire('Error', result.payload, 'error');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden pb-20">
      {/* Background Section with Mask */}

      <div className="relative h-[70vh] w-full">
        <img
          src={movie.posterImg.url}
          className="w-full h-full object-cover opacity-20 blur-sm scale-110"
          alt="backdrop"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/80 to-transparent" />

        {/* Content Overlay */}

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full grid md:grid-cols-3 gap-12 items-center">
            {/* Poster with Animation */}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:block"
            >
              <img
                src={movie.posterImg.url}
                className="w-full rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.2)] border border-slate-700/50"
                alt={movie.title}
              />
            </motion.div>

            {/* Info Section */}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-2 space-y-6 text-center md:text-left rtl:md:text-right"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {movie.title}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-300 font-medium">
                <span className="flex items-center gap-2 text-yellow-500">
                  <Star size={20} fill="currentColor" /> {movie.rating || 0}
                </span>

                <span className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-500" />{' '}
                  {movie.price}
                </span>

                <span className="flex items-center gap-2">
                  <Calendar size={20} className="text-blue-500" />{' '}
                  {new Date(movie.createdAt).getFullYear()}
                </span>
              </div>

              <p className="text-xl text-slate-300 leading-relaxed font-light">
                {movie.desc}
              </p>

              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <button className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-blue-900/40">
                  <Play fill="currentColor" size={20} />{' '}
                  {t('watch_now') || 'Watch Now'}
                </button>

                <button className="bg-slate-800/50 backdrop-blur-md hover:bg-slate-700 px-10 py-4 rounded-xl font-bold flex items-center gap-3 border border-slate-700 transition-all">
                  <Info size={20} /> {t('add_to_list') || 'Add to List'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-6 py-10"
      >
        <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <video
            src={movie.videoUrl.url}
            controls
            className="w-full h-full object-contain"
            poster={movie.posterImg.url}
          />
        </div>
      </motion.div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="md:col-span-1">
          <div className="sticky top-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="text-blue-500" />{' '}
              {t('add_review') || 'Write a Review'}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-all ${
                        rating >= star ? 'text-yellow-500' : 'text-slate-600'
                      }`}
                    >
                      <Star
                        size={24}
                        fill={rating >= star ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Your Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think of the movie?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  rows="4"
                />
              </div>

              <button
                disabled={reviewLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {reviewLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Post Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold mb-6">
            User Reviews ({movie.reviews?.length || 0})
          </h3>

          <div className="space-y-4">
            <AnimatePresence>
              {movie.reviews?.length > 0 ? (
                movie.reviews.map((review, idx) => (
                  <motion.div
                    key={review._id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
  {/* حاوية الصورة الشخصية */}
  <div className="w-12 h-12 rounded-full border-2 border-blue-500 overflow-hidden bg-slate-800 flex items-center justify-center relative shadow-inner">
    {review.user?.imgProfile ? (
      <img
        src={review.user.imgProfile.url}
        className="w-full h-full object-cover z-10"
        alt={review.user.username}
        onError={(e) => {
          e.target.style.display = 'none'; // إخفاء الصورة تماماً إذا فشل التحميل
          e.target.nextSibling.style.display = 'flex'; // إظهار الحرف
        }}
      />
    ) : null}

    {/* الحرف البديل: يظهر فقط إذا لم تكن هناك صورة أصلاً أو فشل تحميلها */}
    <div
      className={`absolute inset-0 items-center justify-center font-bold text-blue-500 bg-slate-800 ${
        review.user?.imgProfile ? 'hidden' : 'flex'
      }`}
      style={{ zIndex: 5 }}
    >
      {review.user?.username?.charAt(0).toUpperCase() || 'U'}
    </div>
  </div>

  <div>
    <p className="font-bold text-white">
      {review.user?.username || 'Anonymous'}
    </p>
    <p className="text-xs text-slate-500">
      {new Date(review.createdAt).toLocaleDateString()}
    </p>
  </div>
</div>
                      <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg text-sm font-bold">
                        <Star size={14} fill="currentColor" /> {review.rating}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                  No reviews yet. Be the first to review!
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
