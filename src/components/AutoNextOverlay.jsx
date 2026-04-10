import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, X } from 'lucide-react';

const AutoNextOverlay = ({ show, nextEpisode, onConfirm, onCancel, countdown = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(countdown);

  useEffect(() => {
    if (!show) {
      setTimeLeft(countdown);
      return;
    }
    if (timeLeft <= 0) {
      onConfirm();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [show, timeLeft, onConfirm, countdown]);

  useEffect(() => {
    if (show) setTimeLeft(countdown);
  }, [show, countdown]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-6 z-50 glass rounded-2xl p-5 w-72 border border-accent/30 shadow-2xl shadow-black/60"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
              <SkipForward size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Up Next</p>
              <p className="text-sm font-bold text-white line-clamp-1">
                {nextEpisode
                  ? `S${nextEpisode.season} E${nextEpisode.episode}`
                  : 'Next Episode'}
              </p>
            </div>
          </div>

          {/* Countdown bar */}
          <div className="relative h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: countdown, ease: 'linear' }}
            />
          </div>

          <p className="text-sm text-gray-300 mb-4">
            Next episode starts in{' '}
            <span className="text-accent font-bold text-base">{timeLeft}</span>s
          </p>

          <div className="flex gap-2">
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-accent hover:bg-glow rounded-xl text-sm font-semibold text-white transition-colors"
            >
              <SkipForward size={14} />
              Play Now
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2 bg-secondary/80 hover:bg-secondary rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors border border-white/10"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoNextOverlay;
