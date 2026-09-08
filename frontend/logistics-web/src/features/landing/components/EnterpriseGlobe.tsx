import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { ENTERPRISE_HUBS, type HubTelemetry } from '../types/hubs';

const HUB_ROUTES: [number, number][] = [
  [0, 1], // HCM - Hanoi
  [0, 2], // HCM - Singapore
  [1, 4], // Hanoi - Shanghai
  [2, 4], // Singapore - Shanghai
  [4, 3], // Shanghai - Tokyo
  [3, 6], // Tokyo - Los Angeles
  [2, 5], // Singapore - Frankfurt
  [5, 6], // Frankfurt - Los Angeles
];

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface EnterpriseGlobeProps {
  selectedHub: HubTelemetry;
  onSelectHub: (hub: HubTelemetry) => void;
}

export function EnterpriseGlobe({ selectedHub, onSelectHub }: EnterpriseGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 540;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 6.0;

    // 2. High performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 2.05;

    // 3. Globe Geometry (Sophisticated Navy/Slate sphere with subtle longitude/latitude grid)
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a, // Deep enterprise slate
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // Subtle latitude & longitude rings (Technical aesthetic)
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 28, 28);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb, // Royal Blue lines
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // Continent coordinate density dots (Subtle enterprise digital matrix)
    const DOT_COUNT = 900;
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    for (let i = 0; i < DOT_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * 1.002;
      dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.024,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.5,
    });
    const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
    globeGroup.add(dotsMesh);

    // 4. Logistics Hub Markers
    const hubVectors: THREE.Vector3[] = [];
    const markerMeshes: THREE.Mesh[] = [];

    ENTERPRISE_HUBS.forEach((hub, idx) => {
      const vec = latLngToVec3(hub.lat, hub.lng, GLOBE_RADIUS * 1.01);
      hubVectors.push(vec);

      // Core Hub Dot
      const isSelected = hub.id === selectedHub.id;
      const markerGeo = new THREE.SphereGeometry(isSelected ? 0.065 : 0.045, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xea580c : idx === 0 || idx === 1 ? 0xf97316 : 0x38bdf8,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(vec);
      marker.userData = { hubIndex: idx };
      globeGroup.add(marker);
      markerMeshes.push(marker);

      // Halo ring for Hubs
      const ringGeo = new THREE.RingGeometry(0.05, 0.08, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xea580c : 0x2563eb,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(vec);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ring);
    });

    // 5. Inter-hub Flight / Cargo Arcs
    const packetData: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; progress: number; speed: number }[] = [];

    HUB_ROUTES.forEach(([startIdx, endIdx]) => {
      const p1 = hubVectors[startIdx];
      const p2 = hubVectors[endIdx];
      if (!p1 || !p2) return;

      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.32);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.38,
      });
      const arc = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(arc);

      // Cargo packet moving
      const packetGeo = new THREE.SphereGeometry(0.03, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      globeGroup.add(packetMesh);

      packetData.push({
        mesh: packetMesh,
        curve,
        progress: Math.random(),
        speed: 0.0035 + Math.random() * 0.0025,
      });
    });

    // Initial orientation: Focus on East Asia / Vietnam
    globeGroup.rotation.x = 0.25;
    globeGroup.rotation.y = 1.35;

    // 6. Raycaster & Pointer interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRotY = 1.35;
    let targetRotX = 0.25;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        targetRotY += dx * 0.006;
        targetRotX += dy * 0.006;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(markerMeshes);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.hubIndex;
        if (typeof idx === 'number' && ENTERPRISE_HUBS[idx]) {
          onSelectHub(ENTERPRISE_HUBS[idx]);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging && isRotating) {
        targetRotY += 0.0018;
      }

      globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.06;
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.06;

      packetData.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        p.mesh.position.copy(p.curve.getPoint(p.progress));
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container.contains(dom)) container.removeChild(dom);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      dotsGeo.dispose();
      dotsMat.dispose();
    };
  }, [isRotating, selectedHub.id, onSelectHub]);

  return (
    <div className="globe-console-container">
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="globe-canvas-area"
        title="Kéo chuột để xoay / Nhấp vào điểm để kiểm tra Hub"
      />

      {/* Control overlay */}
      <div className="globe-controls-bar">
        <div className="globe-hint">
          <span className="hint-pulse" />
          <span>Kéo chuột để điều hướng 3D • Nhấp chọn trạm Hub</span>
        </div>
        <button
          type="button"
          onClick={() => setIsRotating((prev) => !prev)}
          className="btn-pause-rotation"
        >
          {isRotating ? 'Tạm dừng xoay' : 'Tiếp tục xoay'}
        </button>
      </div>

      {/* Live Hub Telemetry Panel */}
      <div className="hub-telemetry-panel">
        <div className="telemetry-header">
          <div className="telemetry-badge">
            <span className="status-indicator-live" />
            <span>DỮ LIỆU VẬN HÀNH THỜI GIAN THỰC</span>
          </div>
          <span className={`status-pill ${selectedHub.status.toLowerCase()}`}>
            {selectedHub.status === 'OPTIMAL'
              ? 'Hoạt động tối ưu'
              : selectedHub.status === 'HIGH_TRAFFIC'
              ? 'Lưu lượng cao'
              : 'Bình thường'}
          </span>
        </div>

        <h4 className="telemetry-hub-name">{selectedHub.name}</h4>
        <div className="telemetry-hub-country">{selectedHub.country} • Tọa độ: {selectedHub.lat.toFixed(2)}°N, {selectedHub.lng.toFixed(2)}°E</div>

        <div className="telemetry-stats-grid">
          <div className="telemetry-stat">
            <span className="stat-meta">Phương tiện hoạt động</span>
            <span className="stat-data highlight-blue">{selectedHub.activeVehicles} xe</span>
          </div>
          <div className="telemetry-stat">
            <span className="stat-meta">Năng lực xử lý / ngày</span>
            <span className="stat-data">{selectedHub.throughputPerDay}</span>
          </div>
          <div className="telemetry-stat">
            <span className="stat-meta">Cam kết SLA đúng hẹn</span>
            <span className="stat-data highlight-orange">{selectedHub.slaRate}</span>
          </div>
        </div>

        {/* Quick Hub Switcher Bar */}
        <div className="hub-quick-switcher">
          <span className="switcher-label">Chọn nhanh Hub:</span>
          <div className="switcher-buttons">
            {ENTERPRISE_HUBS.map((hub) => (
              <button
                key={hub.id}
                type="button"
                className={`btn-hub-chip ${hub.id === selectedHub.id ? 'active' : ''}`}
                onClick={() => onSelectHub(hub)}
              >
                {hub.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
