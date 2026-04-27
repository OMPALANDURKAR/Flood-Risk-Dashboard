import { useEffect, useRef } from "react";
import L from "leaflet";
import { getFloodData } from "../api/data";

export default function MapView() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // prevent re-init

    mapInstance.current = L.map(mapRef.current).setView([22.5, 82], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(mapInstance.current);

    layerRef.current = L.layerGroup().addTo(mapInstance.current);

    loadData();
  }, []);

  const getColor = () => "#2DD4BF"; // temp color

  const loadData = async () => {
    const res = await getFloodData("?limit=500");

    res.data.forEach((p) => {
      L.circleMarker([p.latitude, p.longitude], {
        radius: 4,
        color: getColor(),
        fillColor: getColor(),
        fillOpacity: 0.8,
      })
        .addTo(layerRef.current)
        .bindPopup(`${p.district || "Unknown"}`);
    });
  };

  return <div ref={mapRef} className="w-full h-full"></div>;
}