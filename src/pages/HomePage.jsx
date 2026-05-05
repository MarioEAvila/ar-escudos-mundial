import { useEffect, useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import ARHeroCard from "../components/home/ARHeroCard";
import SelectionStrip from "../components/home/SelectionStrip";
import CreatePostBox from "../components/feed/CreatePostBox";
import PostCard from "../components/feed/PostCard";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import SectionCard from "../components/common/SectionCard";
import { useSocialFeed } from "../hooks/useSocialFeed";
import { useWorldCupData } from "../hooks/useWorldCupData";
import "./HomePage.css";

function HomePage({ currentUser, onOpenAR }) {
  const {
    posts,
    isLoading: isFeedLoading,
    refreshFeed,
    createPost,
    toggleLike,
    toggleFavorite,
    sharePost,
    addComment,
  } = useSocialFeed();
  const {
    teams,
    fixtures,
    standings,
    isLoading: isSportsLoading,
    error: sportsError,
  } = useWorldCupData();

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  const highlightedSelections = useMemo(
    () =>
      teams.slice(0, 5).map((team) => ({
        id: team.id || team.teamId,
        name: team.name,
        flag: team.flag || "🏆",
        rank: team.rankLabel || "Seleccion mundialista",
        color: team.color || "var(--ar-green)",
      })),
    [teams]
  );

  const rightContent = (
    <>
      <SectionCard title="Proximos partidos">
        {isSportsLoading ? (
          <LoadingPanel text="Actualizando calendario..." />
        ) : fixtures.length > 0 ? (
          <div className="home-page__list">
            {fixtures.slice(0, 5).map((match) => (
              <div key={match.id} className="home-page__list-item">
                <strong>
                  {match.homeFlag || "🏳️"} {match.homeTeam}
                </strong>
                <span>vs</span>
                <strong>
                  {match.awayFlag || "🏳️"} {match.awayTeam}
                </strong>
                <p>
                  {match.dateLabel} · {match.venue || "Sede por confirmar"}
                </p>
                {match.scoreLabel && <p>{match.scoreLabel}</p>}
              </div>
            ))}
          </div>
        ) : (
          <EmptyPanel text={sportsError || "No hay partidos disponibles por ahora."} />
        )}
      </SectionCard>

      <SectionCard title="Posiciones">
        {standings.length > 0 ? (
          <div className="home-page__list">
            {standings.slice(0, 5).map((item) => (
              <div key={item.teamId || item.teamName} className="home-page__list-item">
                <strong>
                  #{item.rank || "-"} {item.teamName}
                </strong>
                <p>{item.pointsLabel || `${item.points || 0} pts`}</p>
                <p>{item.recordLabel || "Sin record disponible"}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyPanel text="La tabla aparecera cuando la fuente devuelva posiciones." />
        )}
      </SectionCard>

      <SectionCard title="Estado del mundial">
        <div className="home-page__list">
          <div className="home-page__list-item">
            <strong>Selecciones cargadas</strong>
            <p>{teams.length}</p>
          </div>
          <div className="home-page__list-item">
            <strong>Posts activos</strong>
            <p>{posts.length}</p>
          </div>
        </div>
      </SectionCard>
    </>
  );

  return (
    <AppShell
      user={currentUser}
      activeSection="home"
      onOpenAR={onOpenAR}
      rightContent={rightContent}
    >
      {highlightedSelections.length > 0 && (
        <SelectionStrip selections={highlightedSelections} />
      )}

      <ARHeroCard onOpenAR={onOpenAR} />

      <CreatePostBox currentUser={currentUser} onCreatePost={createPost} />

      <div className="home-page__feed">
        {isFeedLoading ? (
          <LoadingPanel text="Cargando feed..." />
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onToggleLike={toggleLike}
              onToggleFavorite={toggleFavorite}
              onShare={sharePost}
              onAddComment={addComment}
            />
          ))
        ) : (
          <EmptyPanel text="Todavia no hay publicaciones. Se el primero en compartir algo." />
        )}
      </div>
    </AppShell>
  );
}

export default HomePage;
