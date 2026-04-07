import { useEffect, useState, useCallback } from 'react';
import HeroBanner from '../components/HeroBanner';
import Row from '../components/Row';
import { useRecentlyViewed } from '../hooks/useLocalStorage';
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated
} from '../utils/tmdb';

const Home = () => {
  const { recent } = useRecentlyViewed();
  const [heroItem, setHeroItem] = useState(null);
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

      setMovies({
        trending: movieTrending.data.results,
        popular: moviePopular.data.results,
        top_rated: movieTopRated.data.results
      });
      setTv({
        trending: tvTrending.data.results,
        popular: tvPopular.data.results,
        top_rated: tvTopRated.data.results
      });

      // Set hero as first trending movie (or tv if none)
      if (movieTrending.data.results?.length > 0) {
        setHeroItem(movieTrending.data.results[0]);
      } else if (tvTrending.data.results?.length > 0) {
        setHeroItem(tvTrending.data.results[0]);
      }
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-glow animate-pulse">Loading UncleFlix...</div>
      </div>
    );
  }

  return (
    <div className="-mt-24">
      {heroItem && <HeroBanner item={heroItem} type={heroItem.title ? 'movie' : 'tv'} />}

      {recent.length > 0 && (
        <div className="mt-8">
          <Row title="Recently Viewed" items={recent} type={recent[0]?.type} />
        </div>
      )}

      <div className="mt-8">
        {movies.trending.length > 0 && (
          <Row title="Trending Movies" items={movies.trending} type="movie" />
        )}
        {movies.popular.length > 0 && (
          <Row title="Popular Movies" items={movies.popular} type="movie" />
        )}
        {movies.top_rated.length > 0 && (
          <Row title="Top Rated Movies" items={movies.top_rated} type="movie" />
        )}
      </div>

      <div className="mt-8">
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
    </div>
  );
};

export default Home;
