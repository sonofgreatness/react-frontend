import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./Routes";
import NavBar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'leaflet/dist/leaflet.css';
const AppContent = () => {
  const location = useLocation();
  const hideNav = location.pathname === "/login" || location.pathname === "/register"|| location.pathname ==="/";

  return (
    <div className="app-layout">
      <Header />
      <div className="main-content">
        {!hideNav && <NavBar />}  {/* Hide navbar on login/register pages */}
        <div className="content">
          <AppRoutes />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
