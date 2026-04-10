import { useEffect, useState } from 'react';
import Row from '../components/Row';
import GenreRow from '../components/GenreRow';
import { fetchTrending, fetchPopular, fetchTopRated } from '../utils/tmdb';
import { Loader2 } from 'lucide-react';

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
    fetchMovies();
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
      <div className="px-4 md:px-8 py-6">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Movies</h1>
        <p className="text-gray-500 text-sm">Explore trending, popular, and top rated movies</p>
      </div>

      <GenreRow mediaType="movie" />

      {movies.trending.length > 0 && (
        <Row title="🔥 Trending This Week" items={movies.trending} type="movie" />
      )}
      {movies.popular.length > 0 && (
        <Row title="⭐ Popular Movies" items={movies.popular} type="movie" />
      )}
      {movies.top_rated.length > 0 && (
        <Row title="🏆 Top Rated" items={movies.top_rated} type="movie" />
      )}
    </div>
  );
};

export default Movies;
