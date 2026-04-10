const EpisodeSelector = ({ episodes, selectedEpisode, onEpisodeChange, mobileHorizontal }) => {
  if (!episodes || episodes.length === 0) {
    return <p className="text-gray-500 text-sm">No episodes available.</p>;
  }

  if (mobileHorizontal) {
    return (
      <div>
        <p className="text-xs text-gray-500 mb-2">{episodes.length} episodes</p>
        {/* Mobile: horizontal scroll chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 md:hidden">
          {episodes.map((ep) => {
            const active = selectedEpisode === ep.episode_number;
            return (
              <button
                key={ep.id}
                onClick={() => onEpisodeChange(ep.episode_number)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all min-w-[64px] touch-manipulation active:scale-95 ${
                  active
                    ? 'bg-accent/15 border-accent/60 text-white'
                    : 'bg-secondary/40 border-transparent text-gray-400'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  active ? 'bg-accent text-white' : 'bg-secondary text-gray-500'
                }`}>
                  {ep.episode_number}
                </div>
                <span className="text-[10px] line-clamp-1 max-w-[56px] text-center leading-tight">
                  {ep.name}
                </span>
              </button>
            );
          })}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden md:flex flex-col gap-2 max-h-80 overflow-y-auto hide-scrollbar pr-1">
          <EpisodeList episodes={episodes} selectedEpisode={selectedEpisode} onEpisodeChange={onEpisodeChange} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-400 font-medium mb-3">{episodes.length} Episode{episodes.length !== 1 ? 's' : ''}</p>
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto hide-scrollbar pr-1">
        <EpisodeList episodes={episodes} selectedEpisode={selectedEpisode} onEpisodeChange={onEpisodeChange} />
      </div>
    </div>
  );
};

const EpisodeList = ({ episodes, selectedEpisode, onEpisodeChange }) =>
  episodes.map((ep) => {
    const active = selectedEpisode === ep.episode_number;
    return (
      <button
        key={ep.id}
        onClick={() => onEpisodeChange(ep.episode_number)}
        className={`flex items-center gap-3 text-left p-3 rounded-xl border transition-all group touch-manipulation active:scale-[0.98] ${
          active
            ? 'bg-accent/15 border-accent/60 text-white'
            : 'bg-secondary/30 border-transparent hover:border-accent/30 text-gray-400 hover:text-white'
        }`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          active ? 'bg-accent text-white' : 'bg-secondary group-hover:bg-accent/20 text-gray-500 group-hover:text-accent'
        }`}>
          {ep.episode_number}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm line-clamp-1 ${active ? 'text-glow' : ''}`}>{ep.name}</div>
          {ep.runtime && <div className="text-xs text-gray-500 mt-0.5">{ep.runtime} min</div>}
        </div>
        {active && (
          <div className="flex-shrink-0">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
      </button>
    );
  });

export default EpisodeSelector;
