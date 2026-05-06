function WorldCupStatTile({ label, value, hint = "" }) {
  return (
    <div className="world-cup-stat-tile">
      <span>{label}</span>
      <strong>{value ?? "N/D"}</strong>
      {hint ? <p>{hint}</p> : null}
    </div>
  );
}

export default WorldCupStatTile;
