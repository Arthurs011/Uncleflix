import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../utils/tmdb';
import { Play, Star } from 'lucide-react';

const Card = ({ item, type, progress }) => {
  const itemType = item.type || type;
  const title = item.title || item.name || 'Unknown';
  const poster = item.poster_path ? IMAGE_BASE_URL + item.poster_path : null;
  const id = item.id;
  const rating = item.vote_average?.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex-shrink-0 w-[42%] sm:w-36 md:w-44 cursor-pointer touch-manipulation"
    >
      <Link
        to={`/watch/${itemType}/${id}`}
        className="block"
        aria-label={`Play ${title}`}
      >
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] group-hover:border-cyan-400/50 border border-transparent">
          {poster ? (
            <>
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-75 transition-all duration-400"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-accent/30 to-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-accent/50">?</span>
            </div>
          )}

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm text-glow px-1.5 py-0.5 rounded-md text-xs font-bold border border-glow/20">
              <Star size={9} fill="currentColor" className="text-glow" />
              {rating}
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-accent/80 text-white text-xs font-bold uppercase tracking-wide">
            {itemType === 'movie' ? 'Movie' : 'TV'}
          </div>

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play size={20} fill="#0B0F1A" className="text-primary ml-0.5" />
            </div>
          </div>

          {/* Bottom title */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-bold text-sm line-clamp-2 leading-tight text-white">{title}</h3>
          </div>

          {/* Progress bar (continue watching) */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Title below card */}
        <div className="mt-2 px-0.5">
          <p className="text-xs text-gray-400 font-medium line-clamp-1 group-hover:text-white transition-colors">{title}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
