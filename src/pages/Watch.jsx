import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, BookMarked, Share2, ChevronDown, ChevronUp, SkipForward } from 'lucide-react';
import VideoFrame from '../components/VideoFrame';
import Recommendations from '../components/Recommendations';
import SeasonSelector from '../components/SeasonSelector';
import EpisodeSelector from '../components/EpisodeSelector';
import AutoNextOverlay from '../components/AutoNextOverlay';
import { useRecentlyViewed, useWatchlist, usePlaybackMemory } from '../hooks/useLocalStorage';
import {
  fetchDetails,
  fetchVideos,
  fetchSeasonEpisodes,
} from '../utils/tmdb';

const Watch = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { addRecent } = useRecentlyViewed();
  const { toggle: toggleWatchlist, isInWatchlist } = useWatchlist();
  const { saveProgress, getProgress } = usePlaybackMemory();

  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAutoNext, setShowAutoNext] = useState(false);
  const [trailerMode, setTrailerMode] = useState(false);
  const addedToRecentRef = useRef(false);

  // Restore playback memory on load
  useEffect(() => {
    if (type === 'tv') {
      const saved = getProgress(id, type);
      if (saved) {
        setSelectedSeason(saved.season);
        setSelectedEpisode(saved.episode);
      }
    }
  }, [id, type, getProgress]);

  // Track recently viewed
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

  // Save episode progress when episode changes
  useEffect(() => {
    if (type === 'tv' && details && selectedSeason && selectedEpisode) {
      saveProgress(id, type, selectedSeason, selectedEpisode);
    }
  }, [id, type, selectedSeason, selectedEpisode, details, saveProgress]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setIframeError(false);
      addedToRecentRef.current = false;
      setTrailerMode(false);
      try {
        const [detailsRes, videosRes] = await Promise.all([
          fetchDetails(type, id),
          fetchVideos(type, id)
        ]);
        setDetails(detailsRes.data);

        const trailer = (videosRes.data.results || []).find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer'
        );
        if (trailer) setTrailerKey(trailer.key);
        else setTrailerKey(null);

        if (type === 'tv' && detailsRes.data.seasons) {
          const validSeasons = detailsRes.data.seasons.filter(s => s.season_number > 0);
          setSeasons(validSeasons);
          // Restore from memory or default to season 1
          const saved = getProgress(id, type);
          if (!saved && validSeasons.length > 0) {
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
  }, [type, id, getProgress]);

  useEffect(() => {
    if (type === 'tv' && selectedSeason) {
      const fetchEps = async () => {
        setEpisodesLoading(true);
        try {
          const res = await fetchSeasonEpisodes(id, selectedSeason);
          setEpisodes(res.data.episodes || []);
        } catch {
          setEpisodes([]);
        } finally {
          setEpisodesLoading(false);
        }
      };
      fetchEps();
    }
  }, [type, id, selectedSeason]);

  const inWatchlist = details ? isInWatchlist(details.id, type) : false;

  // Auto-next episode logic
  const getNextEpisode = useCallback(() => {
    if (type !== 'tv' || !episodes.length) return null;
    const currentIdx = episodes.findIndex(e => e.episode_number === selectedEpisode);
    if (currentIdx >= 0 && currentIdx < episodes.length - 1) {
      return { season: selectedSeason, episode: episodes[currentIdx + 1].episode_number };
    }
    // Move to next season
    const currentSeasonIdx = seasons.findIndex(s => s.season_number === selectedSeason);
    if (currentSeasonIdx >= 0 && currentSeasonIdx < seasons.length - 1) {
      return { season: seasons[currentSeasonIdx + 1].season_number, episode: 1 };
    }
    return null;
  }, [type, episodes, selectedEpisode, selectedSeason, seasons]);

  const nextEp = getNextEpisode();

  const playNext = useCallback(() => {
    setShowAutoNext(false);
    if (!nextEp) return;
    if (nextEp.season !== selectedSeason) {
      setSelectedSeason(nextEp.season);
      setSelectedEpisode(1);
    } else {
      setSelectedEpisode(nextEp.episode);
    }
    setIframeError(false);
  }, [nextEp, selectedSeason]);

  const handleEpisodeChange = (epNum) => {
    setSelectedEpisode(epNum);
    setIframeError(false);
    setShowAutoNext(false);
    setTrailerMode(false);
  };

  const handleSeasonChange = (seasonNum) => {
    setSelectedSeason(seasonNum);
    setShowAutoNext(false);
    setTrailerMode(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: details?.title || details?.name, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

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
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-accent text-white rounded-full hover:bg-glow transition">
          Back to Home
        </button>
      </div>
    );
  }

  const title = details.title || details.name;
  const description = details.overview || 'No description available.';
  const rating = details.vote_average?.toFixed(1);
  const genres = details.genres?.map(g => g.name).join(' • ') || '';
  const year = details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0];
  const votes = details.vote_count ? `${(details.vote_count / 1000).toFixed(1)}K` : null;

  const numericId = Number(id);
  const getEmbedUrl = () => {
    if (trailerMode && trailerKey) return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`;
    if (!numericId || isNaN(numericId)) return null;
    if (type === 'movie') return `https://vsembed.ru/embed/movie/${numericId}`;
    if (!episodes.find(e => e.episode_number === selectedEpisode)) return null;
    return `https://vsembed.ru/embed/tv/${numericId}/${selectedSeason}/${selectedEpisode}`;
  };

  const embedUrl = getEmbedUrl();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-primary"
    >
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 pt-4 pb-16">
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
                  <p className="text-gray-400 text-sm">
                    {type === 'tv' && !episodesLoading && episodes.length === 0
                      ? 'Select an episode below'
                      : episodesLoading ? 'Loading episodes...' : 'Video unavailable'}
                  </p>
                </div>
              </div>
            )}

            {/* Trailer + Next Episode pill row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {trailerKey && (
                <button
                  onClick={() => { setTrailerMode(!trailerMode); setIframeError(false); }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    trailerMode
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-secondary/60 border-secondary/60 text-gray-400 hover:text-white hover:border-accent/40'
                  }`}
                >
                  {trailerMode ? 'Back to Stream' : 'Watch Trailer'}
                </button>
              )}
              {type === 'tv' && nextEp && !trailerMode && (
                <button
                  onClick={() => setShowAutoNext(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary/60 border border-secondary/60 text-gray-400 hover:text-white hover:border-accent/40 transition-all"
                >
                  <SkipForward size={12} />
                  Next: S{nextEp.season} E{nextEp.episode}
                </button>
              )}
            </div>

            {/* Title + Meta */}
            <div className="mt-4 pb-4 border-b border-white/8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {title}
                    {type === 'tv' && !trailerMode && (
                      <span className="text-accent text-lg font-semibold ml-2">
                        S{selectedSeason} E{selectedEpisode}
                      </span>
                    )}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-gray-400">
                    {rating && (
                      <span className="text-glow font-bold">
                        ★ {rating}
                        {votes && <span className="text-gray-500 font-normal text-xs ml-1">({votes})</span>}
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
                  </div>
                  {genres && <p className="text-xs text-gray-500 mt-1">{genres}</p>}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleWatchlist({
                      id: Number(id), type, title,
                      poster_path: details.poster_path,
                      vote_average: details.vote_average
                    })}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      inWatchlist
                        ? 'bg-glow/15 border-glow/60 text-glow'
                        : 'bg-secondary/60 border-secondary hover:border-glow/40 text-gray-300 hover:text-white'
                    }`}
                  >
                    {inWatchlist ? <Check size={14} /> : <BookMarked size={14} />}
                    {inWatchlist ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-secondary/60 border border-secondary hover:border-accent/40 text-gray-300 hover:text-white transition-all"
                  >
                    <Share2 size={14} />
                    Share
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-3">
                <p className={`text-gray-400 text-sm leading-relaxed ${descExpanded ? '' : 'line-clamp-3'}`}>
                  {description}
                </p>
                {description.length > 200 && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="flex items-center gap-1 text-accent text-xs mt-1.5 hover:text-glow transition-colors"
                  >
                    {descExpanded
                      ? <><ChevronUp size={12} /> Less</>
                      : <><ChevronDown size={12} /> More</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* TV: Season + Episode list */}
            {type === 'tv' && (
              <div className="mt-5">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-base font-bold text-white">Episodes</h3>
                  <SeasonSelector
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={handleSeasonChange}
                    inline
                  />
                </div>
                {episodesLoading ? (
                  <div className="flex items-center gap-2 text-gray-400 py-4">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Loading episodes...</span>
                  </div>
                ) : (
                  <EpisodeSelector
                    episodes={episodes}
                    selectedEpisode={selectedEpisode}
                    onEpisodeChange={handleEpisodeChange}
                  />
                )}
              </div>
            )}

            {/* Recommendations (below player on mobile / small screens) */}
            <div className="mt-8 xl:hidden">
              <Recommendations type={type} currentId={id} />
            </div>
          </div>

          {/* ─── SIDEBAR ─── */}
          <div className="hidden xl:block xl:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <Recommendations type={type} currentId={id} />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-next overlay */}
      <AutoNextOverlay
        show={showAutoNext}
        nextEpisode={nextEp}
        onConfirm={playNext}
        onCancel={() => setShowAutoNext(false)}
      />
    </motion.div>
  );
};

export default Watch;
