import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

export default function ARShieldScanner() {
  const containerRef = useRef(null);
  const [detectedTeam, setDetectedTeam] = useState("Buscando escudo...");

  useEffect(() => {
    let mindarThree = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let stopped = false;

    const startAR = async () => {
      if (!containerRef.current) return;

      // Crea la experiencia AR usando el archivo targets.mind del directorio public
      mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/targets.mind",
        uiScanning: true,
        uiLoading: true,
        uiError: true,
      });

      ({ renderer, scene, camera } = mindarThree);

      // Luz básica para que más adelante puedas meter modelos 3D sin rehacer la escena
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Anchors:
      // 0 = México
      // 1 = Argentina
      // 2 = Brasil
      // Si el orden en tu compiler fue distinto, aquí cambias los nombres.
      const mexicoAnchor = mindarThree.addAnchor(0);
      const argentinaAnchor = mindarThree.addAnchor(1);
      const brasilAnchor = mindarThree.addAnchor(2);

      // Planos invisibles para asegurar que cada anchor tenga contenido
      // Más adelante aquí puedes cambiar por modelos 3D o paneles.
      const makeInvisiblePlane = () => {
        const geometry = new THREE.PlaneGeometry(1, 0.6);
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
        });
        return new THREE.Mesh(geometry, material);
      };

      mexicoAnchor.group.add(makeInvisiblePlane());
      argentinaAnchor.group.add(makeInvisiblePlane());
      brasilAnchor.group.add(makeInvisiblePlane());

      await mindarThree.start();

      renderer.setAnimationLoop(() => {
        if (stopped) return;

        let found = "Buscando escudo...";

        if (mexicoAnchor.group.visible) {
          found = "Escudo detectado: México";
        } else if (argentinaAnchor.group.visible) {
          found = "Escudo detectado: Argentina";
        } else if (brasilAnchor.group.visible) {
          found = "Escudo detectado: Brasil";
        }

        setDetectedTeam((prev) => (prev === found ? prev : found));
        renderer.render(scene, camera);
      });
    };

    startAR();

    return () => {
      stopped = true;

      if (renderer) {
        renderer.setAnimationLoop(null);
      }

      if (mindarThree) {
        mindarThree.stop();
      }

      // Limpia el contenedor por si vuelves a abrir el modal
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="ar-wrapper">
      <div ref={containerRef} className="ar-host" />
      <p className="ar-detected-label">{detectedTeam}</p>
    </div>
  );
}