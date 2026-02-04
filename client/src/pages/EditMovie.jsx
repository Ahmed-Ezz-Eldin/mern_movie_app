import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Save, Image as ImageIcon, Video, ArrowLeft, RefreshCw } from 'lucide-react';
import { movieSchema } from '../schema/movieSchema';
import { updateMovie } from '../store/slices/movie';
import api, { serverAPI } from '../api/axios';
import { MySwal } from '../utils/swalConfig';

const EditMovie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.movies);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty }, // Added isValid and isDirty
  } = useForm({
    resolver: zodResolver(movieSchema),
    mode: "onChange", // 👈 This ensures the 'isValid' state is calculated on every keystroke
  });

  const posterFile = watch('posterImg');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const movie = res.data;

        // 👈 Filling inputs with default values
        reset({
          titleEn: movie.title?.en || '',
          titleAr: movie.title?.ar || '',
          descEn: movie.desc?.en || '',
          descAr: movie.desc?.ar || '',
          price: movie.price,
        });

        setPreview(`${serverAPI}/${movie.posterImg}`);
        setFetching(false);
      } catch (err) {
        MySwal.fire('Error', 'Could not load movie data', 'error');
        navigate('/');
      }
    };
    getMovieData();
  }, [id, reset, navigate]);

  useEffect(() => {
    if (posterFile?.[0]) {
      const url = URL.createObjectURL(posterFile[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [posterFile]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title.en', data.titleEn);
    formData.append('title.ar', data.titleAr);
    formData.append('desc.en', data.descEn);
    formData.append('desc.ar', data.descAr);
    formData.append('price', data.price);

    if (data.posterImg?.[0]) formData.append('posterImg', data.posterImg[0]);
    if (data.videoUrl?.[0]) formData.append('videoUrl', data.videoUrl[0]);

    const result = await dispatch(updateMovie({ id, formData }));

    if (updateMovie.fulfilled.match(result)) {
      MySwal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Movie details saved successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(`/movie/${id}`);
    } else {
      MySwal.fire('Update Failed', result.payload, 'error');
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-blue-500">
        <RefreshCw className="animate-spin" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-900/60">
           <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
               <ArrowLeft />
             </button>
             <h2 className="text-3xl font-black">Edit <span className="text-blue-500">Movie</span></h2>
           </div>
           <Edit3 className="text-slate-700" size={32} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Title (EN)</label>
                <input {...register('titleEn')} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                {errors.titleEn && <p className="text-red-500 text-xs">{errors.titleEn.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">العنوان (AR)</label>
                <input {...register('titleAr')} dir="rtl" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                {errors.titleAr && <p className="text-red-500 text-xs">{errors.titleAr.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Descriptions</label>
              <textarea {...register('descEn')} rows="2" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="EN Description" />
              <textarea {...register('descAr')} rows="2" dir="rtl" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="الوصف بالعربية" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Price ($)</label>
              <input type="number" {...register('price', { valueAsNumber: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-800 aspect-video bg-slate-950">
              {preview && <img src={preview} className="w-full h-full object-cover opacity-60" alt="Preview" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20">
                <ImageIcon className="text-white mb-2" />
                <span className="text-xs font-bold text-white uppercase">Replace Poster</span>
              </div>
              <input type="file" {...register('posterImg')} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3"><Video className="text-blue-500" /> <span className="text-sm text-slate-400">Video Content</span></div>
              <input type="file" {...register('videoUrl')} accept="video/*" className="text-xs w-32" />
            </div>

            {/* 👈 UPDATED BUTTON LOGIC */}
            <button
              type="submit"
              disabled={loading || !isValid} 
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all ${
                !isValid 
                  ? 'bg-slate-800 cursor-not-allowed opacity-50' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
              }`}
            >
              {loading ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <>
                  <Save size={20} /> Update Movie
                </>
              )}
            </button>
            {!isValid && <p className="text-center text-xs text-slate-500 italic">Please ensure all fields are correctly filled to enable update.</p>}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditMovie;