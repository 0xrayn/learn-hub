"use client";
import { useEffect, useRef } from "react";

export default function BitcoinGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: any;

    const init = async () => {
      // Dynamically import Three.js to avoid SSR issues
      const threeModule = await import("three");
      THREE = threeModule;

      const scene = new THREE.Scene();
      const w = canvas.parentElement?.clientWidth || 500;
      const h = canvas.parentElement?.clientHeight || 500;
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      camera.position.z = 5.5;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // --- Outer ring glow ---
      const makeRing = (radius: number, tube: number, color: number, opacity: number, rotX: number, rotZ: number) => {
        const geo = new THREE.TorusGeometry(radius, tube, 20, 120);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = rotX;
        mesh.rotation.z = rotZ;
        return mesh;
      };

      const ring1 = makeRing(2.8, 0.012, 0xe8002d, 0.7, Math.PI / 2, 0);
      const ring2 = makeRing(2.6, 0.008, 0xff4d6d, 0.45, Math.PI / 3, 0.3);
      const ring3 = makeRing(3.0, 0.006, 0xff9a3c, 0.25, Math.PI / 6, -0.5);
      scene.add(ring1, ring2, ring3);

      // --- Wireframe globe ---
      const sphereGeo = new THREE.SphereGeometry(2.2, 28, 28);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xe8002d, wireframe: true, transparent: true, opacity: 0.12,
      });
      const sphere = new THREE.Mesh(sphereGeo, wireMat);
      scene.add(sphere);

      // --- Inner solid sphere with glow effect ---
      const innerGeo = new THREE.SphereGeometry(1.8, 32, 32);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x1a0008, transparent: true, opacity: 0.8,
      });
      const innerSphere = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerSphere);

      // --- Glowing dots on sphere surface ---
      const dotCount = 180;
      const dotPositions = new Float32Array(dotCount * 3);
      for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotCount);
        const theta = Math.sqrt(dotCount * Math.PI) * phi;
        const r = 2.25;
        dotPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        dotPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        dotPositions[i * 3 + 2] = r * Math.cos(phi);
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
      const dotMat = new THREE.PointsMaterial({ color: 0xe8002d, size: 0.06, transparent: true, opacity: 0.9 });
      const dots = new THREE.Points(dotGeo, dotMat);
      scene.add(dots);

      // --- Orbiting particles ---
      const particleCount = 60;
      const pPos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3.2 + Math.sin(i * 1.5) * 0.3;
        pPos[i * 3] = radius * Math.cos(angle);
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 2;
        pPos[i * 3 + 2] = radius * Math.sin(angle);
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0xff4d6d, size: 0.04, transparent: true, opacity: 0.7 });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // --- Connection lines (network effect) ---
      const lineCount = 12;
      for (let i = 0; i < lineCount; i++) {
        const phi1 = Math.random() * Math.PI;
        const theta1 = Math.random() * Math.PI * 2;
        const phi2 = Math.random() * Math.PI;
        const theta2 = Math.random() * Math.PI * 2;
        const r = 2.25;
        const pts = [
          new THREE.Vector3(r * Math.sin(phi1) * Math.cos(theta1), r * Math.cos(phi1), r * Math.sin(phi1) * Math.sin(theta1)),
          new THREE.Vector3(r * Math.sin(phi2) * Math.cos(theta2), r * Math.cos(phi2), r * Math.sin(phi2) * Math.sin(theta2)),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xe8002d, transparent: true, opacity: 0.2 });
        scene.add(new THREE.Line(lineGeo, lineMat));
      }

      // Mouse parallax
      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove);

      // Resize handler
      const onResize = () => {
        if (!canvas.parentElement) return;
        const w2 = canvas.parentElement.clientWidth;
        const h2 = canvas.parentElement.clientHeight;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      };
      window.addEventListener("resize", onResize);

      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.005;

        sphere.rotation.y += 0.004;
        sphere.rotation.x += 0.001;
        innerSphere.rotation.y -= 0.002;
        dots.rotation.y += 0.003;
        dots.rotation.x += 0.0008;
        particles.rotation.y -= 0.006;
        ring1.rotation.z += 0.005;
        ring2.rotation.z -= 0.004;
        ring3.rotation.z += 0.003;

        // Mouse parallax
        scene.rotation.y += (mouse.x * 0.4 - scene.rotation.y) * 0.04;
        scene.rotation.x += (mouse.y * 0.3 - scene.rotation.x) * 0.04;

        // Pulsing opacity on dots
        dotMat.opacity = 0.7 + Math.sin(t * 2) * 0.2;

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };

    const cleanup = init();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
