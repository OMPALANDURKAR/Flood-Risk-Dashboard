import React from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Fix Leaflet default icons (Vite compatible)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 🎨 Risk color mapping
const getRiskColor = (risk) => {
  switch (risk) {
    case 'High':
      return '#ef4444';
    case 'Medium':
      return '#fbbf24';
    default:
      return '#10b981';
  }
};

export default function MapView({ data = [] }) {
  return (
    <div className="w-full h-full relative">
      
      <MapContainer
        center={[20.5937, 78.9629]} // India center
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* 🌍 Map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; Carto"
        />

        {/* 📍 Markers */}
        {data.map((point, index) => {
          const lat = Number(point.latitude);
          const lng = Number(point.longitude);

          // Skip invalid points
          if (!lat || !lng) return null;

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

                  <strong>Historical Floods:</strong> {point.historical_floods}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* 📊 Legend */}
      <div className="absolute bottom-6 right-6 bg-white px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold text-slate-700 flex items-center gap-4 z-[1000]">
        <span className="tracking-wide">RISK</span>

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>High</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
          <span>Medium</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span>Low</span>
        </div>
      </div>

    </div>
  );
}