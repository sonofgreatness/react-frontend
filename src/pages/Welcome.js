import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div>
      <h1>Welcome to Our App!</h1>
      <p>This is the welcome page.</p>
      <Link to="/home">
        <button>Go to Home</button>
      </Link>
    </div>
  );
};

export default Welcome;

