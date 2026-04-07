import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../utils/tmdb';
import { Play, Info } from 'lucide-react';

const HeroBanner = ({ item, type }) => {
  const title = item.title || item.name || 'Unknown';
  const backdrop = item.backdrop_path ? IMAGE_BASE_URL + item.backdrop_path : null;
  const description = item.overview || 'No description available.';
  const rating = item.vote_average?.toFixed(1);
  const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0];

  // Truncate description
  const shortDesc = description.length > 200 ? description.substring(0, 200) + '...' : description;

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Backdrop Image with Overlay */}
      <div className="absolute inset-0">
        {backdrop && (
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 md:px-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl md:max-w-2xl px-4 md:px-0"
        >
          {rating && (
            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
              <span className="text-glow font-bold text-lg md:text-xl">★ {rating}</span>
              {year && <span className="text-gray-300 text-sm md:text-base">• {year}</span>}
              <span className="px-2 py-1 rounded-full border border-accent/40 text-accent text-xs md:text-sm uppercase tracking-wider">
                {type === 'movie' ? 'Movie' : 'TV Series'}
              </span>
            </div>
          )}

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight text-white drop-shadow-2xl">
            {title}
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed line-clamp-3 md:line-clamp-4">
            {shortDesc}
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link
              to={`/watch/${type}/${item.id}`}
              className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-accent hover:bg-glow text-white rounded-full font-bold shadow-glow transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation min-h-[44px]"
            >
              <Play size={18} fill="currentColor" />
              <span className="text-lg">Play</span>
            </Link>
            <Link
              to={`/watch/${type}/${item.id}?mode=trailer`}
              className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-secondary/80 hover:bg-accent/30 text-white rounded-full font-bold border border-accent/30 transition-all duration-300 active:scale-95 touch-manipulation min-h-[44px]"
            >
              <Info size={18} />
              <span className="text-lg">Info</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-primary to-transparent" />
    </div>
  );
};

export default HeroBanner;
