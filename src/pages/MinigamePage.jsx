import "./MinigamePage.css";
import HomeSidebar from "../components/layout/HomeSidebar";
import HomeTopbar from "../components/home/HomeTopbar";

function MinigamePage({
  currentUser,
  onOpenAR,
  onGoHome,
  onOpenProfile,
  onOpenEditor,
  onOpenMinigame,
}) {
  return (
    <main className="minigame-page">
      <div className="minigame-page__grid">
        <div className="minigame-page__left">
          <HomeSidebar
            user={currentUser}
            onOpenAR={onOpenAR}
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
            onOpenMinigame={onOpenMinigame}
            activeSection="minigame"
          />
        </div>

        <section className="minigame-page__center">
          <HomeTopbar
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
          />

          <header className="minigame-hero">
            <p>Zona interactiva</p>
            <h1>Minijuego</h1>
            <span>
              Practica tus tiros libres y compite por tu mejor puntaje dentro de
              Mundial FC.
            </span>
          </header>

          <section className="minigame-container">
            <iframe
              src="/minijuego/minijuego.html"
              title="Minijuego Mundial FC"
              className="minigame-frame"
            />
          </section>
        </section>
      </div>
    </main>
  );
}

export default MinigamePage;