import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import "./App.css";

/*
  Componente principal del escáner AR.
  Usa MindAR con targets.mind para reconocer escudos.
*/
function ARShieldScanner() {
  const containerRef = useRef(null);

  const [statusText, setStatusText] = useState("Preparando escáner...");
  const [detectedTeam, setDetectedTeam] = useState("Buscando escudo...");

  useEffect(() => {
    let mindarThree = null;
    let renderer = null;
    let destroyed = false;

    // Referencias para limpiar videos al desmontar
    const createdVideos = [];

    const startAR = async () => {
      try {
        setStatusText("Esperando contenedor...");

        await new Promise((resolve) => {
          const check = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            if (rect.width > 0 && rect.height > 0) {
              resolve();
            } else {
              requestAnimationFrame(check);
            }
          };

          check();
        });

        if (!containerRef.current) return;

        setStatusText("Iniciando cámara...");

        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: "/targets.mind",
          uiScanning: false,
          uiLoading: false,
          uiError: false,
        });

        const { renderer: r, scene, camera } = mindarThree;
        renderer = r;

        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.background = "transparent";

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // 0 = México, 1 = Argentina, 2 = Brasil
        const mexicoAnchor = mindarThree.addAnchor(0);
        const argentinaAnchor = mindarThree.addAnchor(1);
        const brasilAnchor = mindarThree.addAnchor(2);

        /*
          Crea un plano con video como textura.
          El video se fuerza a muted + loop + playsInline para móvil.
        */
        const createVideoPanel = (videoPath) => {
          const video = document.createElement("video");
          video.src = videoPath;
          video.crossOrigin = "anonymous";
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.autoplay = true;
          video.preload = "auto";

          createdVideos.push(video);

          const texture = new THREE.VideoTexture(video);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;

          const geometry = new THREE.PlaneGeometry(1.15, 0.65);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          });

          const mesh = new THREE.Mesh(geometry, material);

          // Posición sobre el escudo
          mesh.position.set(0, 0.55, 0);

          return { mesh, video };
        };

        const mexicoVideoPanel = createVideoPanel("/videos/Mexico.mp4");
        const argentinaVideoPanel = createVideoPanel("/videos/Argentina.mp4");
        const brasilVideoPanel = createVideoPanel("/videos/Brazil.mp4");

        mexicoAnchor.group.add(mexicoVideoPanel.mesh);
        argentinaAnchor.group.add(argentinaVideoPanel.mesh);
        brasilAnchor.group.add(brasilVideoPanel.mesh);

        /*
          Inicia o pausa videos según el target encontrado.
          Así evitamos que los 3 reproduzcan al mismo tiempo innecesariamente.
        */
        const pauseAllVideos = () => {
          createdVideos.forEach((video) => {
            video.pause();
            video.currentTime = 0;
          });
        };

        mexicoAnchor.onTargetFound = async () => {
          if (destroyed) return;
          setDetectedTeam("Escudo detectado: México");
          pauseAllVideos();
          try {
            await mexicoVideoPanel.video.play();
          } catch (error) {
            console.error("No se pudo reproducir video de México:", error);
          }
        };

        argentinaAnchor.onTargetFound = async () => {
          if (destroyed) return;
          setDetectedTeam("Escudo detectado: Argentina");
          pauseAllVideos();
          try {
            await argentinaVideoPanel.video.play();
          } catch (error) {
            console.error("No se pudo reproducir video de Argentina:", error);
          }
        };

        brasilAnchor.onTargetFound = async () => {
          if (destroyed) return;
          setDetectedTeam("Escudo detectado: Brasil");
          pauseAllVideos();
          try {
            await brasilVideoPanel.video.play();
          } catch (error) {
            console.error("No se pudo reproducir video de Brasil:", error);
          }
        };

        mexicoAnchor.onTargetLost = () => {
          if (destroyed) return;
          mexicoVideoPanel.video.pause();
          mexicoVideoPanel.video.currentTime = 0;
          setDetectedTeam("Buscando escudo...");
        };

        argentinaAnchor.onTargetLost = () => {
          if (destroyed) return;
          argentinaVideoPanel.video.pause();
          argentinaVideoPanel.video.currentTime = 0;
          setDetectedTeam("Buscando escudo...");
        };

        brasilAnchor.onTargetLost = () => {
          if (destroyed) return;
          brasilVideoPanel.video.pause();
          brasilVideoPanel.video.currentTime = 0;
          setDetectedTeam("Buscando escudo...");
        };

        await mindarThree.start();

        if (!destroyed) {
          setStatusText("Cámara activa");
        }

        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      } catch (error) {
        console.error("Error al iniciar MindAR:", error);

        if (!destroyed) {
          setStatusText("Error al iniciar AR");
          setDetectedTeam("No se pudo abrir el escáner");
        }
      }
    };

    startAR();

    return () => {
      destroyed = true;

      createdVideos.forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      });

      if (renderer) {
        renderer.setAnimationLoop(null);
      }

      if (mindarThree) {
        mindarThree.stop();
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="ar-wrapper">
      <div ref={containerRef} className="ar-host" />
      <p className="ar-detected-label">{statusText}</p>
      <p className="ar-detected-label">{detectedTeam}</p>
    </div>
  );
}

export default function App() {
  const [modalType, setModalType] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showARScreen, setShowARScreen] = useState(false);

  // Preguntas de la trivia sobre Qatar 2022
  const triviaQuestions = [
    {
      q: "¿Qué selección ganó el Mundial de Qatar 2022?",
      options: ["Argentina", "Francia", "Croacia", "Brasil"],
      correctIndex: 0,
    },
    {
      q: "¿Contra qué selección ganó Argentina la final de Qatar 2022?",
      options: ["Francia", "Croacia", "Marruecos", "Países Bajos"],
      correctIndex: 0,
    },
    {
      q: "¿En qué estadio se jugó la final de Qatar 2022?",
      options: [
        "Lusail Iconic Stadium",
        "Al Bayt Stadium",
        "Education City Stadium",
        "Al Thumama Stadium",
      ],
      correctIndex: 0,
    },
    {
      q: "¿Qué jugador ganó la Bota de Oro (máximo goleador) en Qatar 2022?",
      options: [
        "Kylian Mbappé",
        "Lionel Messi",
        "Julián Álvarez",
        "Olivier Giroud",
      ],
      correctIndex: 0,
    },
    {
      q: "¿Qué selección quedó en tercer lugar en Qatar 2022?",
      options: ["Croacia", "Marruecos", "Argentina", "Francia"],
      correctIndex: 0,
    },
    {
      q: "¿Qué selección eliminó a Brasil en cuartos de final en Qatar 2022?",
      options: ["Croacia", "Argentina", "Francia", "Portugal"],
      correctIndex: 0,
    },
    {
      q: "¿Qué selección fue la sorpresa del torneo al llegar a semifinales por primera vez en África?",
      options: ["Marruecos", "Senegal", "Ghana", "Camerún"],
      correctIndex: 0,
    },
    {
      q: "¿Quién ganó el premio al Mejor Jugador Joven en Qatar 2022?",
      options: ["Enzo Fernández", "Jude Bellingham", "Pedri", "Gavi"],
      correctIndex: 0,
    },
  ];

  // Estado de la trivia
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaAnswers, setTriviaAnswers] = useState(
    Array(triviaQuestions.length).fill(null)
  );
  const [triviaFinished, setTriviaFinished] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaGrade, setTriviaGrade] = useState("");

  // Contenido de modales
  const modalContent = {
    manual: {
      title: "Manual de uso (Modo AR)",
      steps: [
        "Abre “Modo AR”. Acepta el permiso de cámara si te lo pide el navegador.",
        "Coloca frente a la cámara uno de los escudos incluidos en targets.mind.",
        "Procura usar una imagen clara, con buena iluminación y sin reflejos.",
        "Mantén el celular estable mientras apuntas al escudo.",
        "Cuando el escudo sea reconocido, aparecerá el nombre de la selección detectada.",
        "Si no detecta nada, acércate o aléjate un poco y verifica que el escudo esté completo dentro de la vista.",
      ],
      notes: [
        "Esta versión reconoce los escudos de México, Argentina y Brasil.",
        "Más adelante esta misma base servirá para mostrar contenido 3D encima del escudo.",
      ],
    },
    trivia: {
      title: "Trivia (Qatar 2022)",
      text: "Responde las preguntas y al final verás tu puntuación y calificación.",
    },
  };

  // Abre un modal
  const openModal = (type) => {
    setIsClosing(false);
    setModalType(type);
  };

  // Cierra un modal con animación
  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setModalType(null);
      setIsClosing(false);
    }, 250);
  };

  // Cierra el modal con ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && modalType) closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalType]);

  // Reinicia trivia al abrirla
  useEffect(() => {
    if (modalType === "trivia" && !isClosing) {
      setTriviaIndex(0);
      setTriviaAnswers(Array(triviaQuestions.length).fill(null));
      setTriviaFinished(false);
      setTriviaScore(0);
      setTriviaGrade("");
    }
  }, [modalType, isClosing]);

  const computeGrade = (score, total) => {
    const pct = total === 0 ? 0 : score / total;

    if (pct >= 0.9) return "Leyenda";
    if (pct >= 0.7) return "Experto";
    if (pct >= 0.45) return "Fan";
    return "Principiante";
  };

  const selectTriviaOption = (optionIndex) => {
    setTriviaAnswers((prev) => {
      const copy = [...prev];
      copy[triviaIndex] = optionIndex;
      return copy;
    });
  };

  const nextTriviaQuestion = () => {
    if (triviaIndex < triviaQuestions.length - 1) {
      setTriviaIndex((i) => i + 1);
    }
  };

  const prevTriviaQuestion = () => {
    if (triviaIndex > 0) {
      setTriviaIndex((i) => i - 1);
    }
  };

  const finishTrivia = () => {
    let score = 0;

    for (let i = 0; i < triviaQuestions.length; i++) {
      if (triviaAnswers[i] === triviaQuestions[i].correctIndex) score++;
    }

    setTriviaScore(score);
    setTriviaGrade(computeGrade(score, triviaQuestions.length));
    setTriviaFinished(true);
  };

  const restartTrivia = () => {
    setTriviaIndex(0);
    setTriviaAnswers(Array(triviaQuestions.length).fill(null));
    setTriviaFinished(false);
    setTriviaScore(0);
    setTriviaGrade("");
  };

  const content = modalType ? modalContent[modalType] : null;
  const currentTrivia = triviaQuestions[triviaIndex];
  const selectedOption = triviaAnswers[triviaIndex];
  const answeredCount = triviaAnswers.filter((a) => a !== null).length;

  return (
    <div className="container">
      <h1>Aplicación AR</h1>

      <button onClick={() => setShowARScreen(true)}>Modo AR</button>
      <button onClick={() => openModal("manual")}>Manual de uso</button>
      <button onClick={() => openModal("trivia")}>Trivia</button>

      {showARScreen && (
        <div className="ar-screen">
          <div className="ar-screen-header">
            <h2>Modo AR</h2>
            <button
              className="ar-screen-close"
              onClick={() => setShowARScreen(false)}
            >
              Cerrar
            </button>
          </div>

          <div className="ar-screen-body">
            <ARShieldScanner key={showARScreen ? "open" : "closed"} />
          </div>
        </div>
      )}

      {content && (
        <div
          className={`modal-overlay ${isClosing ? "closing" : ""}`}
          onClick={closeModal}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{content.title}</h2>

            {modalType === "manual" ? (
              <>
                {content.steps ? (
                  <div className="manual">
                    <ol>
                      {content.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>

                    {content.notes ? (
                      <div className="manual-notes">
                        {content.notes.map((n, i) => (
                          <p key={i}>{n}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="modal-text">{content.text}</p>
                )}
              </>
            ) : modalType === "trivia" ? (
              <>
                {!triviaFinished ? (
                  <div className="trivia">
                    <p className="trivia-progress">
                      Pregunta {triviaIndex + 1} de {triviaQuestions.length}{" "}
                      (Respondidas: {answeredCount})
                    </p>

                    <h3 className="trivia-question">{currentTrivia.q}</h3>

                    <div className="trivia-options">
                      {currentTrivia.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`trivia-option ${
                            selectedOption === idx ? "selected" : ""
                          }`}
                          onClick={() => selectTriviaOption(idx)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="trivia-actions">
                      <button
                        type="button"
                        onClick={prevTriviaQuestion}
                        disabled={triviaIndex === 0}
                      >
                        Anterior
                      </button>

                      {triviaIndex < triviaQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={nextTriviaQuestion}
                          disabled={selectedOption === null}
                        >
                          Siguiente
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={finishTrivia}
                          disabled={selectedOption === null}
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="trivia-result">
                    <p className="trivia-score">
                      Puntuación: {triviaScore} / {triviaQuestions.length}
                    </p>

                    <p className="trivia-grade">
                      Calificación: {triviaGrade}
                    </p>

                    <div className="trivia-review">
                      {triviaQuestions.map((q, i) => {
                        const user = triviaAnswers[i];
                        const correct = q.correctIndex;
                        const ok = user === correct;

                        return (
                          <div className="trivia-review-item" key={i}>
                            <p className="trivia-review-q">
                              {i + 1}. {q.q}
                            </p>
                            <p
                              className={`trivia-review-a ${
                                ok ? "ok" : "bad"
                              }`}
                            >
                              Tu respuesta:{" "}
                              {user === null
                                ? "Sin responder"
                                : q.options[user]}
                            </p>
                            {!ok && (
                              <p className="trivia-review-correct">
                                Correcta: {q.options[correct]}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button type="button" onClick={restartTrivia}>
                      Reintentar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="modal-text">{content.text}</p>
            )}

            <button className="modal-close" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}