const EpisodeSelector = ({ episodes, selectedEpisode, onEpisodeChange }) => {
  if (!episodes || episodes.length === 0) {
    return <p className="text-gray-400">No episodes available.</p>;
  }

  return (
    <div>
      <label className="block text-glow font-bold mb-2">Episode</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2 scrollbar-hide">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => onEpisodeChange(ep.episode_number)}
            className={`text-left p-3 rounded-lg border transition-all ${
              selectedEpisode === ep.episode_number
                ? 'bg-accent/20 border-accent text-glow'
                : 'bg-secondary/50 border-secondary/30 hover:border-accent/50 text-gray-300'
            }`}
          >
            <div className="font-bold">Ep {ep.episode_number}</div>
            <div className="text-sm line-clamp-2">{ep.name}</div>
            <div className="text-xs text-gray-500 mt-1">{ep.runtime} min</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeSelector;
