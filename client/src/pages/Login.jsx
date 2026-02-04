import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { loginSchema } from "../schema/authSchema";
import { loginUser } from "../store/slices/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();

  // التحقق من اتجاه اللغة (هل هي عربية؟)
  const isRtl = i18n.language === 'ar';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));

    if (!res.error) {
      Swal.fire({
        icon: 'success',
        title: t('auth.welcomeBack'), // الترجمة من auth.json
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff'
      });
      navigate("/");
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: t('auth.error'), 
        text: res.payload, // رسالة الخطأ القادمة من السيرفر (Error Middleware)
        background: '#0f172a', 
        color: '#fff' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {t('auth.login')}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} size={20} />
            <input 
              {...register("email")} 
              className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder={t('auth.email')} 
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{t('validation.emailInvalid')}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} size={20} />
            <input 
              type="password" 
              {...register("password")} 
              className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder={t('auth.password')} 
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{t('validation.passwordShort')}</p>}
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><LogIn size={20} className={isRtl ? "rotate-180" : ""}/> {t('auth.login')}</>
            )}
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-400 text-sm">
          {t('auth.noAccount')} <Link to="/register" className="text-blue-400 hover:underline font-medium">{t('auth.register')}</Link>
        </p>
      </motion.div>
    </div>
  );
}