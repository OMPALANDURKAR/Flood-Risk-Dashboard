import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AnalyticsPanel from "./components/AnalyticsPanel";

function App() {
  return (
    <div className="app-shell">

      {/* HEADER */}
      <Header />

      {/* MAIN GRID */}
      <div className="main-grid">

        {/* LEFT */}
        <div className="sidebar">
          <Sidebar />
        </div>

        {/* CENTER MAP */}
        <div>
          <MapView />
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <AnalyticsPanel />
        </div>

      </div>
    </div>
  );
}

export default App;