import { Link } from 'react-router-dom';
import { Trash2, Film, Tv } from 'lucide-react';
import { useWatchlist } from '../hooks/useLocalStorage';
import { IMAGE_BASE_URL } from '../utils/tmdb';

const MyList = () => {
  const { watchlist, remove } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Your List is Empty</h1>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Add movies and TV shows to your list to watch them later.
          </p>
          <Link
            to="/"
            className="px-7 py-3 bg-accent text-white rounded-full font-bold hover:bg-glow transition-all active:scale-95 touch-manipulation"
          >
            Explore Content
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-8 pt-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">My List</h1>
        <p className="text-gray-400 text-sm mb-5 md:mb-8">
          {watchlist.length} item{watchlist.length !== 1 ? 's' : ''} saved
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {watchlist.map((item) => {
            const title = item.title || item.name;
            const poster = item.poster_path ? IMAGE_BASE_URL + item.poster_path : null;
            const isMovie = item.type === 'movie';

            return (
              <div
                key={`${item.id}-${item.type}`}
                className="group relative bg-secondary rounded-xl overflow-hidden shadow-lg border border-accent/20 hover:border-glow/40 transition-all duration-300"
              >
                <Link to={`/watch/${item.type}/${item.id}`} className="block">
                  <div className="aspect-[2/3] relative">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-accent/20 to-primary flex items-center justify-center">
                        {isMovie ? <Film size={36} className="text-accent/50" /> : <Tv size={36} className="text-accent/50" />}
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 bg-accent/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                      {isMovie ? 'M' : 'TV'}
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="font-bold text-xs sm:text-sm line-clamp-2 mb-1">{title}</h3>
                    {item.vote_average && (
                      <div className="flex items-center text-[10px] sm:text-xs text-glow">
                        ★ {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Remove button — always visible on mobile, hover-only on desktop */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    remove(item.id, item.type);
                  }}
                  className="absolute top-1.5 left-1.5 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full transition-all touch-manipulation active:scale-90 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Remove from list"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyList;
