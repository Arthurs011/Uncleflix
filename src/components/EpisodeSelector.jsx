const EpisodeSelector = ({ episodes, selectedEpisode, onEpisodeChange }) => {
  if (!episodes || episodes.length === 0) {
    return <p className="text-gray-500 text-sm">No episodes available.</p>;
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 font-medium mb-3">
        {episodes.length} Episode{episodes.length !== 1 ? 's' : ''}
      </label>
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto hide-scrollbar pr-1">
        {episodes.map((ep) => {
          const active = selectedEpisode === ep.episode_number;
          return (
            <button
              key={ep.id}
              onClick={() => onEpisodeChange(ep.episode_number)}
              className={`flex items-center gap-3 text-left p-3 rounded-xl border transition-all group ${
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
                <div className={`font-semibold text-sm line-clamp-1 ${active ? 'text-glow' : ''}`}>
                  {ep.name}
                </div>
                {ep.runtime && (
                  <div className="text-xs text-gray-500 mt-0.5">{ep.runtime} min</div>
                )}
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
        })}
      </div>
    </div>
  );
};

export default EpisodeSelector;
