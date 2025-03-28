import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import MapData from "./pages/MapData"; // Create this component
import LogTripData from "./pages/LogTripData"; // Create this component
import ViewELD from "./pages/ViewELD"; // Create this component
import ViewHourCycle from "./pages/ViewHourCycle"; // Create this component

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map-data" element={<MapData />} />
        <Route path="/log-trip-data" element={<LogTripData />} />
        <Route path="/view-eld" element={<ViewELD />} />
        <Route path="/view-hour-cycle" element={<ViewHourCycle />} />
      </Routes>
    );
  };
  
  export default AppRoutes;
  