import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchByGenre } from '../utils/tmdb';
import Card from '../components/Card';

const Genre = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const genreName = searchParams.get('name') || 'Genre';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (pageNum, replace = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await fetchByGenre(type, id, pageNum);
      const results = res.data.results || [];
      const totalPages = res.data.total_pages || 1;
      setItems((prev) => replace ? results : [...prev, ...results]);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error('Genre fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, id]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    load(1, true);
  }, [load]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next);
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-8 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={type === 'movie' ? '/movies' : '/tv'}
          className="w-9 h-9 rounded-full bg-secondary/80 hover:bg-accent/30 border border-accent/20 flex items-center justify-center transition-all flex-shrink-0 touch-manipulation active:scale-90"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-0.5">
            {type === 'movie' ? 'Movies' : 'TV Shows'}
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{genreName}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4"
          >
            {items.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                className="w-full"
              >
                <Card item={item} type={type} className="w-full" />
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 bg-secondary/80 hover:bg-accent/20 border border-accent/30 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-50 touch-manipulation active:scale-95"
              >
                {loadingMore ? (
                  <><Loader2 className="animate-spin" size={16} /> Loading...</>
                ) : 'Load More'}
              </button>
            </div>
          )}

          {!items.length && (
            <div className="text-center py-24 text-gray-500">
              No content found for this genre.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Genre;
