import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Locate } from 'lucide-react';
import { Hotspot, Ride } from '../../types';
import { SEED_HOTSPOTS } from '../../demo/chennaiSeed';

export interface CommuteMapProps {
  center?: [number, number];
  zoom?: number;
  routeCoordinates?: [number, number][];
  vehiclePosition?: { lat: number; lng: number; heading?: number };
  passengerPosition?: { lat: number; lng: number };
  hotspots?: Hotspot[];
  onHotspotSelect?: (hotspot: Hotspot) => void;
  fuzzyZoneName?: string;
  fuzzyCenter?: [number, number];
  sosAlertLocation?: { lat: number; lng: number; active: boolean };
  responders?: { lat: number; lng: number; name: string }[];
  className?: string;
}

export const CommuteMap: React.FC<CommuteMapProps> = ({
  center = [12.9815, 80.2245], // Default Velachery / IIT Corridor
  zoom = 14,
  routeCoordinates,
  vehiclePosition,
  passengerPosition,
  hotspots = SEED_HOTSPOTS,
  onHotspotSelect,
  fuzzyZoneName,
  fuzzyCenter,
  sosAlertLocation,
  responders = [],
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Dark OpenStreetMap Tiles (UI Spec §7)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update dynamic layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Polyline with vibrant gradient styling
    if (routeCoordinates && routeCoordinates.length > 1) {
      // Glow background corridor band
      L.polyline(routeCoordinates, {
        color: '#7C3AED',
        weight: 18,
        opacity: 0.18,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      // Main vibrant route line
      L.polyline(routeCoordinates, {
        color: '#7C3AED',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);
    }

    // 2. Draw Fuzzy Zone (Polygon with 1px dashed violet border)
    if (fuzzyCenter) {
      const circle = L.circle(fuzzyCenter, {
        radius: 800,
        color: '#7C3AED',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#7C3AED',
        fillOpacity: 0.12,
      }).addTo(layerGroup);

      if (fuzzyZoneName) {
        circle.bindTooltip(`FUZZY ZONE: ${fuzzyZoneName}`, {
          permanent: true,
          direction: 'center',
          className: 'leaflet-fuzzy-label text-[10px] font-bold text-text bg-surface/90 border border-border px-2 py-0.5 rounded-full shadow-sm',
        });
      }
    }

    // 3. Draw Hotspot Markers (Violet circle, white pin, count badge)
    hotspots.forEach((hs) => {
      const customIcon = L.divIcon({
        className: 'custom-hotspot-pin',
        html: `
          <div style="position:relative; width:36px; height:36px; background:#7C3AED; border:2px solid #FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(124,58,237,0.4);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${
              hs.waitingCount > 0
                ? `<span style="position:absolute; top:-4px; right:-4px; background:#F59E0B; color:#FFFFFF; font-size:10px; font-weight:bold; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #FFFFFF;">${hs.waitingCount}</span>`
                : ''
            }
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([hs.lat, hs.lng], { icon: customIcon }).addTo(layerGroup);
      marker.on('click', () => {
        if (onHotspotSelect) onHotspotSelect(hs);
      });
      marker.bindTooltip(hs.name, {
        direction: 'top',
        className: 'text-xs font-bold text-text bg-surface border border-border px-2 py-1 rounded-card shadow-md',
      });
    });

    // 4. Draw Passenger Marker (Violet dot with white ring)
    if (passengerPosition) {
      const passengerIcon = L.divIcon({
        className: 'custom-passenger-pin',
        html: `
          <div style="width:20px; height:20px; background:#7C3AED; border:3px solid #FFFFFF; border-radius:50%; box-shadow:0 0 12px rgba(124,58,237,0.8);"></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([passengerPosition.lat, passengerPosition.lng], { icon: passengerIcon }).addTo(layerGroup);
    }

    // 5. Draw Vehicle Marker (Vehicle car glyph rotated to heading)
    if (vehiclePosition) {
      const heading = vehiclePosition.heading || 0;
      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-pin',
        html: `
          <div style="transform:rotate(${heading}deg); width:36px; height:36px; background:#FFFFFF; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(124,58,237,0.25); border:2px solid #7C3AED;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" stroke-width="1.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([vehiclePosition.lat, vehiclePosition.lng], { icon: vehicleIcon }).addTo(layerGroup);
    }

    // 6. Draw SOS Alert & Responders (Pulsing danger circle)
    if (sosAlertLocation && sosAlertLocation.active) {
      const sosIcon = L.divIcon({
        className: 'custom-sos-pulse',
        html: `
          <div style="position:relative; width:48px; height:48px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:48px; height:48px; border-radius:50%; background:rgba(239,68,68,0.3); animation:pulse-ring 1.8s infinite;"></div>
            <div style="position:relative; width:28px; height:28px; border-radius:50%; background:#EF4444; border:2px solid #FFFFFF; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px #EF4444;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });
      L.marker([sosAlertLocation.lat, sosAlertLocation.lng], { icon: sosIcon }).addTo(layerGroup);

      // Light up green responder dots
      responders.forEach((r) => {
        const respIcon = L.divIcon({
          className: 'custom-responder-dot',
          html: `<div style="width:14px; height:14px; background:#10B981; border:2px solid #FFFFFF; border-radius:50%; box-shadow:0 0 10px #10B981;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([r.lat, r.lng], { icon: respIcon })
          .bindTooltip(`Responder: ${r.name}`, { direction: 'top' })
          .addTo(layerGroup);
      });
    }
  }, [
    center,
    zoom,
    routeCoordinates,
    vehiclePosition,
    passengerPosition,
    hotspots,
    fuzzyCenter,
    fuzzyZoneName,
    sosAlertLocation,
    responders,
    onHotspotSelect,
  ]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const target = vehiclePosition
        ? [vehiclePosition.lat, vehiclePosition.lng]
        : passengerPosition
        ? [passengerPosition.lat, passengerPosition.lng]
        : center;
      mapInstanceRef.current.setView(target as [number, number], zoom);
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Recentre 48px square icon button bottom-right */}
      <button
        onClick={handleRecenter}
        aria-label="Recenter map"
        className="absolute bottom-5 right-4 z-[400] min-w-[48px] min-h-[48px] rounded-button bg-surface border border-border flex items-center justify-center text-primary shadow-colored hover:bg-surface-2 active:scale-95 transition-all"
      >
        <Locate size={20} className="text-primary" />
      </button>
    </div>
  );
};
