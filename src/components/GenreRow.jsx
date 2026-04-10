import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGenres } from '../utils/tmdb';
import { ChevronRight } from 'lucide-react';

const GENRE_EMOJIS = {
  'Action': '💥', 'Adventure': '🗺️', 'Animation': '🎨', 'Comedy': '😂',
  'Crime': '🔍', 'Documentary': '📹', 'Drama': '🎭', 'Family': '👨‍👩‍👧',
  'Fantasy': '🧙', 'History': '📜', 'Horror': '👻', 'Music': '🎵',
  'Mystery': '🕵️', 'Romance': '❤️', 'Science Fiction': '🚀', 'Sci-Fi & Fantasy': '🚀',
  'Thriller': '😱', 'War': '⚔️', 'Western': '🤠', 'Action & Adventure': '💥',
  'Kids': '🧒', 'News': '📰', 'Reality': '📺', 'Soap': '🧼', 'Talk': '🎤',
  'War & Politics': '⚔️',
};

const GenreRow = ({ mediaType }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres(mediaType)
      .then((res) => setGenres(res.data.genres || []))
      .catch(console.error);
  }, [mediaType]);

  if (!genres.length) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-lg md:text-2xl font-bold text-white">
          Browse by Genre
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 md:px-8 pb-3 scrollbar-hide snap-x">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/genre/${mediaType}/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="group snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:bg-accent/20 hover:border-accent/50 border border-transparent transition-all duration-200 hover:shadow-lg hover:shadow-accent/10"
          >
            <span className="text-lg leading-none">
              {GENRE_EMOJIS[genre.name] || '🎬'}
            </span>
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white whitespace-nowrap transition-colors">
              {genre.name}
            </span>
            <ChevronRight size={14} className="text-gray-600 group-hover:text-accent transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenreRow;
