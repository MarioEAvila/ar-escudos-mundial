import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ARShieldScanner from "./components/ar/ARShieldScanner";
import TriviaModal from "./components/modals/TriviaModal";
import ManualModal from "./components/modals/ManualModal";
import { getWorldCupTrivia } from "./data/triviaData";
import AuthPage from "./pages/AuthPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import MediaEditorPage from "./pages/MediaEditorPage";
import MinigamePage from "./pages/MinigamePage";
import NewsPage from "./pages/NewsPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SelectionsPage from "./pages/SelectionsPage";
import StatsPage from "./pages/StatsPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { currentUser, isAuthenticated, isBootstrapping, logout } = useAuth();
  const [modalType, setModalType] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showARScreen, setShowARScreen] = useState(false);
  const [activeTrivia, setActiveTrivia] = useState(() => getWorldCupTrivia(20));

  const manualContent = {
    title: "Manual de uso (Modo AR)",
    steps: [
      "Abre 'Modo AR'.",
      "Pulsa 'Iniciar escaneo' para activar la camara.",
      "Coloca el escudo dentro del cuadro central de escaneo.",
      "Solo se validara el escudo si permanece dentro del area marcada.",
      "Si el modelo no aparece, ajusta el escudo al centro del cuadro.",
      "Puedes usar 'Ocultar modelo' para seguir detectando sin mostrar el personaje.",
      "Usa 'Reiniciar deteccion' si quieres volver a empezar sin cerrar el modo AR.",
      "Pulsa 'Detener' para apagar el escaner.",
    ],
    notes: [
      "Esta version reconoce actualmente los escudos integrados en targets.mind.",
      "El modelo 3D gira automaticamente cuando la deteccion es valida.",
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

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && modalType) closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalType]);

  if (isBootstrapping) {
    return <main className="app-loading-screen">Cargando Mundial FC...</main>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const sharedPageProps = {
    currentUser,
    onOpenAR: () => setShowARScreen(true),
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage {...sharedPageProps} />} />
        <Route path="/news" element={<NewsPage {...sharedPageProps} />} />
        <Route
          path="/selections"
          element={<SelectionsPage {...sharedPageProps} />}
        />
        <Route path="/stats" element={<StatsPage {...sharedPageProps} />} />
        <Route
          path="/favorites"
          element={<FavoritesPage {...sharedPageProps} />}
        />
        <Route
          path="/u/:username"
          element={<ProfilePage {...sharedPageProps} />}
        />
        <Route path="/editor" element={<MediaEditorPage {...sharedPageProps} />} />
        <Route
          path="/minigame"
          element={<MinigamePage {...sharedPageProps} />}
        />
        <Route
          path="/post/:postId"
          element={<PostDetailPage {...sharedPageProps} />}
        />
        <Route
          path="/post/:postId/comment/:commentId"
          element={<PostDetailPage {...sharedPageProps} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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

      <button className="floating-logout" onClick={() => logout()}>
        Cerrar sesion
      </button>

      {modalType === "manual" && (
        <div
          className={`modal-overlay ${isClosing ? "closing" : ""}`}
          onClick={closeModal}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <ManualModal content={manualContent} onClose={closeModal} />
          </div>
        </div>
      )}

      {modalType === "trivia" && activeTrivia && (
        <div
          className={`modal-overlay ${isClosing ? "closing" : ""}`}
          onClick={closeModal}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
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
