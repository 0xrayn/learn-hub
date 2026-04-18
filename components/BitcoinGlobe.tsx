"use client";
import { useEffect, useRef } from "react";

function getThemeColors(): {
  primary: number;
  secondary: number;
  base: number;
  accent: number;
} {
  if (typeof window === "undefined")
    return {
      primary: 0x7c3aed,
      secondary: 0xa855f7,
      base: 0x0f0f1a,
      accent: 0x38bdf8,
    };

  const el = document.createElement("div");
  el.style.display = "none";
  document.body.appendChild(el);

  const toHex = (rgb: string): number => {
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return 0x333333;
    return (parseInt(m[0]) << 16) | (parseInt(m[1]) << 8) | parseInt(m[2]);
  };

  el.style.color = "oklch(var(--p))";
  const primary = toHex(getComputedStyle(el).color);

  el.style.color = "oklch(var(--s))";
  const secondary = toHex(getComputedStyle(el).color);

  el.style.color = "oklch(var(--b1))";
  const base = toHex(getComputedStyle(el).color);

  el.style.color = "oklch(var(--a))";
  const accent = toHex(getComputedStyle(el).color);

  document.body.removeChild(el);
  return { primary, secondary, base, accent };
}

export default function BitcoinGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let scene: any,
      renderer: any,
      camera: any;
    let wireMat: any,
      dotMat: any,
      pMat: any,
      innerMat: any,
      hexMat: any;
    let ring1: any,
      ring2: any,
      ring3: any;
    let sphere: any,
      innerSphere: any,
      dots: any,
      particles: any,
      hexGrid: any;

    const applyColors = () => {
      const { primary, secondary, base, accent } = getThemeColors();
      if (wireMat) wireMat.color.setHex(primary);
      if (dotMat) dotMat.color.setHex(primary);
      if (pMat) pMat.color.setHex(accent);
      if (innerMat) innerMat.color.setHex(base);
      if (hexMat) hexMat.color.setHex(secondary);
      if (ring1) ring1.material.color.setHex(primary);
      if (ring2) ring2.material.color.setHex(secondary);
      if (ring3) ring3.material.color.setHex(accent);
      if (scene) {
        scene.children.forEach((obj: any) => {
          if (obj.isLine && obj.material?.color) {
            obj.material.color.setHex(primary);
          }
        });
      }
    };

    const init = async () => {
      const THREE = await import("three");

      const { primary, secondary, base, accent } = getThemeColors();

      scene = new THREE.Scene();
      const w = canvas.parentElement?.clientWidth || 500;
      const h = canvas.parentElement?.clientHeight || 500;
      const camera2 = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
      camera = camera2;
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // ─── Orbital Rings ───────────────────────────────
      const makeRing = (
        radius: number,
        tube: number,
        color: number,
        opacity: number,
        rotX: number,
        rotZ: number
      ) => {
        const geo = new THREE.TorusGeometry(radius, tube, 24, 140);
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = rotX;
        mesh.rotation.z = rotZ;
        return mesh;
      };

      ring1 = makeRing(3.0, 0.015, primary, 0.8, Math.PI / 2, 0);
      ring2 = makeRing(2.7, 0.01, secondary, 0.5, Math.PI / 3, 0.4);
      ring3 = makeRing(3.3, 0.007, accent, 0.25, Math.PI / 5, -0.6);
      scene.add(ring1, ring2, ring3);

      // ─── Wireframe Globe ─────────────────────────────
      const sphereGeo = new THREE.SphereGeometry(2.3, 32, 32);
      wireMat = new THREE.MeshBasicMaterial({
        color: primary,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      sphere = new THREE.Mesh(sphereGeo, wireMat);
      scene.add(sphere);

      // ─── Inner sphere ─────────────────────────────────
      const innerGeo = new THREE.SphereGeometry(1.9, 32, 32);
      innerMat = new THREE.MeshBasicMaterial({
        color: base,
        transparent: true,
        opacity: 0.9,
      });
      innerSphere = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerSphere);

      // ─── Dots on sphere surface ───────────────────────
      const dotCount = 220;
      const dotPositions = new Float32Array(dotCount * 3);
      for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotCount);
        const theta = Math.sqrt(dotCount * Math.PI) * phi;
        const r = 2.35;
        dotPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        dotPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        dotPositions[i * 3 + 2] = r * Math.cos(phi);
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
      dotMat = new THREE.PointsMaterial({
        color: primary,
        size: 0.07,
        transparent: true,
        opacity: 0.9,
      });
      dots = new THREE.Points(dotGeo, dotMat);
      scene.add(dots);

      // ─── Orbiting particles ───────────────────────────
      const particleCount = 90;
      const pPos = new Float32Array(particleCount * 3);
      const pSizes = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const spread = Math.random() * 0.6 - 0.3;
        const radius = 3.5 + Math.sin(i * 2.1) * 0.4 + spread;
        pPos[i * 3] = radius * Math.cos(angle + spread);
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
        pPos[i * 3 + 2] = radius * Math.sin(angle + spread);
        pSizes[i] = Math.random() * 0.05 + 0.025;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pMat = new THREE.PointsMaterial({
        color: accent,
        size: 0.045,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      });
      particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ─── Connection lines ─────────────────────────────
      for (let i = 0; i < 16; i++) {
        const phi1 = Math.random() * Math.PI;
        const theta1 = Math.random() * Math.PI * 2;
        const phi2 = Math.random() * Math.PI;
        const theta2 = Math.random() * Math.PI * 2;
        const r = 2.35;
        const pts = [
          new THREE.Vector3(
            r * Math.sin(phi1) * Math.cos(theta1),
            r * Math.cos(phi1),
            r * Math.sin(phi1) * Math.sin(theta1)
          ),
          new THREE.Vector3(
            r * Math.sin(phi2) * Math.cos(theta2),
            r * Math.cos(phi2),
            r * Math.sin(phi2) * Math.sin(theta2)
          ),
        ];
        const lineMat = new THREE.LineBasicMaterial({
          color: primary,
          transparent: true,
          opacity: 0.15 + Math.random() * 0.15,
        });
        scene.add(
          new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat)
        );
      }

      // ─── Mouse parallax ───────────────────────────────
      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove);

      const onResize = () => {
        if (!canvas.parentElement) return;
        const w2 = canvas.parentElement.clientWidth;
        const h2 = canvas.parentElement.clientHeight;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      };
      window.addEventListener("resize", onResize);

      // ─── Theme observer ───────────────────────────────
      const observer = new MutationObserver(applyColors);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      // ─── Animate ──────────────────────────────────────
      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.005;

        sphere.rotation.y += 0.003;
        sphere.rotation.x += 0.0008;
        innerSphere.rotation.y -= 0.0015;
        dots.rotation.y += 0.0025;
        dots.rotation.x += 0.0006;
        particles.rotation.y -= 0.005;
        particles.rotation.z += 0.002;
        ring1.rotation.z += 0.004;
        ring2.rotation.z -= 0.003;
        ring3.rotation.z += 0.002;
        ring3.rotation.y += 0.001;

        // Smooth mouse parallax
        scene.rotation.y += (mouse.x * 0.35 - scene.rotation.y) * 0.04;
        scene.rotation.x += (mouse.y * 0.25 - scene.rotation.x) * 0.04;

        // Breathing dot opacity
        dotMat.opacity = 0.65 + Math.sin(t * 1.8) * 0.25;
        wireMat.opacity = 0.07 + Math.sin(t * 0.9) * 0.04;

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        observer.disconnect();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };

    const cleanup = init();
    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
