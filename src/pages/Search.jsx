import { useEffect, useState, useCallback, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import Card from '../components/Card';
import { searchMulti } from '../utils/tmdb';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimerRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await searchMulti(searchQuery);
      setResults(res.data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv'));
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, performSearch]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Search Movies & TV Shows</h1>

        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows, actors..."
            className="w-full pl-12 pr-12 py-4 bg-secondary/80 border border-accent/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-lg"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-4 flex items-center"
            >
              <X className="text-gray-400 hover:text-white" size={20} />
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center text-glow py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow mx-auto mb-4"></div>
            Searching...
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && query && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No results found for "{query}"</p>
            <p className="mt-2">Try different keywords</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-gray-400 mb-6 text-center">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((item) => (
                <Card key={`${item.media_type}-${item.id}`} item={item} type={item.media_type} />
              ))}
            </div>
          </>
        )}

        {!hasSearched && (
          <div className="text-center text-gray-500 mt-20">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter a search term to find movies and TV shows</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
