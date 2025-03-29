import AuthService from "./services/AuthService";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  useEffect(() => {
    // Listen for authentication changes
    const checkAuth = () => setIsAuthenticated(AuthService.isAuthenticated());
    window.addEventListener("authChange", checkAuth);
     console.log("logged in 1", checkAuth);
    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
