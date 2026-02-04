import React from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-[#020617]/80 via-transparent to-[#020617]/80" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-5xl px-6 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight">
            {isRtl ? 'اكتشف عالم ' : 'Unlimited '}
            <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {isRtl ? 'الأفلام ' : 'Movies '}
            </span>
            {isRtl ? 'بلا حدود' : '& TV Shows'}
          </h1>
          <p className="mt-4 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
            {isRtl 
              ? 'شاهد أحدث الأفلام الحصرية بجودة عالية. استمتع بتجربة سينمائية فريدة من نوعها.' 
              : 'Watch anywhere. Cancel anytime. Dive into the largest library of cinematic masterpieces.'}
          </p>
        </motion.div>

        {/* Professional Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative flex items-center bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Search className={`text-slate-400 mx-3 ${isRtl ? 'order-last' : ''}`} size={24} />
            <input 
              type="text" 
              placeholder={isRtl ? "ابحث عن فيلمك المفضل..." : "Search for your next adventure..."}
              className="w-full bg-transparent border-none text-white py-3 px-2 focus:outline-none placeholder:text-slate-500"
            />
            <button className="hidden sm:block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40">
              {isRtl ? 'بحث' : 'Search'}
            </button>
          </div>
        </motion.div>

        {/* CTA Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all transform hover:-translate-y-1">
            <Play fill="currentColor" size={20} />
            {isRtl ? 'ابدأ المشاهدة' : 'Get Started'}
          </button>
          <button className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md text-white border border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all transform hover:-translate-y-1">
            <Info size={20} />
            {isRtl ? 'المزيد من المعلومات' : 'More Info'}
          </button>
        </motion.div>
      </div>

      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent z-10" />
    </section>
  );
}