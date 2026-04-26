import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Fix Leaflet icons (Vite)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Fix map resize (important for flex layouts)
function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  return null;
}

// 🎨 Risk color mapping (Bioluminescent Zen style)
const getRiskColor = (risk) => {
  if (risk === 'High') return '#ef4444';      // red
  if (risk === 'Medium') return '#fbbf24';    // amber
  return '#2dd4bf';                           // electric mint (better than green)
};

// 🎯 Add jitter to avoid grid/block look
const jitter = () => (Math.random() - 0.5) * 0.08;

export default function MapView({ data = [] }) {

  // 🔥 PERFORMANCE FIX: limit points
  const MAX_POINTS = 1500;

  const displayData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.slice(0, MAX_POINTS);
  }, [data]);

  return (
    <div className="w-full h-full relative">

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <FixMapResize />

        {/* 🌙 DARK MAP (HUGE VISUAL UPGRADE) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; Carto"
        />

        {/* 📍 Markers */}
        {displayData.map((point, index) => {
          const lat = Number(point.latitude);
          const lng = Number(point.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <CircleMarker
              key={`${lat}-${lng}-${index}`}
              center={[lat + jitter(), lng + jitter()]}
              radius={4} // 🔥 smaller markers
              pathOptions={{
                fillColor: getRiskColor(point.riskLevel),
                color: '#0f172a',     // dark outline for contrast
                weight: 1,
                fillOpacity: 0.6,     // 🔥 reduce noise
              }}
            >
              <Popup>
                <div className="text-sm leading-relaxed">
                  <strong>Risk:</strong> {point.riskLevel}<br />
                  <strong>Rainfall:</strong> {point.rainfall_mm} mm<br />
                  <strong>Water Level:</strong> {point.water_level} m<br />
                  <strong>Discharge:</strong> {point.river_discharge} m³/s<br />
                  <strong>History:</strong> {point.historical_floods}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* 📊 MODERN LEGEND */}
      <div className="absolute bottom-5 right-5 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg text-xs flex gap-4 items-center border border-slate-700 z-[1000]">
        <span className="font-semibold tracking-wide">RISK</span>

        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
          <span>High</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
          <span>Medium</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-teal-400 rounded-full" />
          <span>Low</span>
        </div>
      </div>

    </div>
  );
}