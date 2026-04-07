const SeasonSelector = ({ seasons, selectedSeason, onSeasonChange }) => {
  if (!seasons || seasons.length <= 1) return null;

  return (
    <div className="mb-6">
      <label className="block text-glow font-bold mb-2">Season</label>
      <select
        value={selectedSeason}
        onChange={(e) => onSeasonChange(Number(e.target.value))}
        className="w-full max-w-xs bg-secondary border border-accent/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.season_number}>
            Season {season.season_number} - {season.name || ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelector;
