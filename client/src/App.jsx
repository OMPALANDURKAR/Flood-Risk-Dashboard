import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AnalyticsPanel from "./components/AnalyticsPanel";

function App() {
  const [district, setDistrict] = useState("");

  return (
    <div className="app-shell">
      <Header />

      <div className="main-grid">
        <div className="sidebar">
          <Sidebar setDistrict={setDistrict} />
        </div>

        <div>
          <MapView district={district} />
        </div>

        <div className="right-panel">
          <AnalyticsPanel />
        </div>
      </div>
    </div>
  );
}

export default App;