import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Play, Info, Loader2, Bug } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import SeasonSelector from '../components/SeasonSelector';
import EpisodeSelector from '../components/EpisodeSelector';
import { useRecentlyViewed } from '../hooks/useLocalStorage';
import { useWatchlist } from '../hooks/useLocalStorage';
import {
  fetchDetails,
  fetchVideos,
  fetchSeasonEpisodes,
  IMAGE_BASE_URL
} from '../utils/tmdb';

const Watch = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { addRecent } = useRecentlyViewed();
  const { watchlist, toggle: toggleWatchlist, isInWatchlist } = useWatchlist();

  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [mode, setMode] = useState(() => {
    // Check URL for ?mode=trailer
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'trailer' ? 'trailer' : 'full';
  });

  // Add to recently viewed
  useEffect(() => {
    if (details?.title || details?.name) {
      const item = {
        id: Number(id),
        type,
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        vote_average: details.vote_average
      };
      addRecent(item);
    }
  }, [details, id, type, addRecent]);

  // Fetch details and videos on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailsRes, videosRes] = await Promise.all([
          fetchDetails(type, id),
          fetchVideos(type, id)
        ]);
        setDetails(detailsRes.data);
        setVideos(videosRes.data.results || []);

        // Find trailer
        const trailer = videosRes.data.results.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer'
        );
        if (trailer) setTrailerKey(trailer.key);

        // For TV shows, get seasons
        if (type === 'tv' && detailsRes.data.seasons) {
          setSeasons(detailsRes.data.seasons.filter(s => s.season_number > 0));
          if (detailsRes.data.seasons.length > 0) {
            // Default to first season (season_number 1) if available
            const firstSeason = detailsRes.data.seasons.find(s => s.season_number === 1) || detailsRes.data.seasons[0];
            setSelectedSeason(firstSeason.season_number);
          }
        }
      } catch (err) {
        console.error('Failed to fetch watch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  // Fetch episodes when selectedSeason changes (for TV)
  useEffect(() => {
    if (type === 'tv' && selectedSeason) {
      const fetchEpisodes = async () => {
        setEpisodesLoading(true);
        try {
          const res = await fetchSeasonEpisodes(id, selectedSeason);
          setEpisodes(res.data.episodes || []);
          // Reset to episode 1
          setSelectedEpisode(1);
        } catch (err) {
          console.error('Failed to fetch episodes:', err);
          setEpisodes([]);
        } finally {
          setEpisodesLoading(false);
        }
      };
      fetchEpisodes();
    }
  }, [type, id, selectedSeason]);

  const inWatchlist = details ? isInWatchlist(details.id, type) : false;
  const [iframeError, setIframeError] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-glow" size={48} />
          <span className="text-glow">Loading...</span>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-3xl font-bold mb-4">Content not found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-accent text-white rounded-full hover:bg-glow transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const title = details.title || details.name;
  const backdrop = details.backdrop_path ? IMAGE_BASE_URL + details.backdrop_path : null;
  const description = details.overview || 'No description available.';
  const rating = details.vote_average?.toFixed(1);
  const genres = details.genres?.map(g => g.name).join(', ') || 'N/A';
  const year = details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0];

  // Debug: Log the ID in development
  console.log(`[UncleFlix] Loading ${type} with ID: ${id}, mode: ${mode}`);

  // Build embed URL with multiple fallback domains for reliability
  const getEmbedUrl = () => {
    if (mode === 'trailer' && trailerKey) {
      return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`;
    }

    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      console.error('[UncleFlix] Invalid ID:', id);
      return null;
    }

    // VidSrc domains (Updated: vidsrc.xyz is deprecated)
    // Primary: vsembed.ru, Fallback: vsembed.su
    const streamingDomains = [
      'https://vsembed.ru',   // Primary (working)
      'https://vsembed.su',   // Fallback
      'https://vidsrc.xyz',   // Legacy fallback (often down)
      'https://vidsrc.to'     // Legacy fallback 2
    ];

    if (type === 'movie') {
      return `${streamingDomains[0]}/embed/movie/${numericId}`;
    } else {
      // TV series
      const ep = episodes.find(e => e.episode_number === selectedEpisode);
      if (!ep) {
        console.warn('[UncleFlix] Episode not found:', selectedSeason, selectedEpisode);
        return null;
      }
      return `${streamingDomains[0]}/embed/tv/${numericId}/${selectedSeason}/${selectedEpisode}`;
    }
  };

  const embedUrl = getEmbedUrl();

  // Return URL for debugging
  console.log('[UncleFlix] Embed URL:', embedUrl);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {backdrop && (
        <div className="relative h-[50vh] w-full overflow-hidden">
          <img src={backdrop} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 z-30 p-2 rounded-full bg-secondary/80 hover:bg-accent/50 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="relative z-10 -mt-32 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              {details.poster_path && (
                <img
                  src={IMAGE_BASE_URL + details.poster_path}
                  alt={title}
                  className="w-48 md:w-64 rounded-xl shadow-2xl border-2 border-accent/30"
                />
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
                  {title}
                </h1>
                <button
                  onClick={() => toggleWatchlist({ id: Number(id), type, title, poster_path: details.poster_path })}
                  className={`p-2 rounded-full border-2 transition-all ${
                    inWatchlist
                      ? 'bg-glow text-primary border-glow'
                      : 'border-accent/40 hover:border-accent text-gray-300 hover:text-glow'
                  }`}
                  title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
                >
                  {inWatchlist ? <Check size={24} /> : <Plus size={24} />}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-300">
                {rating && (
                  <span className="text-glow font-bold text-lg">★ {rating}</span>
                )}
                {year && <span>• {year}</span>}
                {type === 'tv' && details.number_of_seasons && (
                  <span>• {details.number_of_seasons} Seasons</span>
                )}
                {details.runtime && <span>• {details.runtime} min</span>}
                <span className="px-2 py-1 rounded-full border border-accent/30 text-accent uppercase tracking-wider text-xs">
                  {type === 'movie' ? 'Movie' : 'TV Series'}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2 text-glow">Genres</h3>
                <p className="text-gray-300">{genres}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 text-glow">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{description}</p>
              </div>

              {/* Player Controls */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setMode('full')}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 ${
                    mode === 'full'
                      ? 'bg-accent text-white'
                      : 'bg-secondary text-gray-300 border border-accent/30 hover:bg-accent/20'
                  }`}
                >
                  <Play size={20} fill="currentColor" />
                  Watch Now
                </button>
                {trailerKey && (
                  <button
                    onClick={() => setMode('trailer')}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold border transition-all transform hover:scale-105 ${
                      mode === 'trailer'
                        ? 'bg-accent text-white border-accent'
                        : 'bg-secondary text-gray-300 border-accent/30 hover:bg-accent/20'
                    }`}
                  >
                    <Info size={20} />
                    Trailer
                  </button>
                )}
              </div>

              {/* TV Series Controls */}
              {type === 'tv' && (
                <div className="bg-secondary/50 border border-accent/20 rounded-xl p-6 mb-8">
                  <SeasonSelector
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={setSelectedSeason}
                  />
                  {episodesLoading ? (
                    <div className="flex items-center gap-2 text-glow py-4">
                      <Loader2 className="animate-spin" size={20} />
                      Loading episodes...
                    </div>
                  ) : (
                    <EpisodeSelector
                      episodes={episodes}
                      selectedEpisode={selectedEpisode}
                      onEpisodeChange={setSelectedEpisode}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Video Player */}
          {embedUrl && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-glow">
                {mode === 'trailer' ? 'Trailer' : `Playing ${type === 'movie' ? 'Movie' : `TV Series - S${selectedSeason} E${selectedEpisode}`}`}
              </h2>

              {/* Debug Info (Development only) */}
              {import.meta.env.DEV && (
                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Bug size={14} />
                    <span className="font-bold">DEBUG INFO</span>
                  </div>
                  <div className="text-gray-300 space-y-1">
                    <div>Type: {type}</div>
                    <div>TMDB ID: {id}</div>
                    <div>Embed URL: <span className="text-accent break-all">{embedUrl}</span></div>
                    <div>Mode: {mode}</div>
                    {type === 'tv' && (
                      <div>Season: {selectedSeason} | Episode: {selectedEpisode}</div>
                    )}
                  </div>
                </div>
              )}

              {iframeError ? (
                <div className="bg-secondary/80 border-2 border-red-500/50 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">🚫</div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Stream Unavailable</h3>
                  <p className="text-gray-300 mb-6">
                    The video source failed to load. This could be due to:
                  </p>
                  <ul className="text-left max-w-md mx-auto text-gray-400 mb-6 space-y-2">
                    <li>• Ad blocker preventing streaming from loading</li>
                    <li>• Geographic restrictions</li>
                    <li>• Temporary vsembed.ru outage</li>
                    <li>• Browser security settings</li>
                  </ul>
                  {mode === 'full' && (
                    <div className="space-y-3">
                      <p className="text-glow font-bold mb-2">Try these alternatives:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[
                          { url: 'https://vsembed.ru', name: 'vsembed.ru (Primary)' },
                          { url: 'https://vsembed.su', name: 'vsembed.su (Backup)' },
                        ].map((domain) => (
                          <a
                            key={domain.url}
                            href={type === 'movie'
                              ? `${domain.url}/embed/movie/${id}`
                              : `${domain.url}/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-accent/20 hover:bg-accent/40 border border-accent/30 rounded-full text-sm transition-colors"
                          >
                            Open in {domain.name}
                          </a>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Tip: Disable ad blocker or try Chrome Incognito mode
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-accent/30">
                  <iframe
                    src={embedUrl}
                    title={title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    onLoad={() => console.log('[UncleFlix] iframe loaded successfully')}
                    onError={(e) => {
                      console.error('[UncleFlix] iframe load error:', e);
                      setIframeError(true);
                    }}
                  ></iframe>
                </div>
              )}
              <p className="text-gray-400 text-sm mt-2">
                {mode === 'trailer'
                  ? 'Official trailer from YouTube'
                  : `Powered by vsembed.ru. ${iframeError ? 'Click the alternative links above.' : 'If the stream does not load automatically, try the backup domain or disable ad blocker.'}`}
              </p>

              {/* Quick Test Link */}
              <div className="mt-4 text-center">
                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:text-glow transition-colors"
                >
                  🔗 Direct test: {embedUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watch;
