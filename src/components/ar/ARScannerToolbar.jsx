export default function ARScannerToolbar({
  isScanning,
  modelEnabled,
  isModelAnimating,
  onStart,
  onReset,
  onToggleModel,
  onToggleInteraction,
  onStop,
  onManual,
  onTrivia,
}) {
  return (
    <div className="ar-toolbar">
      {!isScanning ? (
        <>
          <button
            className="ar-tool-btn ar-tool-btn-secondary"
            onClick={onManual}
            type="button"
          >
            Manual de uso
          </button>

          <button
            className="ar-tool-btn ar-tool-btn-secondary"
            onClick={onTrivia}
            type="button"
          >
            Trivia
          </button>

          <button
            className="ar-tool-btn ar-tool-btn-primary"
            onClick={onStart}
            type="button"
          >
            Iniciar escaneo
          </button>
        </>
      ) : (
        <>
          <button
            className="ar-tool-btn ar-tool-btn-secondary"
            onClick={onManual}
            type="button"
          >
            Manual
          </button>

          <button
            className="ar-tool-btn ar-tool-btn-secondary"
            onClick={onTrivia}
            type="button"
          >
            Trivia
          </button>

          <button
            className="ar-tool-btn"
            onClick={onReset}
            type="button"
          >
            Reiniciar detección
          </button>

          <button
            className="ar-tool-btn"
            onClick={onToggleModel}
            type="button"
          >
            {modelEnabled ? "Ocultar modelo" : "Mostrar modelo"}
          </button>

          <button
            className="ar-tool-btn"
            onClick={onToggleInteraction}
            type="button"
          >
            {isModelAnimating ? "Pausar giro" : "Reanudar giro"}
          </button>

          <button
            className="ar-tool-btn ar-tool-btn-danger"
            onClick={onStop}
            type="button"
          >
            Detener
          </button>
        </>
      )}
    </div>
  );
}