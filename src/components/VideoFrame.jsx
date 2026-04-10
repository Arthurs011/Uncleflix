import { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoFrame = ({ embedUrl, title, type, id, selectedSeason, selectedEpisode, iframeError, onIframeError }) => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="relative w-full">
      <div
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-accent/20 group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Back Button Overlay */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 hover:bg-accent/80 backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 border border-white/20 hover:border-accent"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Title Overlay (top right) */}
        <div className="absolute top-4 right-4 z-30 max-w-[50%]">
          <span className="text-sm font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 line-clamp-1">
            {title}
          </span>
        </div>

        {iframeError ? (
          <div className="flex flex-col items-center justify-center w-full h-full bg-secondary/90 px-6 text-center">
            <div className="text-5xl mb-4">🚫</div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Stream Unavailable</h3>
            <p className="text-gray-400 text-sm mb-5">
              The stream failed to load. Try disabling your ad blocker or use a direct link below.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { url: 'https://vsembed.ru', label: 'vsembed.ru' },
                { url: 'https://vsembed.su', label: 'vsembed.su' },
              ].map((d) => (
                <a
                  key={d.url}
                  href={
                    type === 'movie'
                      ? `${d.url}/embed/movie/${id}`
                      : `${d.url}/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent/20 hover:bg-accent/40 border border-accent/40 rounded-full text-sm text-accent transition-colors"
                >
                  <ExternalLink size={14} />
                  {d.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <>
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer"
              onLoad={() => console.log('[UncleFlix] iframe loaded')}
              onError={onIframeError}
            />
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
};

export default VideoFrame;
