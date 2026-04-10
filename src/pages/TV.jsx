import { useEffect, useState } from 'react';
import Row from '../components/Row';
import GenreRow from '../components/GenreRow';
import { fetchTrending, fetchPopular, fetchTopRated } from '../utils/tmdb';
import { Loader2 } from 'lucide-react';

const TV = () => {
  const [tv, setTv] = useState({ trending: [], popular: [], top_rated: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTV = async () => {
      try {
        const [trending, popular, topRated] = await Promise.all([
          fetchTrending('tv', 'week'),
          fetchPopular('tv'),
          fetchTopRated('tv')
        ]);
        setTv({
          trending: trending.data.results || [],
          popular: popular.data.results || [],
          top_rated: topRated.data.results || []
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTV();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-4 pb-12">
      <div className="px-3 sm:px-4 md:px-8 pt-3 pb-4 md:py-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-0.5">TV Shows</h1>
        <p className="text-gray-500 text-xs sm:text-sm">Discover trending, popular, and top rated series</p>
      </div>

      <GenreRow mediaType="tv" />

      {tv.trending.length > 0 && (
        <Row title="🔥 Trending This Week" items={tv.trending} type="tv" />
      )}
      {tv.popular.length > 0 && (
        <Row title="⭐ Popular Shows" items={tv.popular} type="tv" />
      )}
      {tv.top_rated.length > 0 && (
        <Row title="🏆 Top Rated" items={tv.top_rated} type="tv" />
      )}
    </div>
  );
};

export default TV;
