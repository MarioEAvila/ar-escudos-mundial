import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ARScannerToolbar from "./ARScannerToolbar";
import "./ARShieldScanner.css";

const COUNTRIES = [
  { id: "mexico", name: "México", targetIndex: 0 },
  { id: "argentina", name: "Argentina", targetIndex: 1 },
  { id: "brazil", name: "Brasil", targetIndex: 2 },
  { id: "france", name: "Francia", targetIndex: 3 },
  { id: "germany", name: "Alemania", targetIndex: 4 },
  { id: "spain", name: "España", targetIndex: 5 },
  { id: "england", name: "Inglaterra", targetIndex: 6 },
  { id: "portugal", name: "Portugal", targetIndex: 7 },
  { id: "uruguay", name: "Uruguay", targetIndex: 8 },
  { id: "netherlands", name: "Países Bajos", targetIndex: 9 },
  { id: "italy", name: "Italia", targetIndex: 10 },
  { id: "japan", name: "Japón", targetIndex: 11 },
];

export default function ARShieldScanner({ onOpenManual, onOpenTrivia }) {
  const containerRef = useRef(null);
  const scanWindowRef = useRef(null);
  const mindarRef = useRef(null);
  const rendererRef = useRef(null);

  const anchorsRef = useRef({});
  const modelsRef = useRef({});
  const spawnProgressRef = useRef({});
  const activeCountryRef = useRef(null);

  const resetRequestedRef = useRef(false);
  const modelEnabledRef = useRef(true);
  const modelAnimatingRef = useRef(true);

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
    Object.values(modelsRef.current).forEach((model) => {
      if (model) {
        model.visible = false;
        model.scale.set(0, 0, 0);
      }
    });
  };

  const resetSpawnProgress = (countryId) => {
    spawnProgressRef.current[countryId] = 0;
  };

  const getCountryName = (countryId) => {
    return COUNTRIES.find((country) => country.id === countryId)?.name || countryId;
  };

  const startAR = async () => {
    try {
      if (isScanning) return;

      setIsScanning(true);
      setStatusText("Inicializando cámara...");
      setDetectedTeam("Preparando escaneo...");

      resetRequestedRef.current = false;
      activeCountryRef.current = null;
      modelEnabledRef.current = modelEnabled;
      modelAnimatingRef.current = isModelAnimating;
      anchorsRef.current = {};
      modelsRef.current = {};
      spawnProgressRef.current = {};

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

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(0, 2, 1);
      scene.add(dirLight);

      COUNTRIES.forEach((country) => {
        const anchor = mindarThree.addAnchor(country.targetIndex);
        anchorsRef.current[country.id] = anchor;
        spawnProgressRef.current[country.id] = 1;

        anchor.onTargetFound = () => {
          if (resetRequestedRef.current) {
            setStatusText("Quita el escudo y vuelve a colocarlo");
            setDetectedTeam("Reinicio pendiente");
            return;
          }

          activeCountryRef.current = country.id;
          resetSpawnProgress(country.id);

          setStatusText("Escudo detectado, validando posición...");
          setDetectedTeam(`Escudo detectado: ${country.name}`);
        };

        anchor.onTargetLost = () => {
          if (activeCountryRef.current === country.id) {
            activeCountryRef.current = null;
          }

          const model = modelsRef.current[country.id];
          if (model) {
            model.visible = false;
            model.scale.set(0, 0, 0);
          }

          if (resetRequestedRef.current) {
            resetRequestedRef.current = false;
            setStatusText("Detección reiniciada");
            setDetectedTeam("Vuelve a colocar el escudo en el área");
          } else {
            setStatusText("Target perdido");
            setDetectedTeam("Coloca el escudo dentro del área");
          }
        };
      });

      const loader = new GLTFLoader();

      loader.load(
        "/models/model.glb",
        (gltf) => {
          COUNTRIES.forEach((country) => {
            const anchor = anchorsRef.current[country.id];
            if (!anchor) return;

            const model = gltf.scene.clone(true);
            prepareModel(model);

            anchor.group.add(model);
            modelsRef.current[country.id] = model;
            spawnProgressRef.current[country.id] = 1;
          });

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
        if (!containerRef.current || !scanWindowRef.current || !anchor) return false;

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

      await mindarThree.start();

      setStatusText("Cámara activa");
      setDetectedTeam("Coloca el escudo dentro del área");

      renderer.setAnimationLoop(() => {
        const activeCountryId = activeCountryRef.current;

        Object.entries(modelsRef.current).forEach(([countryId, model]) => {
          if (!model) return;

          const anchor = anchorsRef.current[countryId];
          const isActive = activeCountryId === countryId;
          const isInside = isActive && isAnchorInsideScanArea(anchor);

          if (resetRequestedRef.current) {
            model.visible = false;
            model.scale.set(0, 0, 0);
            return;
          }

          if (isInside) {
            Object.entries(modelsRef.current).forEach(([otherId, otherModel]) => {
              if (otherId !== countryId && otherModel) {
                otherModel.visible = false;
                otherModel.scale.set(0, 0, 0);
              }
            });

            model.visible = modelEnabledRef.current;

            const countryName = getCountryName(countryId);

            setStatusText("Escaneo válido");
            setDetectedTeam(
              modelEnabledRef.current
                ? `Escudo detectado: ${countryName}`
                : `Escudo detectado: ${countryName} (modelo oculto)`
            );

            if (model.visible && spawnProgressRef.current[countryId] < 1) {
              spawnProgressRef.current[countryId] += 0.08;
              applySpawnScale(model, spawnProgressRef.current[countryId]);
            }

            if (model.visible && spawnProgressRef.current[countryId] >= 1) {
              model.scale.set(2, 2, 2);
            }

            if (model.visible && modelAnimatingRef.current) {
              model.rotation.y += 0.01;
            }
          } else {
            model.visible = false;
            model.scale.set(0, 0, 0);

            if (isActive) {
              setStatusText("Fuera del área de escaneo");
              setDetectedTeam("Mueve el escudo al centro del cuadro");
            }
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

    activeCountryRef.current = null;
    resetRequestedRef.current = false;
    anchorsRef.current = {};
    modelsRef.current = {};
    spawnProgressRef.current = {};

    setIsScanning(false);
    setStatusText("Escaneo detenido");
    setDetectedTeam("Listo para iniciar");
  };

  const handleResetDetection = () => {
    resetRequestedRef.current = true;
    activeCountryRef.current = null;

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

    const activeCountryId = activeCountryRef.current;
    if (activeCountryId) {
      const countryName = getCountryName(activeCountryId);
      setDetectedTeam(
        next
          ? `Escudo detectado: ${countryName}`
          : `Escudo detectado: ${countryName} (modelo oculto)`
      );
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