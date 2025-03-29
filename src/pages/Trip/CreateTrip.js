import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../../services/TripService";
import { Form, Button, Container } from "react-bootstrap";

const CreateTrip = () => {
  const [trip, setTrip] = useState({
    start_date: "",
    end_date: "",
    from_place: "",
    to_place: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TripService.createTrip(trip);
      navigate("/trips");
    } catch (error) {
      console.error("Error creating trip", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create New Trip</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" name="start_date" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" name="end_date" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>From</Form.Label>
          <Form.Control type="text" name="from_place" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>To</Form.Label>
          <Form.Control type="text" name="to_place" onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Trip
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTrip;
