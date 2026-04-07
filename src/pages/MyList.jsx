import { Link } from 'react-router-dom';
import { Trash2, Film, Tv } from 'lucide-react';
import { useWatchlist } from '../hooks/useLocalStorage';
import { IMAGE_BASE_URL } from '../utils/tmdb';

const MyList = () => {
  const { watchlist, remove } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h1 className="text-4xl font-bold mb-4">Your List is Empty</h1>
          <p className="text-gray-400 mb-8">Add movies and TV shows to your list to watch them later.</p>
          <Link
            to="/"
            className="px-8 py-3 bg-accent text-white rounded-full font-bold hover:bg-glow transition-all transform hover:scale-105 shadow-glow"
          >
            Explore Content
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">My List</h1>
        <p className="text-gray-400 mb-8">{watchlist.length} item{watchlist.length !== 1 ? 's' : ''} saved</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((item) => {
            const title = item.title || item.name;
            const poster = item.poster_path ? IMAGE_BASE_URL + item.poster_path : null;
            const isMovie = item.type === 'movie';

            return (
              <div
                key={`${item.id}-${item.type}`}
                className="group relative bg-secondary rounded-xl overflow-hidden shadow-lg border border-accent/20 hover:border-glow/50 transition-all duration-300"
              >
                <Link to={`/watch/${item.type}/${item.id}`} className="block">
                  <div className="aspect-[2/3] relative">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-accent/20 to-primary flex items-center justify-center">
                        <span className="text-4xl font-bold text-accent/50">
                          {isMovie ? <Film size={48} /> : <Tv size={48} />}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-glow/20 text-glow text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                      {isMovie ? 'Movie' : 'TV'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm line-clamp-2 mb-2">{title}</h3>
                    {item.vote_average && (
                      <div className="flex items-center text-xs text-glow">
                        ★ {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    remove(item.id, item.type);
                  }}
                  className="absolute top-2 left-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove from list"
                >
                  <Trash2 size={16} />
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
