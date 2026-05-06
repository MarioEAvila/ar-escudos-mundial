function WorldCupPlayerCard({ player, isActive = false, onClick, showStats = false }) {
  return (
    <button
      className={`world-cup-player-card ${isActive ? "active" : ""} ${
        onClick ? "" : "is-static"
      }`}
      onClick={onClick}
      disabled={!onClick}
      type="button"
    >
      {player.photoUrl ? (
        <img src={player.photoUrl} alt={player.name} />
      ) : (
        <div className="world-cup-player-card__placeholder">Jugador</div>
      )}

      <strong>{player.name}</strong>
      <p>{player.position || "Posicion"}</p>

      {showStats ? (
        <span className="world-cup-player-card__stats">
          {player.stats?.appearances || 0} PJ - {player.stats?.goals || 0} G
        </span>
      ) : null}
    </button>
  );
}

export default WorldCupPlayerCard;
