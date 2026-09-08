import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hub {
  name: string;
  lat: number;
  lng: number;
  size?: number;
}

const GLOBAL_HUBS: Hub[] = [
  { name: 'Hanoi / HCMC', lat: 14.0583, lng: 108.2772, size: 0.045 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, size: 0.04 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, size: 0.04 },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, size: 0.04 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, size: 0.04 },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, size: 0.04 },
  { name: 'London', lat: 51.5074, lng: -0.1278, size: 0.04 },
  { name: 'Rotterdam', lat: 51.9244, lng: 4.4777, size: 0.035 },
  { name: 'New York', lat: 40.7128, lng: -74.006, size: 0.04 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, size: 0.04 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, size: 0.035 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, size: 0.035 },
];

// Logistics routes pairs (index in GLOBAL_HUBS)
const LOGISTICS_ROUTES: [number, number][] = [
  [0, 1], // Vietnam - Singapore
  [0, 3], // Vietnam - Shanghai
  [0, 2], // Vietnam - Tokyo
  [1, 4], // Singapore - Dubai
  [3, 2], // Shanghai - Tokyo
  [3, 9], // Shanghai - Los Angeles
  [4, 5], // Dubai - Frankfurt
  [5, 6], // Frankfurt - London
  [5, 7], // Frankfurt - Rotterdam
  [6, 8], // London - New York
  [8, 9], // New York - Los Angeles
  [1, 10], // Singapore - Sydney
  [8, 11], // New York - Sao Paulo
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function GlobeScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.2;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 2.15;

    // 3.1 Inner solid dark sphere
    const innerSphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 64, 64);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: 0x060b19,
      transparent: true,
      opacity: 0.92,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    globeGroup.add(innerSphere);

    // 3.2 Wireframe grid sphere
    const wireframeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 36, 36);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // 3.3 Atmosphere glowing rim
    const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 48, 48);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.02, 0.65, 0.95, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // 3.4 Surface coordinate dots (random continent-like matrix representation)
    const DOT_COUNT = 1400;
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    for (let i = 0; i < DOT_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * 1.002;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      dotPositions[i * 3] = x;
      dotPositions[i * 3 + 1] = y;
      dotPositions[i * 3 + 2] = z;
    }

    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
    globeGroup.add(dotsMesh);

    // 3.5 Hub Markers & Rings
    const hubVectors: THREE.Vector3[] = [];
    GLOBAL_HUBS.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, GLOBE_RADIUS * 1.008);
      hubVectors.push(pos);

      // Core dot
      const markerGeo = new THREE.SphereGeometry(hub.size || 0.04, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0x34d399, // Emerald pulse
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      globeGroup.add(marker);

      // Outer beacon ring
      const ringGeo = new THREE.RingGeometry(0.045, 0.07, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ring);
    });

    // 3.6 Arcs (Curved 3D flight / logistics routes)
    const packetMeshes: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; progress: number; speed: number }[] = [];

    LOGISTICS_ROUTES.forEach(([startIdx, endIdx]) => {
      const p1 = hubVectors[startIdx];
      const p2 = hubVectors[endIdx];
      if (!p1 || !p2) return;

      // Calculate mid point raised above the globe
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const altitude = GLOBE_RADIUS + distance * 0.35;
      mid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(arcLine);

      // Moving cargo signal (packet)
      const packetGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        blending: THREE.AdditiveBlending,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      globeGroup.add(packetMesh);

      packetMeshes.push({
        mesh: packetMesh,
        curve,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
      });
    });

    // 3.7 Ambient Starfield Particles
    const STAR_COUNT = 600;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 35;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.5,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Initial tilt of globe
    globeGroup.rotation.x = 0.28;
    globeGroup.rotation.y = 1.4;

    // 4. Mouse Interactivity & Drag handling
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.28;
    let targetRotationY = 1.4;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseParallaxX = nx * 0.15;
      mouseParallaxY = ny * 0.15;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotate if not dragging
      if (!isDragging) {
        targetRotationY += 0.0015;
      }

      // Smooth damping (lerp)
      globeGroup.rotation.y += (targetRotationY + mouseParallaxX - globeGroup.rotation.y) * 0.06;
      globeGroup.rotation.x += (targetRotationX - mouseParallaxY - globeGroup.rotation.x) * 0.06;

      // Animate packet signals along logistics routes
      packetMeshes.forEach((item) => {
        item.progress += item.speed;
        if (item.progress > 1) item.progress = 0;
        const pos = item.curve.getPoint(item.progress);
        item.mesh.position.copy(pos);
      });

      // Subtle star field spin
      starField.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      // Dispose Three.js objects
      renderer.dispose();
      innerSphereGeo.dispose();
      innerSphereMat.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      dotsGeo.dispose();
      dotsMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'none',
      }}
      title="Kéo chuột để xoay quả cầu 3D"
    />
  );
}
