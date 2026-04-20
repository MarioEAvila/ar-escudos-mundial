import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ARShieldScanner from "./components/ar/ARShieldScanner";
import TriviaModal from "./components/modals/TriviaModal";
import ManualModal from "./components/modals/ManualModal";
import { getTriviaByCountry } from "./data/triviaData";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { currentUser, isAuthenticated, logout } = useAuth();

  const [modalType, setModalType] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showARScreen, setShowARScreen] = useState(false);
  const [activeTriviaCountry, setActiveTriviaCountry] = useState("mexico");

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
      "Esta versión reconoce actualmente el escudo de México.",
      "El modelo 3D gira automáticamente cuando la detección es válida.",
    ],
  };

  const activeTrivia = useMemo(() => {
    return getTriviaByCountry(activeTriviaCountry);
  }, [activeTriviaCountry]);

  const openModal = (type) => {
    setIsClosing(false);
    setModalType(type);
  };

  const openTriviaForCountry = (countryId) => {
    setActiveTriviaCountry(countryId);
    setIsClosing(false);
    setModalType("trivia");
  };

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setModalType(null);
      setIsClosing(false);
    }, 250);
  };

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
      <HomePage currentUser={currentUser} onOpenAR={() => setShowARScreen(true)} />

      {showARScreen && (
        <div className="ar-screen">
          <div className="ar-screen-header">
            <h2>Modo AR</h2>

            <div className="ar-screen-header__actions">
              <button onClick={() => openModal("manual")}>Manual</button>
              <button onClick={() => openTriviaForCountry("mexico")}>Trivia</button>
              <button className="ar-screen-close" onClick={() => setShowARScreen(false)}>
                Cerrar
              </button>
            </div>
          </div>

          <div className="ar-screen-body">
            <ARShieldScanner
              onOpenManual={() => openModal("manual")}
              onOpenTrivia={() => openTriviaForCountry("mexico")}
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
              questions={activeTrivia.questions}
              countryName={activeTrivia.name}
              countryFlag={activeTrivia.flag}
              title={activeTrivia.title}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}