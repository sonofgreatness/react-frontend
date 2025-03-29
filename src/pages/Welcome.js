import React from "react";
import { Link } from "react-router-dom";
import util  from "../utils/util"

const Welcome = () => {
  const   ADMINURL = util.getAPIADMINURL(); 

  const handleSubmit = async () => {
    try {
     window.location.href = ADMINURL;
    } catch (error) {
      console.log(error.response?.data?.error || "An error occurred");
    }
  };

  
  return (
    <div style={{width:600}}>
      <h1>Welcome to Our App!</h1>
      <p>Choose how you want to log in </p>
        <div className="d-flex justify-content-between">
        <Link to="/home">
        <button className="btn btn-primary">As Driver</button>
        </Link>
        <button className="btn btn-primary" onClick={handleSubmit}>As Admin</button>
        </div>
    </div>
  );
};

export default Welcome;

