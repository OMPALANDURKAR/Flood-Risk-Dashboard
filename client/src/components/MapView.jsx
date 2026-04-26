import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FixMapResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 0);
  }, [map]);
  return null;
}

const getRiskColor = (risk) => {
  if (risk === 'High') return '#ef4444';
  if (risk === 'Medium') return '#fbbf24';
  return '#2dd4bf';
};

const jitter = () => (Math.random() - 0.5) * 0.08;

export default function MapView({ data = [] }) {
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
        className="w-full h-full z-0 bg-[#020617]"
      >
        <FixMapResize />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; Carto"
        />

        {displayData.map((point, index) => {
          const lat = Number(point.latitude);
          const lng = Number(point.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <CircleMarker
              key={`${lat}-${lng}-${index}`}
              center={[lat + jitter(), lng + jitter()]}
              radius={5}
              pathOptions={{
                fillColor: getRiskColor(point.riskLevel),
                color: '#020617',
                weight: 1.5,
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div className="text-sm text-slate-300 min-w-[170px] font-sans">
                  <div className="font-bold text-white mb-3 pb-2 border-b border-white/10 uppercase tracking-wider text-[11px]">
                    Location Telemetry
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Risk Status</span>
                      <span className="font-semibold text-white px-2 py-0.5 rounded-md bg-slate-800 border border-white/5 text-xs">{point.riskLevel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Rainfall</span>
                      <span className="font-medium text-white text-xs">{point.rainfall_mm} mm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Water Lvl</span>
                      <span className="font-medium text-white text-xs">{point.water_level} m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Discharge</span>
                      <span className="font-medium text-white text-xs">{point.river_discharge} m³/s</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-2xl text-slate-200 px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-xs flex gap-6 items-center border border-white/10 z-[400]">
        <span className="font-bold tracking-widest text-slate-400 text-[10px] uppercase">Risk Indicator</span>
        
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-[#ef4444] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <span className="font-medium text-slate-300">High</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-[#fbbf24] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          <span className="font-medium text-slate-300">Medium</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-[#2dd4bf] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
          <span className="font-medium text-slate-300">Low</span>
        </div>
      </div>

    </div>
  );
}