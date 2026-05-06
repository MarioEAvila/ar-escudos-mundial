import EmptyPanel from "../common/EmptyPanel";

function getFixtureScores(match) {
  if (match.homeScore !== undefined && match.awayScore !== undefined) {
    return {
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    };
  }

  const scoreMatch = String(match.scoreLabel || "").match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);

  return {
    homeScore: scoreMatch?.[1] || "",
    awayScore: scoreMatch?.[2] || "",
  };
}

function WorldCupFixtureList({ fixtures = [], emptyText = "No hay partidos disponibles." }) {
  if (fixtures.length === 0) {
    return <EmptyPanel text={emptyText} />;
  }

  return (
    <div className="world-cup-fixture-list">
      {fixtures.map((match) => {
        const { homeScore, awayScore } = getFixtureScores(match);

        return (
          <article key={match.id} className="world-cup-fixture-card">
            <div className="world-cup-fixture-card__scoreboard">
              <div className="world-cup-fixture-card__team">
                {match.homeLogoUrl ? <img src={match.homeLogoUrl} alt={match.homeTeam} /> : null}
                <strong>{match.homeTeam}</strong>
                <span>{homeScore !== "" ? homeScore : "-"}</span>
              </div>

              <div className="world-cup-fixture-card__team">
                {match.awayLogoUrl ? <img src={match.awayLogoUrl} alt={match.awayTeam} /> : null}
                <strong>{match.awayTeam}</strong>
                <span>{awayScore !== "" ? awayScore : "-"}</span>
              </div>
            </div>

            <div className="world-cup-fixture-card__meta">
              <p>{match.round || "Fase por confirmar"}</p>
              <p>{match.dateLabel}</p>
              <p>{match.venue || "Sede por confirmar"}</p>
              {match.scoreLabel ? <small>{match.resultLabel}</small> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default WorldCupFixtureList;
