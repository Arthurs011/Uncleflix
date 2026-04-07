import { useEffect, useState } from 'react';
import Row from '../components/Row';
import { fetchTrending, fetchPopular, fetchTopRated } from '../utils/tmdb';

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
          trending: trending.data.results,
          popular: popular.data.results,
          top_rated: topRated.data.results
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
        <div className="text-2xl text-glow animate-pulse">Loading TV Shows...</div>
      </div>
    );
  }

  return (
    <div className="-mt-24">
      <div className="px-8 py-8">
        <h1 className="text-4xl font-bold mb-2">TV Shows</h1>
        <p className="text-gray-400">Discover trending, popular, and top rated series</p>
      </div>

      {tv.trending.length > 0 && (
        <Row title="Trending TV Shows" items={tv.trending} type="tv" />
      )}
      {tv.popular.length > 0 && (
        <Row title="Popular TV Shows" items={tv.popular} type="tv" />
      )}
      {tv.top_rated.length > 0 && (
        <Row title="Top Rated TV Shows" items={tv.top_rated} type="tv" />
      )}
    </div>
  );
};

export default TV;
