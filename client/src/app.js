import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import AnalyticsPanel from './components/AnalyticsPanel';
import 'leaflet/dist/leaflet.css';

function App() {
  const [floodData, setFloodData] = useState([]);
  const[analytics, setAnalytics] = useState({ activeHigh: 0, activeMedium: 0, activeLow: 0 });
  const [filters, setFilters] = useState({ search: '', risk: 'All', rainfall: 400 });

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    const dataRes = await axios.get('http://localhost:5000/api/flood-data');
    const statRes = await axios.get('http://localhost:5000/api/analytics');
    setFloodData(dataRes.data);
    setAnalytics(statRes.data);
  };

  const filteredData = floodData.filter(d => 
    d.district.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.risk === 'All' || d.riskLevel === filters.risk) &&
    d.rainfall_mm <= filters.rainfall
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-slate-800">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar filters={filters} setFilters={setFilters} />
        <main className="flex-1 relative bg-blue-50">
          <MapView data={filteredData} />
        </main>
        <AnalyticsPanel analytics={analytics} />
      </div>
    </div>
  );
}

export default App;