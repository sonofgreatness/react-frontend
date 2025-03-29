import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="sidebar">
      <h2>SpotterAI</h2>
      <ul>
        <li><Link to="/trips">Manage Trips</Link></li>
        <li><Link to="/log-trip-data">Log Trip Data (ELD)</Link></li>
        <li><Link to="/view-eld">View ELD</Link></li>
        <li><Link to="/view-hour-cycle">View Hour Cycle</Link></li>
        <li><Link to="/">Welcome</Link></li>
        <li><Link to="/home">Home</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
