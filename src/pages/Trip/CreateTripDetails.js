import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TripService from "../../services/TripService";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Form, Button, Container, Badge, Alert } from "react-bootstrap";

const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const CreateTripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [tripDetails, setTripDetails] = useState({
    pickup_location: null,
    dropoff_location: null,
    current_location: null,
  });

  const [selectedType, setSelectedType] = useState("pickup_location");
  const [highlight, setHighlight] = useState(null);
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    if (highlight) {
      setTimeout(() => setHighlight(null), 1500);
    }
  }, [highlight]);

  const handleLocationSelect = (latlng) => {
    setTripDetails((prev) => ({
      ...prev,
      [selectedType]: latlng,
    }));
    setHighlight(selectedType);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tripDetails.pickup_location || !tripDetails.dropoff_location) {
      setError("Please set both pickup and dropoff locations.");
      return;
    }

    try {
      const tripData = {
        pickup_location: `${tripDetails.pickup_location.lat},${tripDetails.pickup_location.lng}`,
        dropoff_location: `${tripDetails.dropoff_location.lat},${tripDetails.dropoff_location.lng}`,
        current_location: tripDetails.current_location
          ? `${tripDetails.current_location.lat},${tripDetails.current_location.lng}`
          : null,
      };

      await TripService.createTripDetails(tripId, tripData);
      navigate(`/trips/${tripId}/details`);
    } catch (error) {
      console.error("Error creating trip details", error);
      setError("Failed to create trip details. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Trip Details</h2>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
      <Form onSubmit={handleSubmit}>
        {/* Pickup Location */}
        <Form.Group className="mb-3">
          <Form.Label>Pickup Location</Form.Label>
          <div className={`p-2 border rounded ${highlight === "pickup_location" ? "bg-success text-white" : ""}`}>
            <Form.Control
              type="text"
              value={tripDetails.pickup_location ? `${tripDetails.pickup_location.lat}, ${tripDetails.pickup_location.lng}` : ""}
              readOnly
              required
            />
            {tripDetails.pickup_location && <Badge bg="success">✅ Location Set</Badge>}
          </div>
        </Form.Group>

        {}
        <Form.Group className="mb-3">
          <Form.Label>Dropoff Location</Form.Label>
          <div className={`p-2 border rounded ${highlight === "dropoff_location" ? "bg-primary text-white" : ""}`}>
            <Form.Control
              type="text"
              value={tripDetails.dropoff_location ? `${tripDetails.dropoff_location.lat}, ${tripDetails.dropoff_location.lng}` : ""}
              readOnly
              required
            />
            {tripDetails.dropoff_location && <Badge bg="primary">✅ Location Set</Badge>}
          </div>
        </Form.Group>

        {/* Current Location */}
        <Form.Group className="mb-3">
          <Form.Label>Current Location</Form.Label>
          <div className={`p-2 border rounded ${highlight === "current_location" ? "bg-warning text-dark" : ""}`}>
            <Form.Control
              type="text"
              value={tripDetails.current_location ? `${tripDetails.current_location.lat}, ${tripDetails.current_location.lng}` : ""}
              readOnly
            />
            {tripDetails.current_location && <Badge bg="warning">✅ Location Set</Badge>}
          </div>
        </Form.Group>

        {/* Select Location Type */}
        <h5>Select Location on Map</h5>
        <p>Select a location type, then click on the map to set its coordinates.</p>
        <div className="mb-3">
          <Button variant={selectedType === "pickup_location" ? "success" : "outline-success"} onClick={() => setSelectedType("pickup_location")}>
            Set Pickup Location
          </Button>{" "}
          <Button variant={selectedType === "dropoff_location" ? "primary" : "outline-primary"} onClick={() => setSelectedType("dropoff_location")}>
            Set Dropoff Location
          </Button>{" "}
          <Button variant={selectedType === "current_location" ? "warning" : "outline-warning"} onClick={() => setSelectedType("current_location")}>
            Set Current Location
          </Button>
        </div>

        {/* Map */}
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "300px", width: "100%" }}>
          <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
          {tripDetails.pickup_location && <Marker position={[tripDetails.pickup_location.lat, tripDetails.pickup_location.lng]} />}
          {tripDetails.dropoff_location && <Marker position={[tripDetails.dropoff_location.lat, tripDetails.dropoff_location.lng]} />}
          {tripDetails.current_location && <Marker position={[tripDetails.current_location.lat, tripDetails.current_location.lng]} />}
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </MapContainer>

        <Button variant="primary" type="submit" className="mt-3">
          Save Trip Details
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTripDetails;
