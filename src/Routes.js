import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import MapData from "./pages/MapData";
import LogTripData from "./pages/LogTripData";
import ViewELD from "./pages/ViewELD";
import ViewHourCycle from "./pages/ViewHourCycle";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import AuthService from "./services/AuthService";

const ProtectedRoute = ({ children }) => {
  return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/map-data" element={<ProtectedRoute><MapData /></ProtectedRoute>} />
      <Route path="/log-trip-data" element={<ProtectedRoute><LogTripData /></ProtectedRoute>} />
      <Route path="/view-eld" element={<ProtectedRoute><ViewELD /></ProtectedRoute>} />
      <Route path="/view-hour-cycle" element={<ProtectedRoute><ViewHourCycle /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;

