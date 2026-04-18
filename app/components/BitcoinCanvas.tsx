"use client";
import { useEffect, useRef } from "react";

export default function BitcoinCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      const canvas = ref.current;
      if (!canvas) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.shadowMap.enabled = true;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
      camera.position.set(0, 0, 7);

      // ── Ambient + directional lights ──
      scene.add(new THREE.AmbientLight(0xffffff, 0.15));

      const amberLight = new THREE.PointLight(0xf59e0b, 12, 20);
      amberLight.position.set(3, 2, 3);
      scene.add(amberLight);

      const cyanLight = new THREE.PointLight(0x06b6d4, 8, 20);
      cyanLight.position.set(-3, -2, 2);
      scene.add(cyanLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
      rimLight.position.set(0, 5, -5);
      scene.add(rimLight);

      // ── Central Bitcoin sphere with wireframe ──
      const sphereGeo = new THREE.SphereGeometry(1.3, 48, 48);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: 0x0a1020,
        emissive: 0x0a0800,
        specular: 0xf59e0b,
        shininess: 120,
        transparent: true,
        opacity: 0.85,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      // Wireframe overlay
      const wfGeo = new THREE.IcosahedronGeometry(1.4, 2);
      const wfMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const wireframe = new THREE.Mesh(wfGeo, wfMat);
      scene.add(wireframe);

      // ── Glowing rings ──
      const rings: import("three").Mesh[] = [];
      const ringAngles = [0, Math.PI / 3, (2 * Math.PI) / 3];
      ringAngles.forEach((angle, i) => {
        const rGeo = new THREE.TorusGeometry(1.9 + i * 0.35, 0.008, 8, 100);
        const rMat = new THREE.MeshBasicMaterial({
          color: i === 0 ? 0xf59e0b : i === 1 ? 0x06b6d4 : 0x8b5cf6,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = angle;
        ring.rotation.y = angle * 0.7;
        rings.push(ring);
        scene.add(ring);
      });

      // ── Floating particles ──
      const pCount = 1200;
      const pPos = new Float32Array(pCount * 3);
      const pSizes = new Float32Array(pCount);
      for (let i = 0; i < pCount; i++) {
        const r = 3 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pPos[i*3+2] = r * Math.cos(phi);
        pSizes[i] = Math.random() * 2.5 + 0.5;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));
      const pMat = new THREE.PointsMaterial({
        size: 0.04, color: 0xf59e0b, transparent: true, opacity: 0.5, sizeAttenuation: true,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── Secondary cyan particles ──
      const p2Count = 600;
      const p2Pos = new Float32Array(p2Count * 3);
      for (let i = 0; i < p2Count; i++) {
        p2Pos[i*3]   = (Math.random() - 0.5) * 24;
        p2Pos[i*3+1] = (Math.random() - 0.5) * 24;
        p2Pos[i*3+2] = (Math.random() - 0.5) * 10 - 3;
      }
      const p2Geo = new THREE.BufferGeometry();
      p2Geo.setAttribute("position", new THREE.BufferAttribute(p2Pos, 3));
      const p2Mat = new THREE.PointsMaterial({ size: 0.025, color: 0x06b6d4, transparent: true, opacity: 0.25 });
      const particles2 = new THREE.Points(p2Geo, p2Mat);
      scene.add(particles2);

      // ── Floating cubes (hexagonal satellites) ──
      const satellites: { mesh: import("three").Mesh; angle: number; speed: number; radius: number }[] = [];
      for (let i = 0; i < 6; i++) {
        const size = 0.08 + Math.random() * 0.1;
        const geo = new THREE.OctahedronGeometry(size);
        const mat = new THREE.MeshPhongMaterial({
          color: i % 2 === 0 ? 0xf59e0b : 0x06b6d4,
          emissive: i % 2 === 0 ? 0x7c5200 : 0x013a4a,
          transparent: true, opacity: 0.9,
        });
        const mesh = new THREE.Mesh(geo, mat);
        satellites.push({ mesh, angle: (i / 6) * Math.PI * 2, speed: 0.003 + Math.random() * 0.005, radius: 2.5 + Math.random() * 1.5 });
        scene.add(mesh);
      }

      // ── Mouse parallax ──
      let mouseX = 0, mouseY = 0;
      const onMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      // ── Resize ──
      const onResize = () => {
        if (!canvas) return;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize, { passive: true });

      // ── Animate ──
      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.008;

        // Sphere breathe
        const breathe = 1 + Math.sin(t * 0.8) * 0.015;
        sphere.scale.setScalar(breathe);
        wireframe.scale.setScalar(breathe);

        // Slow rotation
        sphere.rotation.y = t * 0.15;
        sphere.rotation.x = Math.sin(t * 0.3) * 0.1;
        wireframe.rotation.y = -t * 0.1;
        wireframe.rotation.x = Math.cos(t * 0.25) * 0.08;

        // Rings
        rings[0].rotation.z = t * 0.25;
        rings[1].rotation.x = t * 0.2;
        rings[1].rotation.z = t * 0.1;
        rings[2].rotation.y = t * 0.18;
        rings[2].rotation.x = t * -0.12;

        // Particles drift
        particles.rotation.y = t * 0.04;
        particles.rotation.x = t * 0.018;
        particles2.rotation.y = -t * 0.02;

        // Satellites orbit
        satellites.forEach((s) => {
          s.angle += s.speed;
          s.mesh.position.x = Math.cos(s.angle) * s.radius;
          s.mesh.position.y = Math.sin(s.angle * 0.7) * s.radius * 0.5;
          s.mesh.position.z = Math.sin(s.angle) * s.radius * 0.6;
          s.mesh.rotation.x = t * 1.5;
          s.mesh.rotation.y = t * 2;
        });

        // Pulsing lights
        amberLight.intensity = 10 + Math.sin(t * 1.5) * 3;
        cyanLight.intensity  = 7  + Math.cos(t * 1.2) * 2;

        // Mouse parallax on camera
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    })();

    return () => { cleanup?.(); };
  }, []);

  return <canvas ref={ref} id="hero-canvas" />;
}
