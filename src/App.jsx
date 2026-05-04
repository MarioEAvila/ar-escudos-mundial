import { useEffect, useState } from "react";
import "./App.css";
import ARShieldScanner from "./components/ar/ARShieldScanner";
import TriviaModal from "./components/modals/TriviaModal";
import ManualModal from "./components/modals/ManualModal";
import { getWorldCupTrivia } from "./data/triviaData";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MediaEditorPage from "./pages/MediaEditorPage";
import MinigamePage from "./pages/MinigamePage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { currentUser, isAuthenticated, logout } = useAuth();

  const [activePage, setActivePage] = useState("home");
  const [modalType, setModalType] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showARScreen, setShowARScreen] = useState(false);
  const [activeTrivia, setActiveTrivia] = useState(() => getWorldCupTrivia(20));

  const manualContent = {
    title: "Manual de uso (Modo AR)",
    steps: [
      "Abre 'Modo AR'.",
      "Pulsa 'Iniciar escaneo' para activar la cámara.",
      "Coloca el escudo dentro del cuadro central de escaneo.",
      "Solo se validará el escudo si permanece dentro del área marcada.",
      "Si el modelo no aparece, ajusta el escudo al centro del cuadro.",
      "Puedes usar 'Ocultar modelo' para seguir detectando sin mostrar el personaje.",
      "Usa 'Reiniciar detección' si quieres volver a empezar sin cerrar el modo AR.",
      "Pulsa 'Detener' para apagar el escáner.",
    ],
    notes: [
      "Esta versión reconoce actualmente los escudos integrados en targets.mind.",
      "El modelo 3D gira automáticamente cuando la detección es válida.",
    ],
  };

  const openModal = (type) => {
    setIsClosing(false);
    setModalType(type);
  };

  const openRandomTrivia = () => {
    setActiveTrivia(getWorldCupTrivia(20));
    setIsClosing(false);
    setModalType("trivia");
  };

  const restartRandomTrivia = () => {
    setActiveTrivia(getWorldCupTrivia(20));
  };

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setModalType(null);
      setIsClosing(false);
    }, 250);
  };

  const goHome = () => setActivePage("home");
  const openProfile = () => setActivePage("profile");
  const openEditor = () => setActivePage("editor");
  const openMinigame = () => setActivePage("minigame");

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && modalType) closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalType]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <>
      {activePage === "home" && (
        <HomePage
          currentUser={currentUser}
          onOpenAR={() => setShowARScreen(true)}
          onOpenProfile={openProfile}
          onGoHome={goHome}
          onOpenEditor={openEditor}
          onOpenMinigame={openMinigame}
        />
      )}

      {activePage === "profile" && (
        <ProfilePage
          currentUser={currentUser}
          onOpenAR={() => setShowARScreen(true)}
          onOpenProfile={openProfile}
          onGoHome={goHome}
          onOpenEditor={openEditor}
          onOpenMinigame={openMinigame}
        />
      )}

      {activePage === "editor" && (
        <MediaEditorPage
          currentUser={currentUser}
          onOpenAR={() => setShowARScreen(true)}
          onOpenProfile={openProfile}
          onGoHome={goHome}
          onOpenEditor={openEditor}
          onOpenMinigame={openMinigame}
        />
      )}

      {activePage === "minigame" && (
        <MinigamePage
          currentUser={currentUser}
          onOpenAR={() => setShowARScreen(true)}
          onOpenProfile={openProfile}
          onGoHome={goHome}
          onOpenEditor={openEditor}
          onOpenMinigame={openMinigame}
        />
      )}

      {showARScreen && (
        <div className="ar-screen">
          <div className="ar-screen-header">
            <h2>Modo AR</h2>

            <div className="ar-screen-header__actions">
              <button onClick={() => openModal("manual")}>Manual</button>
              <button onClick={openRandomTrivia}>Trivia</button>
              <button
                className="ar-screen-close"
                onClick={() => setShowARScreen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>

          <div className="ar-screen-body">
            <ARShieldScanner
              onOpenManual={() => openModal("manual")}
              onOpenTrivia={openRandomTrivia}
            />
          </div>
        </div>
      )}

      <button className="floating-logout" onClick={logout}>
        Cerrar sesión
      </button>

      {modalType === "manual" && (
        <div
          className={`modal-overlay ${isClosing ? "closing" : ""}`}
          onClick={closeModal}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ManualModal content={manualContent} onClose={closeModal} />
          </div>
        </div>
      )}

      {modalType === "trivia" && activeTrivia && (
        <div
          className={`modal-overlay ${isClosing ? "closing" : ""}`}
          onClick={closeModal}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <TriviaModal
              key={activeTrivia.questions.map((question) => question.id).join("-")}
              questions={activeTrivia.questions}
              countryName={activeTrivia.name}
              countryFlag={activeTrivia.flag}
              title={activeTrivia.title}
              onClose={closeModal}
              onRestart={restartRandomTrivia}
            />
          </div>
        </div>
      )}
    </>
  );
}
