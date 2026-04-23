import React from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Fix Leaflet marker icons (Vite)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 🎨 Risk colors
const getRiskColor = (risk) => {
  if (risk === 'High') return '#ef4444';
  if (risk === 'Medium') return '#fbbf24';
  return '#10b981';
};

export default function MapView({ data = [] }) {
  return (
    // 🔥 FORCE HEIGHT (CRITICAL FIX)
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        // 🔥 DO NOT rely on Tailwind here
        style={{ width: '100%', height: '100%' }}
      >
        {/* 🌍 Base Map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; Carto"
        />

        {/* 📍 Markers */}
        {data.map((point, index) => {
          const lat = Number(point.latitude);
          const lng = Number(point.longitude);

          // ❗ Allow 0 coordinates (don’t block valid 0)
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
                <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
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
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: '#ffffff',
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          fontSize: '12px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          zIndex: 1000
        }}
      >
        <span><strong>RISK</strong></span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }}></div>
          <span>High</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', background: '#fbbf24', borderRadius: '50%' }}></div>
          <span>Medium</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div>
          <span>Low</span>
        </div>
      </div>

    </div>
  );
}