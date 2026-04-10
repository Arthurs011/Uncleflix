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
  const description = item.overview || '';
  const rating = item.vote_average?.toFixed(1);
  const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0];
  const shortDesc = description.length > 160 ? description.substring(0, 160) + '…' : description;

  const contentVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="relative h-[52vh] sm:h-[62vh] md:h-[78vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {backdrop && (
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          )}
          {/* Mobile: heavier left gradient to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 sm:via-primary/55 to-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-primary/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end sm:items-center px-4 md:px-10 lg:px-16 pb-10 sm:pb-0 max-w-7xl mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex + '-content'}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl"
          >
            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
              {rating && <span className="text-glow font-bold text-sm md:text-base">★ {rating}</span>}
              {year && <span className="text-gray-300 text-xs md:text-sm">• {year}</span>}
              <span className="px-2 py-0.5 rounded-full border border-accent/40 text-accent text-[10px] md:text-xs uppercase tracking-wider">
                {itemType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 leading-tight text-white drop-shadow-2xl line-clamp-2">
              {title}
            </h1>

            {shortDesc && (
              <p className="hidden sm:block text-xs sm:text-sm md:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-3">
                {shortDesc}
              </p>
            )}

            <div className="flex gap-2 md:gap-3">
              <Link
                to={`/watch/${itemType}/${item.id}`}
                className="flex items-center gap-1.5 md:gap-2 px-4 md:px-7 py-2.5 md:py-3.5 bg-accent hover:bg-glow text-white rounded-full font-bold shadow-lg shadow-accent/30 transition-all duration-200 active:scale-95 min-h-[40px] md:min-h-[48px] text-sm md:text-base"
              >
                <Play size={15} fill="currentColor" />
                Watch Now
              </Link>
              <Link
                to={`/watch/${itemType}/${item.id}?mode=trailer`}
                className="flex items-center gap-1.5 md:gap-2 px-4 md:px-7 py-2.5 md:py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full font-bold border border-white/20 transition-all duration-200 active:scale-95 min-h-[40px] md:min-h-[48px] text-sm md:text-base"
              >
                <Info size={15} />
                Trailer
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows — hidden on small mobile */}
      {itemList.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden sm:flex absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-accent/70 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="hidden sm:flex absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-accent/70 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {itemList.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                className={`transition-all duration-300 rounded-full touch-manipulation ${
                  i === currentIndex ? 'w-5 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-28 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
    </div>
  );
};

export default HeroBanner;
