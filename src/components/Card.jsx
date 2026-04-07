import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../utils/tmdb';

const Card = ({ item, type }) => {
  // Use item.type if available (for mixed lists), else fallback to provided type
  const itemType = item.type || type;
  const title = item.title || item.name || 'Unknown';
  const poster = item.poster_path ? IMAGE_BASE_URL + item.poster_path : null;
  const id = item.id;
  const rating = item.vote_average?.toFixed(1);

  // Fallback gradient if no poster
  const fallbackGradient = "bg-gradient-to-b from-accent/30 to-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex-shrink-0 w-[44%] sm:w-40 md:w-48 cursor-pointer touch-manipulation"
    >
      <Link
        to={`/watch/${itemType}/${id}`}
        className="block"
        aria-label={`Play ${title}`}
      >
        <div className={`relative overflow-hidden rounded-xl aspect-[2/3] shadow-lg group-hover:shadow-glow/50 transition-all duration-300 ${!poster ? fallbackGradient : ''}`}>
          {poster && (
            <>
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            {!poster && (
              <span className="text-3xl font-bold text-accent/80">?</span>
            )}
          </div>
          {rating && (
            <div className="absolute top-2 right-2 bg-glow/20 text-glow px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              ★ {rating}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-bold text-sm line-clamp-2 leading-tight">{title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
              <span className="capitalize px-2 py-0.5 rounded-full bg-accent/30 text-glow border border-accent/30">
                {itemType === 'movie' ? 'Movie' : 'TV'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
