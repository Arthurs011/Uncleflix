const SeasonSelector = ({ seasons, selectedSeason, onSeasonChange, inline }) => {
  if (!seasons || seasons.length === 0) return null;

  if (inline) {
    return (
      <select
        value={selectedSeason}
        onChange={(e) => onSeasonChange(Number(e.target.value))}
        className="bg-secondary border border-accent/30 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer"
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.season_number} className="bg-secondary">
            Season {season.season_number}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 font-medium mb-2">Season</label>
      <select
        value={selectedSeason}
        onChange={(e) => onSeasonChange(Number(e.target.value))}
        className="w-full max-w-xs bg-secondary border border-accent/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer"
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.season_number} className="bg-secondary">
            Season {season.season_number}{season.name ? ` — ${season.name}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelector;
