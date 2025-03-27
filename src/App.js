import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://django2-nine.vercel.app/api"; // Change when deployed

function App() {
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/get/`)
      .then(response => setMessage(response.data.message))
      .catch(() => setMessage("No data found"));
  }, []);

  const handleSubmit = () => {
    axios.post(`${API_URL}/add/`, { name: "Test", message: input })
      .then(response => setMessage(response.data.message))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Stored Message: {message}</h1>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

export default App;
