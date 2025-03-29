import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../services/AuthService";
import  util  from "../utils/util"

const API_URL = util.getAPIURL()
 

const Home = () => {
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/get-entity/`, { headers: AuthService.getAuthHeader() })
      .then((response) => setMessage(response.data.message))
      .catch(() => setMessage("No data found"));
  }, []);

  const handleSubmit = () => {
    axios
      .post(
        `${API_URL}/add-entity/`,
        { name: "Test", message: input },
        { headers: AuthService.getAuthHeader() }
      )
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Stored Message: {message}</h1>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default Home;

