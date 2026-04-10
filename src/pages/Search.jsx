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
  const inputRef = useRef(null);

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
    debounceTimerRef.current = setTimeout(() => performSearch(query), 450);
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [query, performSearch]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen pt-4 pb-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 md:mb-8 text-center">
          Search Movies &amp; TV Shows
        </h1>

        {/* Search bar */}
        <div className="relative max-w-2xl mx-auto mb-6 md:mb-10">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" size={18} />
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows..."
            autoComplete="off"
            className="w-full pl-11 pr-11 py-3.5 bg-secondary/80 border border-accent/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-lg text-sm md:text-base"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-4 flex items-center touch-manipulation"
            >
              <X className="text-gray-400 hover:text-white transition-colors" size={18} />
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center text-glow py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-glow mx-auto mb-3" />
            <p className="text-sm">Searching...</p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && query && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No results for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-gray-500">Try different keywords</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {results.map((item) => (
                <Card key={`${item.media_type}-${item.id}`} item={item} type={item.media_type} className="w-full" />
              ))}
            </div>
          </>
        )}

        {!hasSearched && (
          <div className="text-center text-gray-600 mt-16">
            <SearchIcon size={44} className="mx-auto mb-4 opacity-40" />
            <p className="text-base text-gray-500">Type to search movies and TV shows</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
