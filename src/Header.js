import React from "react";
import AuthService from "./services/AuthService";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
 
	AuthService.logout(); 
    navigate("/login"); 
  };

  return (
    <header className="header">
      <h1>SpotterAI Trucking Company</h1>
	  { !!AuthService.isAuthenticated() &&(
	  <button className="btn btn-danger" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>)}
    </header>
  );
};

export default Header;




