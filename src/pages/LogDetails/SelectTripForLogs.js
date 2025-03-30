import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../../services/TripService";
import { Form, Button, Container } from "react-bootstrap";

const SelectTripForLogs = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await TripService.getTrips();
        setTrips(response.data.results);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to fetch trips.");
      }
    };

    fetchTrips();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTripId) {
      navigate(`/trips/${selectedTripId}/logs`);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Select Trip to View Logs</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Trip</Form.Label>
          <Form.Control
            as="select"
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            required
          >
            <option value="">Select a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.from_place} to {trip.to_place} ({trip.start_date} - {trip.end_date || "Ongoing"})
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          View Logs
        </Button>
      </Form>
    </Container>
  );
};

export default SelectTripForLogs;