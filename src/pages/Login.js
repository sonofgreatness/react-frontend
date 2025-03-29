import React, { useState } from "react";
import { Link } from "react-router-dom";
import util from "../utils/util"
import AuthService from "../services/AuthService";
const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const API_URL = util.getAPIURL();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log(` habdle sign in credentials  user ${credentials.username} ,pass  ${credentials.password}`); 
    const response = await AuthService.login(credentials.username, credentials.password); // Await the login request
    window.location.href = "/home"; // Redirect after login
  } catch (error) {
    setError(error.response?.data?.error || "Login failed");
  }
};

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-3">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" type="submit">Login</button>
            <Link to="/register" className="btn btn-link">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

