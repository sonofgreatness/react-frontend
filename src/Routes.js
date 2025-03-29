import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ManageTrips from "./pages/Trip/ManageTrips";
import CreateTrip from "./pages/Trip/CreateTrip";
import TripDetails from "./pages/Trip/TripDetails";
import CreateTripDetails from "./pages/Trip/CreateTripDetails";
import LogTripData from "./pages/Trip/LogTripData";
import ViewELD from "./pages/ViewELD";
import Welcome from "./pages/Welcome";
import ViewHourCycle from "./pages/ViewHourCycle";
import EditTrip
 from "./pages/Trip/EditTrip";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Welcome/>} />
      <Route path="/trips/edit/:tripId" element={<ProtectedRoute><EditTrip/></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><ManageTrips /></ProtectedRoute>} />
      <Route path="/trips/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/trips/:tripId/details" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
      <Route path="/trips/:tripId/details/create" element={<ProtectedRoute><CreateTripDetails /></ProtectedRoute>} />
      <Route path="/log-trip-data" element={<ProtectedRoute><LogTripData /></ProtectedRoute>} />
      <Route path="/view-eld" element={<ProtectedRoute><ViewELD /></ProtectedRoute>} />
      <Route path="/view-hour-cycle" element={<ProtectedRoute><ViewHourCycle /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
