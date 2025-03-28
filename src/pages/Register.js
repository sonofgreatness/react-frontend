import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', formData);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px' }}>
        <h3 className="text-center mb-3">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input className="form-control mb-2" type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
          <input className="form-control mb-2" type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
          <input className="form-control mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button className="btn btn-primary w-100" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;

