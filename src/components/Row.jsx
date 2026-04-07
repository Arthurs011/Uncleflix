import { motion } from 'framer-motion';
import Card from './Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useCallback } from 'react';

const Row = ({ title, items, type }) => {
  const rowRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (rowRef.current) {
      const scrollAmount = window.innerWidth * 0.7;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-8 md:mb-12"
    >
      <div className="flex items-center justify-between px-4 md:px-8 mb-3 md:mb-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
          {title}
        </h2>
        {/* Hide scroll buttons on very small screens, show on md+ */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-secondary/80 hover:bg-accent/50 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-secondary/80 hover:bg-accent/50 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
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
            <Card item={item} type={type} />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default Row;
