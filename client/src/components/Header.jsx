import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/slices/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { serverAPI } from '../api/axios';
import { 
  Languages, 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon, 
  Menu, 
  X, 
  Film 
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);

  };


  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-blue-600 to-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Film className="text-white" size={24} />
            </div>
            <span className="text-xl font-black bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
              MOVIE<span className="text-blue-500">HUB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              <Languages size={18} />
              {i18n.language.toUpperCase()}
            </button>

            {user ? (
              <div className="flex items-center gap-4 border-l border-slate-800 pl-6 rtl:border-l-0 rtl:border-r rtl:pr-6">
                {user.role === 'admin' && (
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${location.pathname === '/dashboard' ? 'text-blue-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    <LayoutDashboard size={18} />
                    {t('movies.dashboard') || 'Dashboard'}
                  </Link>
                )}
                
                <div className="flex items-center gap-3 bg-slate-900/50 p-1 pr-3 rtl:pr-1 rtl:pl-3 rounded-full border border-slate-800">
                  <img
                    src={user.imgProfile ? `${serverAPI}/${user.imgProfile}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border border-blue-500/50"
                  />
                  <span className="text-sm font-medium text-slate-200">{user.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title={t('auth.logout')}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  {t('auth.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-900/20"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {user && (
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <img
                    src={user.imgProfile ? `${serverAPI}/${user.imgProfile}` : '/default-avatar.png'}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <div>
                    <p className="font-bold">{user.username}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              )}
              <button onClick={toggleLang} className="flex items-center gap-2 w-full text-slate-300">
                <Languages size={20} /> {i18n.language === 'en' ? 'العربية' : 'English'}
              </button>
              {user?.role === 'admin' && (
                <Link to="/dashboard" className="block text-slate-300"><LayoutDashboard size={20} className="inline mr-2"/> Dashboard</Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="flex items-center gap-2 w-full text-red-400">
                  <LogOut size={20} /> {t('auth.logout')}
                </button>
              ) : (
                <>
                  <Link to="/login" className="block text-slate-300">{t('auth.login')}</Link>
                  <Link to="/register" className="block text-blue-400 font-bold">{t('auth.register')}</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}