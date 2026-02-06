import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerSchema } from '../schema/authSchema';
import { registerUser, resetError } from '../store/slices/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Image as ImageIcon, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [imagePreview, setImagePreview] = useState(null);
  const { t, i18n } = useTranslation();

  // تحديد الاتجاه بناءً على اللغة
  const isRtl = i18n.language === 'ar';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const imgProfile = watch('imgProfile');

  useEffect(() => {
    if (imgProfile && imgProfile[0]) {
      const file = imgProfile[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imgProfile]);

  useEffect(() => {
    return () => { dispatch(resetError()); };
  }, [dispatch]);

  const onSubmit = async (data) => { // 1. Added async
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    if (data.imgProfile?.[0]) {
      formData.append('imgProfile', data.imgProfile[0]);
    }
  
    // 2. Await the dispatch and use .unwrap() to handle errors easily
    try {
      await dispatch(registerUser(formData)).unwrap();
      
      // If it reaches here, it was successful
      Swal.fire({
        icon: 'success',
        title: t('auth.success'),
        text: t('auth.redirecting'),
        timer: 2000,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
      navigate('/login');
      
    } catch (error) {
      // Error is caught here from rejectWithValue
      Swal.fire({
        icon: 'error',
        title: t('auth.error'),
        text: error, // This will be the message from thunkAPI.rejectWithValue
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {t('auth.register')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" encType="multipart/form-data">
          
          {/* Username */}
          <div className="relative">
            <UserIcon className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} size={20} />
            <input
              {...register('username')}
              className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder={t('auth.username')}
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{t('validation.usernameShort')}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} size={20} />
            <input
              {...register('email')}
              className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder={t('auth.email')}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{t('validation.emailInvalid')}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} size={20} />
            <input
              type="password"
              {...register('password')}
              className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder={t('auth.password')}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{t('validation.passwordShort')}</p>}
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <ImageIcon size={18} /> {t('auth.profileImage')}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                {...register('imgProfile')}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-12 w-12 rounded-full object-cover border-2 border-blue-500 shadow-lg animate-in zoom-in" />
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><UserPlus size={20} /> {t('auth.register')}</>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            {t('auth.login')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}