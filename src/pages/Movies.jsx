import { useEffect, useState } from 'react';
import Row from '../components/Row';
import { fetchTrending, fetchPopular, fetchTopRated } from '../utils/tmdb';

const Movies = () => {
  const [movies, setMovies] = useState({ trending: [], popular: [], top_rated: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular, topRated] = await Promise.all([
          fetchTrending('movie', 'week'),
          fetchPopular('movie'),
          fetchTopRated('movie')
        ]);
        setMovies({
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
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-glow animate-pulse">Loading Movies...</div>
      </div>
    );
  }

  return (
    <div className="-mt-24">
      <div className="px-8 py-8">
        <h1 className="text-4xl font-bold mb-2">Movies</h1>
        <p className="text-gray-400">Explore trending, popular, and top rated movies</p>
      </div>

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
  );
};

export default Movies;
