import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../services/TripService";
import LogDataService from "../services/LogDataService";
import ActivityLogService from "../services/ActivityLogService";
import { Form, Button, Container } from "react-bootstrap";
import PdfUtils from "../utils/PdfUtils";

const DownloadELD = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [logDetails, setLogDetails] = useState([]);

  const [selectedLogDetailId, setSelectedLogDetailId] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
        console.log("my fetch trips called"); 
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

  useEffect(() => {
    const fetchLogDetails = async () => {
        console.log("my fetch details called"); 
      if (selectedTripId) {
        try {
          const response = await LogDataService.getLogDetails(selectedTripId);
          setLogDetails(response.data.results);
        } catch (err) {
          console.error("Error fetching log details:", err);
          setError("Failed to fetch log details.");
        }
      }
    };

    fetchLogDetails();
  }, [selectedTripId]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tripResponse = await TripService.getTrip(selectedTripId);
      const logResponse = await LogDataService.getLogDetails(selectedTripId);
      const activityLogData = await ActivityLogService.getActivityLog(selectedLogDetailId)
      const summaries = await ActivityLogService.getLogDetailHours(selectedLogDetailId);  

    

     PdfUtils.generatePDF(tripResponse.data,logResponse.data.results[0] ,activityLogData,summaries);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data.");
    }
  };

  

  return (
    <Container className="mt-4">
      <h2>Download ELD</h2>
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

        <Form.Group className="mb-3">
          <Form.Label>Select Log Detail</Form.Label>
          <Form.Control
            as="select"
            value={selectedLogDetailId}
            onChange={(e) => setSelectedLogDetailId(e.target.value)}
            required
          >
            <option value="">Select a log detail</option>
            {logDetails.map((logDetail) => (
              <option key={logDetail.id} value={logDetail.id}>
                {logDetail.start_date}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Get PDF
        </Button>
      </Form>
    </Container>
  );
};

export default DownloadELD;