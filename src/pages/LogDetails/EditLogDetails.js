
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogDataService from "../../services/LogDataService";
import { Form, Button, Container } from "react-bootstrap";

const EditLogDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [logDetails, setLogDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogDetails = async () => {
      try {
        const response = await LogDataService.getLogDetail(tripId);
        setLogDetails(response.data);
      } catch (err) {
        console.error("Error fetching log details:", err);
        setError("Failed to load log details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogDetails();
  }, [tripId]);

  const handleChange = (e) => {
    setLogDetails({ ...logDetails, [e.target.name]: e.target.value });
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await LogDataService.updateLogDetail(tripId, logDetails);
        navigate(`/trips/${tripId}/logs`);
      } catch (err) {
        console.error("Error updating log details:", err);
        setError("Failed to update log details.");
      }
    };
    if (loading) return <p>Loading log details...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
      <Container className="mt-4">
        <h2>Edit Log Details for Trip {tripId}</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          {/* ... (Form input fields for each LogDetail field) ... */}
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" name="start_date" value={logDetails.start_date} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Miles Driven</Form.Label>
            <Form.Control type="number" name="total_miles_driven" value={logDetails.total_miles_driven} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name of Carrier</Form.Label>
            <Form.Control type="text" name="name_of_carrier" value={logDetails.name_of_carrier} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Main Office Address</Form.Label>
            <Form.Control type="text" name="main_office_address" value={logDetails.main_office_address} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name of Co-driver</Form.Label>
            <Form.Control type="text" name="name_of_codriver" value={logDetails.name_of_codriver || ""} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Shipping Document Number</Form.Label>
            <Form.Control type="text" name="shipping_document_number" value={logDetails.shipping_document_number} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Log Details
          </Button>
        </Form>
      </Container>
    );
  };
  export default EditLogDetails;