import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ARScannerToolbar from "./ARScannerToolbar";
import "./ARShieldScanner.css";

export default function ARShieldScanner({ onOpenManual, onOpenTrivia }) {
  const containerRef = useRef(null);
  const scanWindowRef = useRef(null);
  const mindarRef = useRef(null);
  const rendererRef = useRef(null);

  const targetTrackedRef = useRef(false);
  const resetRequestedRef = useRef(false);
  const modelEnabledRef = useRef(true);
  const modelAnimatingRef = useRef(true);

  const mexicoModelRef = useRef(null);
  const brazilModelRef = useRef(null);
  const argentinaModelRef = useRef(null);

  const mexicoSpawnProgressRef = useRef(1);
  const brazilSpawnProgressRef = useRef(1);
  const argentinaSpawnProgressRef = useRef(1);

  const [statusText, setStatusText] = useState("Listo para iniciar");
  const [detectedTeam, setDetectedTeam] = useState("Escaneo detenido");
  const [isScanning, setIsScanning] = useState(false);
  const [modelEnabled, setModelEnabled] = useState(true);
  const [isModelAnimating, setIsModelAnimating] = useState(true);

  const applySpawnScale = (model, progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const scale = 2 * clamped;
    model.scale.set(scale, scale, scale);
  };

  const prepareModel = (model) => {
    model.position.set(0, -0.15, 0);
    model.rotation.set(0, Math.PI, 0);
    model.visible = false;
    model.scale.set(0, 0, 0);
  };

  const hideAllModels = () => {
    if (mexicoModelRef.current) mexicoModelRef.current.visible = false;
    if (brazilModelRef.current) brazilModelRef.current.visible = false;
    if (argentinaModelRef.current) argentinaModelRef.current.visible = false;
  };

  const resetSpawnProgress = (team) => {
    if (team === "mexico") mexicoSpawnProgressRef.current = 0;
    if (team === "brazil") brazilSpawnProgressRef.current = 0;
    if (team === "argentina") argentinaSpawnProgressRef.current = 0;
  };

  const startAR = async () => {
    try {
      if (isScanning) return;

      setIsScanning(true);
      setStatusText("Inicializando cámara...");
      setDetectedTeam("Preparando escaneo...");

      resetRequestedRef.current = false;
      targetTrackedRef.current = false;
      modelEnabledRef.current = modelEnabled;
      modelAnimatingRef.current = isModelAnimating;

      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/targets.mind",
        uiScanning: false,
        uiLoading: false,
        uiError: false,
      });

      mindarRef.current = mindarThree;

      const { renderer, scene, camera } = mindarThree;
      rendererRef.current = renderer;

      renderer.setClearColor(0x000000, 0);

      await mindarThree.start();

      setStatusText("MindAR iniciado correctamente");
      setDetectedTeam("Coloca el escudo dentro del área");

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(0, 2, 1);
      scene.add(dirLight);

      // ORDEN REAL DEL targets.mind
      // 0 = México
      // 1 = Brasil
      // 2 = Argentina
      const mexicoAnchor = mindarThree.addAnchor(0);
      const brazilAnchor = mindarThree.addAnchor(1);
      const argentinaAnchor = mindarThree.addAnchor(2);

      const loader = new GLTFLoader();

      loader.load(
        "/models/model.glb",
        (gltf) => {
          const mexicoModel = gltf.scene.clone(true);
          prepareModel(mexicoModel);
          mexicoAnchor.group.add(mexicoModel);
          mexicoModelRef.current = mexicoModel;

          const brazilModel = gltf.scene.clone(true);
          prepareModel(brazilModel);
          brazilAnchor.group.add(brazilModel);
          brazilModelRef.current = brazilModel;

          const argentinaModel = gltf.scene.clone(true);
          prepareModel(argentinaModel);
          argentinaAnchor.group.add(argentinaModel);
          argentinaModelRef.current = argentinaModel;

          mexicoSpawnProgressRef.current = 1;
          brazilSpawnProgressRef.current = 1;
          argentinaSpawnProgressRef.current = 1;

          setStatusText("Modelo GLB cargado correctamente");
        },
        undefined,
        (error) => {
          console.error(error);
          setStatusText("Error cargando model.glb");
        }
      );

      const worldPosition = new THREE.Vector3();

      const isAnchorInsideScanArea = (anchor) => {
        if (!containerRef.current || !scanWindowRef.current) return false;

        anchor.group.updateMatrixWorld(true);
        worldPosition.setFromMatrixPosition(anchor.group.matrixWorld);
        worldPosition.project(camera);

        const hostRect = containerRef.current.getBoundingClientRect();
        const scanRect = scanWindowRef.current.getBoundingClientRect();

        const screenX = ((worldPosition.x + 1) / 2) * hostRect.width;
        const screenY = ((-worldPosition.y + 1) / 2) * hostRect.height;

        const scanLeft = scanRect.left - hostRect.left;
        const scanTop = scanRect.top - hostRect.top;
        const scanRight = scanLeft + scanRect.width;
        const scanBottom = scanTop + scanRect.height;

        return (
          screenX >= scanLeft &&
          screenX <= scanRight &&
          screenY >= scanTop &&
          screenY <= scanBottom
        );
      };

      mexicoAnchor.onTargetFound = () => {
        if (resetRequestedRef.current) {
          setStatusText("Quita el escudo y vuelve a colocarlo");
          setDetectedTeam("Reinicio pendiente");
          return;
        }

        targetTrackedRef.current = true;

        if (isAnchorInsideScanArea(mexicoAnchor)) {
          hideAllModels();
          resetSpawnProgress("mexico");

          if (mexicoModelRef.current) {
            mexicoModelRef.current.visible = modelEnabledRef.current;
          }

          setStatusText("Escaneo válido");
          setDetectedTeam(
            modelEnabledRef.current
              ? "Escudo detectado: México"
              : "Escudo detectado: México (modelo oculto)"
          );
        } else {
          hideAllModels();
          setStatusText("Fuera del área de escaneo");
          setDetectedTeam("Mueve el escudo al centro del cuadro");
        }
      };

      brazilAnchor.onTargetFound = () => {
        if (resetRequestedRef.current) {
          setStatusText("Quita el escudo y vuelve a colocarlo");
          setDetectedTeam("Reinicio pendiente");
          return;
        }

        targetTrackedRef.current = true;

        if (isAnchorInsideScanArea(brazilAnchor)) {
          hideAllModels();
          resetSpawnProgress("brazil");

          if (brazilModelRef.current) {
            brazilModelRef.current.visible = modelEnabledRef.current;
          }

          setStatusText("Escaneo válido");
          setDetectedTeam(
            modelEnabledRef.current
              ? "Escudo detectado: Brasil"
              : "Escudo detectado: Brasil (modelo oculto)"
          );
        } else {
          hideAllModels();
          setStatusText("Fuera del área de escaneo");
          setDetectedTeam("Mueve el escudo al centro del cuadro");
        }
      };

      argentinaAnchor.onTargetFound = () => {
        if (resetRequestedRef.current) {
          setStatusText("Quita el escudo y vuelve a colocarlo");
          setDetectedTeam("Reinicio pendiente");
          return;
        }

        targetTrackedRef.current = true;

        if (isAnchorInsideScanArea(argentinaAnchor)) {
          hideAllModels();
          resetSpawnProgress("argentina");

          if (argentinaModelRef.current) {
            argentinaModelRef.current.visible = modelEnabledRef.current;
          }

          setStatusText("Escaneo válido");
          setDetectedTeam(
            modelEnabledRef.current
              ? "Escudo detectado: Argentina"
              : "Escudo detectado: Argentina (modelo oculto)"
          );
        } else {
          hideAllModels();
          setStatusText("Fuera del área de escaneo");
          setDetectedTeam("Mueve el escudo al centro del cuadro");
        }
      };

      const handleLost = () => {
        targetTrackedRef.current = false;
        hideAllModels();

        if (resetRequestedRef.current) {
          resetRequestedRef.current = false;
          setStatusText("Detección reiniciada");
          setDetectedTeam("Vuelve a colocar el escudo en el área");
        } else {
          setStatusText("Target perdido");
          setDetectedTeam("Coloca el escudo dentro del área");
        }
      };

      mexicoAnchor.onTargetLost = handleLost;
      brazilAnchor.onTargetLost = handleLost;
      argentinaAnchor.onTargetLost = handleLost;

      renderer.setAnimationLoop(() => {
        const modelEntries = [
          {
            model: mexicoModelRef.current,
            progressRef: mexicoSpawnProgressRef,
          },
          {
            model: brazilModelRef.current,
            progressRef: brazilSpawnProgressRef,
          },
          {
            model: argentinaModelRef.current,
            progressRef: argentinaSpawnProgressRef,
          },
        ];

        modelEntries.forEach(({ model, progressRef }) => {
          if (!model) return;

          if (model.visible && progressRef.current < 1) {
            progressRef.current += 0.08;
            applySpawnScale(model, progressRef.current);
          }

          if (!model.visible) {
            progressRef.current = 1;
            model.scale.set(0, 0, 0);
          }

          if (model.visible && progressRef.current >= 1) {
            model.scale.set(2, 2, 2);
          }

          if (model.visible && modelAnimatingRef.current) {
            model.rotation.y += 0.01;
          }
        });

        renderer.render(scene, camera);
      });
    } catch (error) {
      console.error(error);
      setStatusText("Error iniciando AR");
      setDetectedTeam("No se pudo abrir el escáner");
      setIsScanning(false);
    }
  };

  const stopAR = () => {
    if (rendererRef.current) {
      rendererRef.current.setAnimationLoop(null);
    }

    if (mindarRef.current) {
      mindarRef.current.stop();
      mindarRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    targetTrackedRef.current = false;
    resetRequestedRef.current = false;

    mexicoModelRef.current = null;
    brazilModelRef.current = null;
    argentinaModelRef.current = null;

    mexicoSpawnProgressRef.current = 1;
    brazilSpawnProgressRef.current = 1;
    argentinaSpawnProgressRef.current = 1;

    setIsScanning(false);
    setStatusText("Escaneo detenido");
    setDetectedTeam("Listo para iniciar");
  };

  const handleResetDetection = () => {
    resetRequestedRef.current = true;
    targetTrackedRef.current = false;

    hideAllModels();

    setStatusText("Detección reiniciada");
    setDetectedTeam("Quita el escudo y vuelve a colocarlo");
  };

  const handleToggleModel = () => {
    const next = !modelEnabledRef.current;
    modelEnabledRef.current = next;
    setModelEnabled(next);

    if (!next) {
      hideAllModels();
    }

    if (targetTrackedRef.current) {
      setDetectedTeam((prev) => {
        if (!next) {
          if (prev.includes("México")) return "Escudo detectado: México (modelo oculto)";
          if (prev.includes("Brasil")) return "Escudo detectado: Brasil (modelo oculto)";
          if (prev.includes("Argentina")) return "Escudo detectado: Argentina (modelo oculto)";
        }
        return prev;
      });
    }
  };

  const handleToggleInteraction = () => {
    const next = !modelAnimatingRef.current;
    modelAnimatingRef.current = next;
    setIsModelAnimating(next);

    setStatusText(next ? "Giro reanudado" : "Giro pausado");
  };

  const handleManual = () => {
    if (typeof onOpenManual === "function") {
      onOpenManual();
    }
  };

  const handleTrivia = () => {
    if (typeof onOpenTrivia === "function") {
      onOpenTrivia();
    }
  };

  useEffect(() => {
    modelEnabledRef.current = modelEnabled;
  }, [modelEnabled]);

  useEffect(() => {
    modelAnimatingRef.current = isModelAnimating;
  }, [isModelAnimating]);

  useEffect(() => {
    return () => stopAR();
  }, []);

  return (
    <div className="ar-wrapper">
      <div className="ar-stage">
        <div ref={containerRef} className="ar-host" />

        <div className="scan-mask">
          <div ref={scanWindowRef} className="scan-window">
            <div className="scan-corner top-left" />
            <div className="scan-corner top-right" />
            <div className="scan-corner bottom-left" />
            <div className="scan-corner bottom-right" />
          </div>
        </div>

        <ARScannerToolbar
          isScanning={isScanning}
          modelEnabled={modelEnabled}
          isModelAnimating={isModelAnimating}
          onStart={startAR}
          onReset={handleResetDetection}
          onToggleModel={handleToggleModel}
          onToggleInteraction={handleToggleInteraction}
          onStop={stopAR}
          onManual={handleManual}
          onTrivia={handleTrivia}
        />
      </div>

      <p className="ar-detected-label">{statusText}</p>
      <p className="ar-detected-label">{detectedTeam}</p>
    </div>
  );
}