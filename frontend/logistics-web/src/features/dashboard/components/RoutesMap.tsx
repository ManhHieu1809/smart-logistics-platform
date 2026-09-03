import L from 'leaflet';
import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';

import styles from './RoutesMap.module.css';

const routes: Array<{ color: string; coordinates: L.LatLngExpression[] }> = [
  {
    color: '#0ea5e9',
    coordinates: [
      [41.8781, -87.6298], [41.5, -85.5], [40.7, -82.7], [40.2, -79.8],
      [40.7, -76.6], [40.9, -74.006],
    ],
  },
  {
    color: '#0ea5e9',
    coordinates: [
      [33.749, -84.388], [35.1, -82.2], [36.1, -79.8], [38.6, -77.1],
      [40.7128, -74.006],
    ],
  },
  {
    color: '#10b981',
    coordinates: [
      [41.8781, -87.6298], [40.2, -85.7], [37.9, -84.1], [35.8, -81.3],
      [33.749, -84.388],
    ],
  },
  {
    color: '#10b981',
    coordinates: [
      [33.749, -84.388], [35.9, -80.9], [38.4, -77.5], [39.9, -75.2],
      [40.7128, -74.006],
    ],
  },
];

const stops: L.LatLngExpression[] = [
  [41.8781, -87.6298], [40.2, -79.8], [40.7128, -74.006], [33.749, -84.388],
  [38.6, -77.1], [35.8, -81.3],
];

export function RoutesMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement.current) return undefined;

    const map = L.map(mapElement.current, {
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    routes.forEach(({ color, coordinates }) => {
      L.polyline(coordinates, {
        color,
        weight: 4,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    });

    stops.forEach((stop) => {
      L.circleMarker(stop, {
        color: '#2563eb',
        fillColor: '#ffffff',
        fillOpacity: 1,
        radius: 6,
        weight: 3,
      }).addTo(map);
    });

    map.fitBounds(L.latLngBounds(stops), { padding: [35, 50] });
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
    };
  }, []);

  return <div aria-label="Live map of active delivery routes" className={styles.mapCanvas} ref={mapElement} role="img" />;
}
