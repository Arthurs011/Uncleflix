import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../utils/tmdb';
import { Play, Star } from 'lucide-react';

const Card = ({ item, type, progress, className = '' }) => {
  const itemType = item.type || type;
  const title = item.title || item.name || 'Unknown';
  const poster = item.poster_path ? IMAGE_BASE_URL + item.poster_path : null;
  const id = item.id;
  const rating = item.vote_average?.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.18 }}
      className={`group relative flex-shrink-0 cursor-pointer touch-manipulation ${
        className || 'w-[30vw] min-w-[100px] max-w-[140px] sm:w-32 sm:max-w-none md:w-40 lg:w-44 xl:w-48'
      }`}
    >
      <Link to={`/watch/${itemType}/${id}`} className="block" aria-label={`Play ${title}`}>
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.28)] group-hover:border-cyan-400/35 border border-transparent">
          {poster ? (
            <>
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-70 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-accent/30 to-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-accent/50">?</span>
            </div>
          )}

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm text-glow px-1.5 py-0.5 rounded-md text-[10px] font-bold border border-glow/20">
              <Star size={8} fill="currentColor" className="text-glow" />
              {rating}
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-accent/85 text-white text-[10px] font-bold uppercase tracking-wide">
            {itemType === 'movie' ? 'M' : 'TV'}
          </div>

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-xl scale-80 group-hover:scale-100 transition-transform duration-200">
              <Play size={15} fill="#0B0F1A" className="text-primary ml-0.5" />
            </div>
          </div>

          {/* Title on hover (desktop) */}
          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <h3 className="font-bold text-xs line-clamp-2 leading-tight text-white">{title}</h3>
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          )}
        </div>

        {/* Title below card */}
        <div className="mt-1.5 px-0.5">
          <p className="text-[11px] md:text-xs text-gray-400 font-medium line-clamp-1 group-hover:text-white transition-colors">
            {title}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
