import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TripService from "../../services/TripService";
import { Form, Button, Container } from "react-bootstrap";

const EditTrip = () => {
  const { tripId } = useParams(); // Get trip ID from URL
  const navigate = useNavigate();

  const [trip, setTrip] = useState({
    start_date: "",
    end_date: "",
    from_place: "",
    to_place: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing trip details
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await TripService.getTrip(tripId); // Use getTrip instead of getTripDetails
        setTrip(response.data);
      } catch (err) {
        console.error("Error loading trip:", err);
        setError("Failed to load trip.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  // Handle input changes
  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TripService.updateTrip(tripId, trip);
      navigate("/trips"); // Redirect to trip list after update
    } catch (error) {
      console.error("Error updating trip", error);
      setError("Failed to update trip.");
    }
  };

  if (loading) return <p>Loading trip details...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container className="mt-4">
      <h2>Edit Trip</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={trip.start_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={trip.end_date || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>From</Form.Label>
          <Form.Control
            type="text"
            name="from_place"
            value={trip.from_place}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>To</Form.Label>
          <Form.Control
            type="text"
            name="to_place"
            value={trip.to_place}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Trip
        </Button>
      </Form>
    </Container>
  );
};

export default EditTrip;
