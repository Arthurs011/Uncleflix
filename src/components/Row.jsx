import { motion } from 'framer-motion';
import Card from './Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useCallback } from 'react';

const Row = ({ title, items, type, showProgress }) => {
  const rowRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (rowRef.current) {
      const scrollAmount = window.innerWidth * 0.65;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      className="mb-10 md:mb-14"
    >
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
          {title}
        </h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-accent/60 border border-accent/20 flex items-center justify-center transition-all active:scale-90"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-accent/60 border border-accent/20 flex items-center justify-center transition-all active:scale-90"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-8 pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="snap-start flex-shrink-0">
            <Card item={item} type={type} progress={showProgress ? item.progress : 0} />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default Row;
