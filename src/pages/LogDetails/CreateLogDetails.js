
// CreateLogDetails.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogDataService from "../../services/LogDataService";
import { Form, Button, Container } from "react-bootstrap";

const CreateLogDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [logDetails, setLogDetails] = useState({
    start_date: "",
    total_miles_driven: "",
    name_of_carrier: "",
    main_office_address: "",
    name_of_codriver: "",
    shipping_document_number: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setLogDetails({ ...logDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LogDataService.createLogDetail(tripId, logDetails);
      navigate(`/trips/${tripId}/logs`);
    } catch (err) {
      console.error("Error creating log details:", err);
      setError("Failed to create log details.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Log Details for Trip {tripId}</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        {/* ... (Form input fields for each LogDetail field) ... */}
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" name="start_date" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Total Miles Driven</Form.Label>
          <Form.Control type="number" name="total_miles_driven" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name of Carrier</Form.Label>
          <Form.Control type="text" name="name_of_carrier" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Main Office Address</Form.Label>
          <Form.Control type="text" name="main_office_address" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name of Co-driver</Form.Label>
          <Form.Control type="text" name="name_of_codriver" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Shipping Document Number</Form.Label>
          <Form.Control type="text" name="shipping_document_number" onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Log Details
        </Button>
      </Form>
    </Container>
  );
};
export default CreateLogDetails;
