import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecommendations, fetchTrending } from '../utils/tmdb';
import { Loader2, Star } from 'lucide-react';

const Recommendations = ({ type, currentId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let results = [];
        const recRes = await fetchRecommendations(type, currentId);
        results = recRes.data.results || [];

        if (results.length < 5) {
          const trendRes = await fetchTrending(type === 'movie' ? 'movie' : 'tv', 'week');
          const extra = (trendRes.data.results || []).filter(
            (i) => i.id !== Number(currentId) && !results.some((r) => r.id === i.id)
          );
          results = [...results, ...extra];
        }

        setItems(results.filter((i) => i.id !== Number(currentId)).slice(0, 18));
      } catch (err) {
        console.error('Recommendations fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (currentId) load();
  }, [type, currentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-accent" size={26} />
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div>
      <h3 className="text-base font-bold text-white mb-3 px-0.5">Recommended For You</h3>

      {/* Mobile: horizontal poster scroll */}
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2 xl:hidden snap-x touch-pan-x">
        {items.slice(0, 10).map((item) => {
          const title = item.title || item.name || 'Unknown';
          const poster = item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : null;
          const rating = item.vote_average?.toFixed(1);

          return (
            <Link
              key={item.id}
              to={`/watch/${type}/${item.id}`}
              className="flex-shrink-0 snap-start w-24 sm:w-28 group touch-manipulation"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-transparent group-hover:border-accent/40 transition-all">
                {poster ? (
                  <img
                    src={poster}
                    alt={title}
                    className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center text-accent/40 text-xs">?</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {rating && (
                  <div className="absolute top-1 left-1 text-[10px] font-bold text-glow flex items-center gap-0.5 bg-black/60 px-1 py-0.5 rounded">
                    <Star size={7} fill="currentColor" />{rating}
                  </div>
                )}
                <p className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 text-[10px] font-semibold text-white line-clamp-2 leading-tight">
                  {title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop: vertical list */}
      <div className="hidden xl:flex flex-col gap-2.5 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar pr-0.5">
        {items.map((item) => {
          const title = item.title || item.name || 'Unknown';
          const thumb = item.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
            : item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : null;
          const rating = item.vote_average?.toFixed(1);
          const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0];

          return (
            <Link
              key={item.id}
              to={`/watch/${type}/${item.id}`}
              className="group flex gap-3 p-2 rounded-xl hover:bg-secondary/70 transition-all duration-200 border border-transparent hover:border-accent/20"
            >
              <div className="flex-shrink-0 w-32 h-[72px] rounded-lg overflow-hidden bg-secondary relative">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary text-accent/50 text-xs">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-200">
                    <svg className="w-3.5 h-3.5 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="font-semibold text-sm text-white line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                  {title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  {rating && (
                    <span className="flex items-center gap-0.5 text-glow font-bold">
                      <Star size={10} fill="currentColor" />
                      {rating}
                    </span>
                  )}
                  {year && <span>• {year}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
