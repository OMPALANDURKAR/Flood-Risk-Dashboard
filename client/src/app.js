import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import AnalyticsPanel from './components/AnalyticsPanel';
import 'leaflet/dist/leaflet.css';

// Axios instance (clean base config)
const API = axios.create({
  baseURL: 'http://localhost:5000/api/floods'
});

function App() {
  const [floodData, setFloodData] = useState([]);
  const [analytics, setAnalytics] = useState({
    activeHigh: 0,
    activeMedium: 0,
    activeLow: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    risk: 'All',
    rainfall: 400
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch API data
  const fetchData = async () => {
    try {
      const dataRes = await API.get('/');
      const statRes = await API.get('/analytics');

      // Backend returns { success, data }
      setFloodData(dataRes.data.data);
      setAnalytics(statRes.data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filtering logic (UPDATED for your dataset)
  const filteredData = floodData.filter(d =>
    // No district → use land_cover or soil_type as searchable
    (d.land_cover || '').toLowerCase().includes(filters.search.toLowerCase()) &&

    (filters.risk === 'All' || d.riskLevel === filters.risk) &&

    d.rainfall_mm <= filters.rainfall
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar filters={filters} setFilters={setFilters} />

        {/* Map */}
        <main className="flex-1 relative bg-blue-50">
          <MapView data={filteredData} />
        </main>

        {/* Analytics */}
        <AnalyticsPanel analytics={analytics} />

      </div>
    </div>
  );
}

export default App;