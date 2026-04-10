import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../utils/tmdb';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const HeroBanner = ({ items, item: singleItem, type }) => {
  const itemList = items || (singleItem ? [singleItem] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % itemList.length);
  }, [itemList.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + itemList.length) % itemList.length);
  }, [itemList.length]);

  useEffect(() => {
    if (itemList.length <= 1) return;
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [goNext, itemList.length]);

  if (!itemList.length) return null;

  const item = itemList[currentIndex];
  const itemType = item.title ? 'movie' : type || 'tv';
  const title = item.title || item.name || 'Unknown';
  const backdrop = item.backdrop_path ? IMAGE_BASE_URL + item.backdrop_path : null;
  const description = item.overview || 'No description available.';
  const rating = item.vote_average?.toFixed(1);
  const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0];
  const shortDesc = description.length > 180 ? description.substring(0, 180) + '...' : description;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="relative h-[72vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {backdrop && (
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/60 to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 md:px-16 max-w-7xl mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex + '-content'}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-xl md:max-w-2xl"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {rating && (
                <span className="text-glow font-bold text-base md:text-lg">★ {rating}</span>
              )}
              {year && <span className="text-gray-300 text-sm">• {year}</span>}
              <span className="px-2 py-0.5 rounded-full border border-accent/40 text-accent text-xs uppercase tracking-wider">
                {itemType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight text-white drop-shadow-2xl">
              {title}
            </h1>

            <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed line-clamp-3">
              {shortDesc}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/watch/${itemType}/${item.id}`}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-accent hover:bg-glow text-white rounded-full font-bold shadow-lg shadow-accent/30 transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <Play size={18} fill="currentColor" />
                <span>Watch Now</span>
              </Link>
              <Link
                to={`/watch/${itemType}/${item.id}?mode=trailer`}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full font-bold border border-white/20 transition-all duration-300 active:scale-95 min-h-[44px]"
              >
                <Info size={18} />
                <span>Trailer</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {itemList.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-accent/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-accent/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {itemList.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? 'w-6 h-2 bg-accent'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
    </div>
  );
};

export default HeroBanner;
