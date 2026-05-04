import { useMemo } from "react";
import "./HomePage.css";
import HomeSidebar from "../components/layout/HomeSidebar";
import HomeTopbar from "../components/home/HomeTopbar";
import ARHeroCard from "../components/home/ARHeroCard";
import SelectionStrip from "../components/home/SelectionStrip";
import CreatePostBox from "../components/feed/CreatePostBox";
import PostCard from "../components/feed/PostCard";
import { useSocialFeed } from "../hooks/useSocialFeed";
import {
  highlightedSelections,
  quickStats,
  trends,
  upcomingMatches,
} from "../data/homeData";

function HomePage({
  currentUser,
  onOpenAR,
  onOpenProfile,
  onGoHome,
  onOpenEditor,
  onOpenMinigame,
}) {
  const {
    posts,
    createPost,
    toggleLike,
    toggleFavorite,
    sharePost,
    addComment,
  } = useSocialFeed(currentUser);

  const orderedPosts = useMemo(() => posts, [posts]);

  return (
    <main className="home-page">
      <div className="home-page__grid">
        <div className="home-page__left">
          <HomeSidebar
            user={currentUser}
            onOpenAR={onOpenAR}
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
            onOpenMinigame={onOpenMinigame}
            activeSection="home"
          />
        </div>

        <div className="home-page__center">
          <HomeTopbar
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
          />

          <SelectionStrip selections={highlightedSelections} />

          <ARHeroCard onOpenAR={onOpenAR} />

          <CreatePostBox
            currentUser={currentUser}
            onCreatePost={createPost}
          />

          <div className="home-page__feed">
            {orderedPosts.length > 0 ? (
              orderedPosts.map((post) => (
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
              <div className="home-page__empty-feed">
                Todavía no hay publicaciones. Sé el primero en compartir algo.
              </div>
            )}
          </div>
        </div>

        <div className="home-page__right">
          <section className="home-page__panel">
            <div className="home-page__panel-header">
              <h3>Próximos partidos</h3>
            </div>

            <div className="home-page__list">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="home-page__list-item">
                  <strong>
                    {match.homeFlag} {match.home}
                  </strong>
                  <span>vs</span>
                  <strong>
                    {match.awayFlag} {match.away}
                  </strong>
                  <p>
                    {match.date} · {match.time}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="home-page__panel">
            <div className="home-page__panel-header">
              <h3>Estadísticas rápidas</h3>
            </div>

            <div className="home-page__list">
              {quickStats.map((item) => (
                <div key={item.team} className="home-page__list-item">
                  <strong>
                    {item.flag} {item.team}
                  </strong>
                  <p>{item.stat1}</p>
                  <p>{item.stat2}</p>
                  <p>{item.stat3}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="home-page__panel">
            <div className="home-page__panel-header">
              <h3>Tendencias</h3>
            </div>

            <div className="home-page__list">
              {trends.map((trend) => (
                <div key={trend.id} className="home-page__list-item">
                  <strong>{trend.tag}</strong>
                  <p>{trend.posts}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
