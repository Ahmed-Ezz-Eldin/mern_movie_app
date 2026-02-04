import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Upload, Film, DollarSign, Languages, AlertCircle, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2'; // استيراد SweetAlert2

import { movieSchema } from '../schema/movieSchema';
import { addMovie } from '../store/slices/movie';

const AddMovieForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.movies);
  const [previews, setPreviews] = useState({ poster: null, video: null });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(movieSchema),
  });

  const posterFile = watch('posterImg');
  const videoFile = watch('videoUrl');

  useMemo(() => {
    if (posterFile?.[0])
      setPreviews((p) => ({
        ...p,
        poster: URL.createObjectURL(posterFile[0]),
      }));
    if (videoFile?.[0])
      setPreviews((p) => ({ ...p, video: videoFile[0].name }));
  }, [posterFile, videoFile]);

  const onSubmit = async (data) => {
    // إظهار نافذة تحميل (Loading)
    Swal.fire({
      title: 'Uploading Movie...',
      text: 'Please wait while we process the files.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#0f172a',
      color: '#fff',
    });

    const formData = new FormData();
    formData.append('title.en', data.titleEn);
    formData.append('title.ar', data.titleAr);
    formData.append('desc.en', data.descEn);
    formData.append('desc.ar', data.descAr);
    formData.append('price', data.price);
    formData.append('posterImg', data.posterImg[0]);
    formData.append('videoUrl', data.videoUrl[0]);

    const resultAction = await dispatch(addMovie(formData));

    if (addMovie.fulfilled.match(resultAction)) {
      // إغلاق نافذة التحميل وإظهار النجاح
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'The movie has been added successfully.',
        timer: 3000,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
        iconColor: '#3b82f6',
      });
      reset();
      setPreviews({ poster: null, video: null });
    } else {
      // إظهار الخطأ
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: resultAction.payload || 'Something went wrong!',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  // ... باقي كود الـ JSX الخاص بالنموذج (Form) كما هو في الرد السابق
  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
  

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
          <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-500">
            <Film size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Add New Movie</h2>
            <p className="text-slate-400 text-sm">
              Upload cinematic masterpieces to your library
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column: Text Data */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <Languages size={16} /> Titles
              </label>
              <input
                {...register('titleEn')}
                placeholder="Title (English)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
              {errors.titleEn && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.titleEn.message}
                </p>
              )}

              <input
                {...register('titleAr')}
                placeholder="العنوان (بالعربية)"
                dir="rtl"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-arabic"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                Descriptions
              </label>
              <textarea
                {...register('descEn')}
                rows="3"
                placeholder="Description (English)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
              />
              <textarea
                {...register('descAr')}
                rows="3"
                dir="rtl"
                placeholder="الوصف (بالعربية)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none font-arabic"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <DollarSign size={16} /> Pricing
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right Column: Media Uploads */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-300 block">
                Poster Image
              </label>
              <div className="relative h-64 w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-blue-500/50 transition-colors">
                {previews.poster ? (
                  <img
                    src={previews.poster}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-slate-600 mb-2" />
                    <p className="text-xs text-slate-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  {...register('posterImg')}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-300 block">
                Video File
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <Film className="text-blue-500" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-slate-400 truncate">
                    {previews.video || 'No video selected'}
                  </p>
                </div>
                <input
                  type="file"
                  {...register('videoUrl')}
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Choose
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Upload Movie <CheckCircle2 size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export  default AddMovieForm