import EmptyPanel from "../common/EmptyPanel";

function groupStandings(standings) {
  return standings.reduce((groups, item) => {
    const groupName = item.groupName || "Grupo";
    return {
      ...groups,
      [groupName]: [...(groups[groupName] || []), item],
    };
  }, {});
}

function WorldCupStandingsTable({ standings = [], activeTeamId = "" }) {
  if (standings.length === 0) {
    return <EmptyPanel text="La tabla aparecera cuando la API devuelva posiciones." />;
  }

  const groupedStandings = groupStandings(standings);

  return (
    <div className="world-cup-standings">
      {Object.entries(groupedStandings).map(([groupName, rows]) => (
        <section key={groupName} className="world-cup-standings__group">
          <h3>{groupName}</h3>

          <div className="world-cup-standings__rows">
            {rows.map((row) => (
              <div
                key={`${groupName}-${row.teamId}`}
                className={`world-cup-standings__row ${
                  activeTeamId && row.teamId === activeTeamId ? "active" : ""
                }`}
              >
                <span>{row.rank || "-"}</span>
                <strong>
                  {row.logoUrl ? <img src={row.logoUrl} alt={row.teamName} /> : null}
                  {row.teamName}
                </strong>
                <small>{row.pointsLabel}</small>
                <small>{row.recordLabel}</small>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default WorldCupStandingsTable;
