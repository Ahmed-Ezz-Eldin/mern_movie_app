import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { serverAPI } from "../api/axios"; // تأكد من المسار الصحيح لملف الأكسيوس

const MovieCard = memo(({ movie, index, user, onDelete }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl"
        >
            {/* Image & Link */}
            <Link to={`/movie/${movie._id}`} className="block overflow-hidden aspect-[2/3]">
                <img
                    src={movie.posterImg.url}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </Link>

            {/* Admin Tools Overlay */}
            {user?.role === 'admin' && (
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <Link
                        to={`/movie/edit/${movie._id}`}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow-lg"
                    >
                        <Edit size={18} />
                    </Link>
                    <button
                        onClick={() => onDelete(movie._id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 shadow-lg cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}

            {/* Info Section */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-white truncate">{movie.title}</h3>
                <p className="text-slate-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                    {movie.desc}
                </p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-blue-400 font-black text-lg">${movie.price}</span>
                    <Link 
                        to={`/movie/${movie._id}`} 
                        className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
                    >
                        Details →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
});

export default MovieCard;