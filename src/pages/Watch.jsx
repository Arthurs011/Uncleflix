import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Check, Play, Info, Loader2, ThumbsUp, Share2,
  BookMarked, ChevronDown, ChevronUp
} from 'lucide-react';
import VideoFrame from '../components/VideoFrame';
import Recommendations from '../components/Recommendations';
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
  const { toggle: toggleWatchlist, isInWatchlist } = useWatchlist();

  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const addedToRecentRef = useRef(false);
  const [mode, setMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'trailer' ? 'trailer' : 'full';
  });

  useEffect(() => {
    if ((details?.title || details?.name) && !addedToRecentRef.current) {
      addedToRecentRef.current = true;
      addRecent({
        id: Number(id),
        type,
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        vote_average: details.vote_average
      });
    }
  }, [details, id, type, addRecent]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setIframeError(false);
      try {
        const [detailsRes, videosRes] = await Promise.all([
          fetchDetails(type, id),
          fetchVideos(type, id)
        ]);
        setDetails(detailsRes.data);
        setVideos(videosRes.data.results || []);

        const trailer = videosRes.data.results.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer'
        );
        if (trailer) setTrailerKey(trailer.key);

        if (type === 'tv' && detailsRes.data.seasons) {
          const validSeasons = detailsRes.data.seasons.filter(s => s.season_number > 0);
          setSeasons(validSeasons);
          if (validSeasons.length > 0) {
            const first = validSeasons.find(s => s.season_number === 1) || validSeasons[0];
            setSelectedSeason(first.season_number);
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

  useEffect(() => {
    if (type === 'tv' && selectedSeason) {
      const fetchEpisodes = async () => {
        setEpisodesLoading(true);
        try {
          const res = await fetchSeasonEpisodes(id, selectedSeason);
          setEpisodes(res.data.episodes || []);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={48} />
          <span className="text-gray-400 text-lg">Loading...</span>
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
  const description = details.overview || 'No description available.';
  const rating = details.vote_average?.toFixed(1);
  const genres = details.genres?.map(g => g.name).join(', ') || 'N/A';
  const year = details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0];
  const votes = details.vote_count ? `${(details.vote_count / 1000).toFixed(1)}K` : null;

  const getEmbedUrl = () => {
    if (mode === 'trailer' && trailerKey) {
      return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`;
    }
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) return null;
    if (type === 'movie') {
      return `https://vsembed.ru/embed/movie/${numericId}`;
    } else {
      if (!episodes.find(e => e.episode_number === selectedEpisode)) return null;
      return `https://vsembed.ru/embed/tv/${numericId}/${selectedSeason}/${selectedEpisode}`;
    }
  };

  const embedUrl = getEmbedUrl();
  const shortDesc = description.length > 200 ? description.substring(0, 200) + '...' : description;

  const handleShare = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-primary"
    >
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 pt-4 pb-12">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* ─── MAIN COLUMN ─── */}
          <div className="flex-1 min-w-0">

            {/* Video Player */}
            {embedUrl ? (
              <VideoFrame
                embedUrl={embedUrl}
                title={title}
                type={type}
                id={id}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
                iframeError={iframeError}
                onIframeError={() => setIframeError(true)}
              />
            ) : (
              <div className="w-full aspect-video bg-secondary/60 rounded-2xl flex items-center justify-center border border-accent/20">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎬</div>
                  <p className="text-gray-400">
                    {type === 'tv' && episodes.length === 0
                      ? 'Select an episode to start watching'
                      : 'Video unavailable'}
                  </p>
                </div>
              </div>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setMode('full'); setIframeError(false); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  mode === 'full'
                    ? 'bg-accent text-white shadow-md shadow-accent/30'
                    : 'bg-secondary/70 text-gray-400 hover:text-white border border-secondary'
                }`}
              >
                <Play size={14} fill="currentColor" />
                Watch Now
              </button>
              {trailerKey && (
                <button
                  onClick={() => { setMode('trailer'); setIframeError(false); }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    mode === 'trailer'
                      ? 'bg-accent text-white shadow-md shadow-accent/30'
                      : 'bg-secondary/70 text-gray-400 hover:text-white border border-secondary'
                  }`}
                >
                  <Info size={14} />
                  Trailer
                </button>
              )}
            </div>

            {/* Title + Meta */}
            <div className="mt-4">
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                {title}
                {type === 'tv' && mode === 'full' && (
                  <span className="text-accent text-xl ml-2">
                    S{selectedSeason} E{selectedEpisode}
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                {rating && (
                  <span className="flex items-center gap-1 text-glow font-bold text-base">
                    ★ {rating}
                    {votes && <span className="text-gray-500 text-xs font-normal">({votes})</span>}
                  </span>
                )}
                {year && <span>• {year}</span>}
                {type === 'tv' && details.number_of_seasons && (
                  <span>• {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>
                )}
                {details.runtime && <span>• {details.runtime} min</span>}
                <span className="px-2 py-0.5 rounded-full border border-accent/30 text-accent text-xs uppercase tracking-wider">
                  {type === 'movie' ? 'Movie' : 'TV Series'}
                </span>
                {genres && (
                  <span className="text-gray-500 text-xs">{genres}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/10">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    liked
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-secondary/60 border-secondary hover:border-accent/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp size={15} fill={liked ? 'currentColor' : 'none'} />
                  Like
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-secondary/60 border border-secondary hover:border-accent/50 text-gray-300 hover:text-white transition-all"
                >
                  <Share2 size={15} />
                  Share
                </button>

                <button
                  onClick={() => toggleWatchlist({
                    id: Number(id), type, title,
                    poster_path: details.poster_path,
                    vote_average: details.vote_average
                  })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    inWatchlist
                      ? 'bg-glow/20 border-glow text-glow'
                      : 'bg-secondary/60 border-secondary hover:border-glow/50 text-gray-300 hover:text-white'
                  }`}
                >
                  {inWatchlist ? <Check size={15} /> : <BookMarked size={15} />}
                  {inWatchlist ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Description */}
              <div className="mt-4">
                <div
                  className={`text-gray-300 text-sm leading-relaxed transition-all duration-300 ${
                    descExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {description}
                </div>
                {description.length > 200 && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="flex items-center gap-1 text-accent text-sm mt-2 hover:text-glow transition-colors"
                  >
                    {descExpanded ? (
                      <><ChevronUp size={14} /> Show less</>
                    ) : (
                      <><ChevronDown size={14} /> Show more</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* TV: Season + Episode selectors */}
            {type === 'tv' && (
              <div className="mt-6 bg-secondary/40 border border-accent/10 rounded-2xl p-5">
                <h3 className="text-base font-bold text-glow mb-4">Episodes</h3>
                <SeasonSelector
                  seasons={seasons}
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSelectedSeason}
                />
                {episodesLoading ? (
                  <div className="flex items-center gap-2 text-gray-400 py-4">
                    <Loader2 className="animate-spin" size={18} />
                    Loading episodes...
                  </div>
                ) : (
                  <EpisodeSelector
                    episodes={episodes}
                    selectedEpisode={selectedEpisode}
                    onEpisodeChange={(ep) => { setSelectedEpisode(ep); setIframeError(false); }}
                  />
                )}
              </div>
            )}
          </div>

          {/* ─── SIDEBAR (Recommendations) ─── */}
          <div className="xl:w-96 flex-shrink-0">
            <div className="xl:sticky xl:top-24">
              <Recommendations type={type} currentId={id} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Watch;
