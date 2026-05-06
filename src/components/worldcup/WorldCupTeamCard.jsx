function WorldCupTeamCard({ team, isActive = false, onClick }) {
  return (
    <button
      className={`world-cup-team-card ${isActive ? "active" : ""} ${
        onClick ? "" : "is-static"
      }`}
      onClick={onClick}
      disabled={!onClick}
      type="button"
    >
      <span className="world-cup-team-card__logo">
        {team.logoUrl ? <img src={team.logoUrl} alt={team.name} /> : team.code || "WC"}
      </span>
      <strong>{team.name}</strong>
      <p>{team.groupName || team.rankLabel || "Mundial Qatar 2022"}</p>
    </button>
  );
}

export default WorldCupTeamCard;
