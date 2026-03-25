import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

export default function MindARTest() {
  const containerRef = useRef(null);

  const [status, setStatus] = useState("Preparando prueba...");
  const [detected, setDetected] = useState("Buscando escudo...");
  const [videoInfo, setVideoInfo] = useState("Sin datos de video");

  useEffect(() => {
    let mindarThree = null;
    let renderer = null;
    let destroyed = false;
    let infoInterval = null;

    const startTest = async () => {
      try {
        setStatus("Esperando contenedor...");

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

        setStatus("Iniciando MindAR...");

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

        const mexicoAnchor = mindarThree.addAnchor(0);
        const argentinaAnchor = mindarThree.addAnchor(1);
        const brasilAnchor = mindarThree.addAnchor(2);

        const makeInvisiblePlane = () => {
          const geometry = new THREE.PlaneGeometry(1, 0.6);
          const material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
          });
          return new THREE.Mesh(geometry, material);
        };

        mexicoAnchor.group.add(makeInvisiblePlane());
        argentinaAnchor.group.add(makeInvisiblePlane());
        brasilAnchor.group.add(makeInvisiblePlane());

        mexicoAnchor.onTargetFound = () => {
          if (!destroyed) setDetected("Escudo detectado: México");
        };

        argentinaAnchor.onTargetFound = () => {
          if (!destroyed) setDetected("Escudo detectado: Argentina");
        };

        brasilAnchor.onTargetFound = () => {
          if (!destroyed) setDetected("Escudo detectado: Brasil");
        };

        mexicoAnchor.onTargetLost = () => {
          if (!destroyed) setDetected("Buscando escudo...");
        };

        argentinaAnchor.onTargetLost = () => {
          if (!destroyed) setDetected("Buscando escudo...");
        };

        brasilAnchor.onTargetLost = () => {
          if (!destroyed) setDetected("Buscando escudo...");
        };

        await mindarThree.start();

        if (!destroyed) {
          setStatus("Cámara iniciada");
        }

        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });

        // Revisar el video interno que crea MindAR
        infoInterval = setInterval(() => {
          if (!containerRef.current || destroyed) return;

          const videoEl = containerRef.current.querySelector("video");
          const canvasEls = containerRef.current.querySelectorAll("canvas");

          if (!videoEl) {
            setVideoInfo(`Video: no encontrado | canvas: ${canvasEls.length}`);
            return;
          }

          setVideoInfo(
            `Video encontrado | readyState: ${videoEl.readyState} | ` +
              `size: ${videoEl.videoWidth}x${videoEl.videoHeight} | ` +
              `paused: ${videoEl.paused} | canvas: ${canvasEls.length}`
          );
        }, 1000);
      } catch (error) {
        console.error("Error en prueba MindAR:", error);
        if (!destroyed) {
          setStatus("Error al iniciar MindAR");
          setDetected("La prueba falló");
          setVideoInfo(String(error));
        }
      }
    };

    startTest();

    return () => {
      destroyed = true;

      if (infoInterval) {
        clearInterval(infoInterval);
      }

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
    <div className="mindar-test-page">
      <h1>Prueba MindAR</h1>

      <div className="mindar-test-host" ref={containerRef} />

      <p className="mindar-test-text">{status}</p>
      <p className="mindar-test-text">{detected}</p>
      <p className="mindar-test-debug">{videoInfo}</p>
    </div>
  );
}