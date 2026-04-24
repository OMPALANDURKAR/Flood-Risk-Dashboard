import React, { useEffect } from 'react';
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

// ✅ Force map resize fix (VERY IMPORTANT)
function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  return null;
}

// 🎨 Risk color helper
const getRiskColor = (risk) => {
  if (risk === 'High') return '#ef4444';
  if (risk === 'Medium') return '#fbbf24';
  return '#10b981';
};

export default function MapView({ data = [] }) {
  return (
    <div className="w-full h-full relative">

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full" // ✅ Tailwind safer than inline
      >
        {/* 🔥 Fix for flex layouts */}
        <FixMapResize />

        {/* 🌍 Base map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; Carto"
        />

        {/* 📍 Markers */}
        {data.map((point, index) => {
          const lat = Number(point.latitude);
          const lng = Number(point.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <CircleMarker
              key={`${lat}-${lng}-${index}`}
              center={[lat, lng]}
              radius={6}
              pathOptions={{
                fillColor: getRiskColor(point.riskLevel),
                color: '#ffffff',
                weight: 1.5,
                fillOpacity: 0.85,
              }}
            >
              <Popup>
                <div className="text-sm leading-relaxed">
                  <strong>Risk Level:</strong> {point.riskLevel}<br />
                  <strong>Rainfall:</strong> {point.rainfall_mm} mm<br />
                  <strong>Water Level:</strong> {point.water_level} m<br />
                  <strong>Discharge:</strong> {point.river_discharge} m³/s<br />
                  <strong>Flood History:</strong> {point.historical_floods}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* 📊 Legend */}
      <div className="absolute bottom-5 right-5 bg-white px-4 py-2 rounded-lg shadow-md text-xs flex gap-3 items-center z-[1000]">
        <strong>RISK</strong>

        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
          <span>High</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
          <span>Medium</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <span>Low</span>
        </div>
      </div>

    </div>
  );
}