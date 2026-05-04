import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AnalyticsPanel from "./components/AnalyticsPanel";

function App() {
  // 🔍 Search input (text-based)
  const [districtQuery, setDistrictQuery] = useState("");

  // 📊 Selected district (from map click)
  const [selectedDistrictData, setSelectedDistrictData] = useState(null);

  // =========================
  // HANDLE SEARCH
  // =========================
  const handleDistrictSearch = (value) => {
    setDistrictQuery(value);

    // 🔥 Reset selected data when typing new search
    if (value.length > 0) {
      setSelectedDistrictData(null);
    }
  };

  return (
    <div className="
      h-screen w-screen flex flex-col
      bg-slate-50 text-slate-800
      font-sans overflow-hidden
    ">

      {/* ===== HEADER ===== */}
      <div className="flex-shrink-0 sticky top-0 z-20 px-6 py-3">
        <Header />
      </div>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="flex-1 min-h-0 px-6 pb-6">

        {/* ===== GRID WRAPPER ===== */}
        <div className="
          h-full w-full mx-auto
          max-w-[1800px]
          grid 
          grid-cols-[280px_1fr_320px]
          gap-6
        ">

          {/* ===== SIDEBAR ===== */}
          <div className="min-h-0 overflow-hidden">
            <Sidebar
              setDistrict={handleDistrictSearch}
              selectedDistrictData={selectedDistrictData}
            />
          </div>

          {/* ===== MAP ===== */}
          <div className="min-h-0 overflow-hidden">
            <MapView
              district={districtQuery}
              setSelectedDistrictData={setSelectedDistrictData}
            />
          </div>

          {/* ===== ANALYTICS ===== */}
          <div className="min-h-0 overflow-hidden">
            <AnalyticsPanel />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;