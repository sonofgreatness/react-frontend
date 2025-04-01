import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ManageTrips from "./pages/Trip/ManageTrips";
import CreateTrip from "./pages/Trip/CreateTrip";
import TripDetails from "./pages/Trip/TripDetails";
import CreateTripDetails from "./pages/Trip/CreateTripDetails";
import ViewELD from "./pages/ViewELD";
import Welcome from "./pages/Welcome";
import DownloadELD from "./pages/DownloadELD";
import EditTrip from "./pages/Trip/EditTrip";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import ManageLogDetails from "./pages/LogDetails/ManageLogDetails"; // Import ManageLogDetails
import CreateLogDetails from "./pages/LogDetails/CreateLogDetails"; // Import CreateLogDetails
import EditLogDetails from "./pages/LogDetails/EditLogDetails"; // Import EditLogDetails
import SelectTripForLogs from "./pages/LogDetails/SelectTripForLogs"
import CreateELD from "./pages/CreateELD";
import LogTripData from "./pages/Trip/LogTripData";
import ViewHoursForDay from "./pages/Trip/ViewHoursForDay";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Welcome />} />
      <Route path="/trips/edit/:tripId" element={<ProtectedRoute><EditTrip /></ProtectedRoute>} />
      <Route path="/log-trip-data" element={<ProtectedRoute><SelectTripForLogs /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><ManageTrips /></ProtectedRoute>} />
      <Route path="/trips/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/trips/:tripId/details" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
      <Route path="/trips/:tripId/details/create" element={<ProtectedRoute><CreateTripDetails /></ProtectedRoute>} />
      <Route path="/trips/:tripId/logs" element={<ProtectedRoute><ManageLogDetails /></ProtectedRoute>} /> {/* Add ManageLogDetails route */}
      <Route path="/trips/:tripId/log/create" element={<ProtectedRoute><CreateLogDetails /></ProtectedRoute>} /> {/* Add CreateLogDetails route */}
      <Route path="/trips/:tripId/log/edit/:logId" element={<ProtectedRoute><EditLogDetails /></ProtectedRoute>} /> {/* Add EditLogDetails route */}
      <Route path="/log-books/:selectedLogDetailId" element={<ProtectedRoute><CreateELD/></ProtectedRoute>} />
      <Route path="/view-eld" element={<ProtectedRoute><ViewELD/></ProtectedRoute>} />
      
      
      <Route path="/log-books/create-eld/:selectedLogDetailId" element={<ProtectedRoute><LogTripData/></ProtectedRoute>} />
      
      <Route path="/view-hour-cycle/day/:selectedLogDetailId" element={<ProtectedRoute><ViewHoursForDay /></ProtectedRoute>} />
      
      <Route path="/view-hour-cycle" element={<ProtectedRoute><DownloadELD /></ProtectedRoute>} />
    
    </Routes>
  );
};

export default AppRoutes;