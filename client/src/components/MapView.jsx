import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const getRiskColor = (risk) => {
  if (risk === 'High') return '#ef4444'; // Red
  if (risk === 'Medium') return '#fbbf24'; // Yellow
  return '#10b981'; // Green
};

export default function MapView({ data }) {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} className="w-full h-full z-0">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
      />
      {data.map((district) => (
        <CircleMarker
          key={district.id}
          center={[district.lat, district.lng]}
          radius={8}
          pathOptions={{ 
            fillColor: getRiskColor(district.riskLevel), 
            color: 'white', 
            weight: 2, 
            fillOpacity: 0.9 
          }}
        >
          <Popup className="font-sans">
            <strong className="text-base">{district.district}</strong><br/>
            <span className="text-xs text-slate-500">Risk:</span> {district.riskLevel}<br/>
            <span className="text-xs text-slate-500">Rainfall:</span> {district.rainfall_mm} mm<br/>
            <span className="text-xs text-slate-500">Historical Floods:</span> {district.historical_floods}
          </Popup>
        </CircleMarker>
      ))}

      {/* Map Legend Floating Container */}
      <div className="absolute bottom-6 right-6 bg-white p-3 rounded-md shadow-lg z-[1000] border border-slate-100 flex items-center space-x-4 text-xs font-bold text-slate-600">
        <span className="tracking-wider">ACTIVE INDEX</span>
        <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-red-500 rounded-full"/><span>HIGH</span></div>
        <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-amber-400 rounded-full"/><span>MED</span></div>
        <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"/><span>LOW</span></div>
      </div>
    </MapContainer>
  );
}