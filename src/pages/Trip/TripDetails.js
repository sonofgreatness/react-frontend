import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripService from "../../services/TripService";
import { Table, Button } from "react-bootstrap";

const TripDetails = () => {
  const { tripId } = useParams();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    loadTripDetails();
  }, []);

  const loadTripDetails = async () => {
    try {
      const response = await TripService.getTripDetails(tripId);
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching trip details", error);
    }
  };
  return (
    <div className="container mt-4">
      <h2>Trip Details</h2>
      <Button variant="primary" href={`/trips/${tripId}/details/create`}>
        Add Trip Details
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
            <th>Current Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.id}>
              <td>{detail.pickup_location}</td>
              <td>{detail.dropoff_location}</td>
              <td>{detail.current_location}</td>
              <td>
                <Button variant="warning" href={`/trip-details/edit/${detail.id}`} size="sm">
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => TripService.deleteTripDetails(detail.id)} size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default TripDetails;
