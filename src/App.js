import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import NavBar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";
import './App.css'; // Ensure you have this file for styles

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <div className="main-content">
          <NavBar />
          <div className="content">
            <AppRoutes />
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
