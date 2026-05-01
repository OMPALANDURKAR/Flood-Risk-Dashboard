import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

// Global Styles (Meridian System)
import "./index.css";

// Leaflet Styles
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);