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
    <div className="mb-8 md:mb-10">
      <h2 className="text-base md:text-2xl font-bold text-white px-3 sm:px-4 md:px-8 mb-3">
        Browse by Genre
      </h2>
      <div className="flex gap-2 md:gap-3 overflow-x-auto px-3 sm:px-4 md:px-8 pb-2 scrollbar-hide snap-x touch-pan-x">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/genre/${mediaType}/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="group snap-start flex-shrink-0 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-2xl glass hover:bg-accent/20 hover:border-accent/50 border border-transparent transition-all duration-200 touch-manipulation active:scale-95"
          >
            <span className="text-base md:text-lg leading-none">
              {GENRE_EMOJIS[genre.name] || '🎬'}
            </span>
            <span className="text-xs md:text-sm font-semibold text-gray-300 group-hover:text-white whitespace-nowrap transition-colors">
              {genre.name}
            </span>
            <ChevronRight size={12} className="text-gray-600 group-hover:text-accent transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenreRow;
