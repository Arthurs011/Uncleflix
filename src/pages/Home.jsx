import { useEffect, useState, useCallback } from 'react';
import HeroBanner from '../components/HeroBanner';
import Row from '../components/Row';
import { useRecentlyViewed } from '../hooks/useLocalStorage';
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated
} from '../utils/tmdb';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { recent } = useRecentlyViewed();
  const [heroItems, setHeroItems] = useState([]);
  const [movies, setMovies] = useState({ trending: [], popular: [], top_rated: [] });
  const [tv, setTv] = useState({ trending: [], popular: [], top_rated: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [movieTrending, moviePopular, movieTopRated, tvTrending, tvPopular, tvTopRated] = await Promise.all([
        fetchTrending('movie', 'week'),
        fetchPopular('movie'),
        fetchTopRated('movie'),
        fetchTrending('tv', 'week'),
        fetchPopular('tv'),
        fetchTopRated('tv')
      ]);

      const movieResults = movieTrending.data.results || [];
      const tvResults = tvTrending.data.results || [];

      setMovies({
        trending: movieResults,
        popular: moviePopular.data.results || [],
        top_rated: movieTopRated.data.results || []
      });
      setTv({
        trending: tvResults,
        popular: tvPopular.data.results || [],
        top_rated: tvTopRated.data.results || []
      });

      // Interleave top movies and TV for a varied hero
      const heroPool = [];
      const maxHero = 6;
      for (let i = 0; i < maxHero; i++) {
        if (movieResults[i]) heroPool.push(movieResults[i]);
        if (tvResults[i]) heroPool.push(tvResults[i]);
      }
      setHeroItems(heroPool.slice(0, 8));
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="animate-spin text-accent" size={44} />
        <span className="text-gray-400 text-lg">Loading UncleFlix...</span>
      </div>
    );
  }

  return (
    <div className="-mt-20">
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      <div className="mt-2">
        {recent.length > 0 && (
          <Row title="▶ Continue Watching" items={recent} type={recent[0]?.type} showProgress />
        )}

        {movies.trending.length > 0 && (
          <Row title="🔥 Trending Movies" items={movies.trending} type="movie" />
        )}
        {tv.trending.length > 0 && (
          <Row title="📺 Trending TV Shows" items={tv.trending} type="tv" />
        )}
        {movies.popular.length > 0 && (
          <Row title="⭐ Popular Movies" items={movies.popular} type="movie" />
        )}
        {tv.popular.length > 0 && (
          <Row title="🌟 Popular TV Shows" items={tv.popular} type="tv" />
        )}
        {movies.top_rated.length > 0 && (
          <Row title="🏆 Top Rated Movies" items={movies.top_rated} type="movie" />
        )}
        {tv.top_rated.length > 0 && (
          <Row title="🎖 Top Rated TV Shows" items={tv.top_rated} type="tv" />
        )}
      </div>
    </div>
  );
};

export default Home;
