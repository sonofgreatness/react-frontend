import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LogDataService from "../../services/LogDataService";
import TripService from "../../services/TripService"; // Import TripService
import { Table, Button, Container } from "react-bootstrap";

const ManageLogDetails = () => {
  const { tripId } = useParams();
  const [logDetails, setLogDetails] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState(null); // State to store trip data

  useEffect(() => {
    const fetchLogDetailsAndTrip = async () => {
      try {
        console.log("about to get LogDetails"); 
        const logResponse = await LogDataService.getLogDetails(tripId);
        setLogDetails(logResponse.data.results);
        console.log("logResponse", JSON.stringify(logResponse));
        const tripResponse = await TripService.getTrip(tripId); // Fetch trip data
        setTripData(tripResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogDetailsAndTrip();
  }, [tripId]);

  const handleDelete = async (logId) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      try {
        await LogDataService.deleteLogDetail(tripId, logId);
        setLogDetails(logDetails.filter((log) => log.id !== logId));
      } catch (err) {
        console.error("Error deleting log details:", err);
        setError("Failed to delete log details.");
      }
    }
  };

  if (loading) return <p>Loading log details...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container className="mt-4">
      {tripData && (
        <h6>
          Log Details for Trip: {tripData.from_place} to {tripData.to_place} (
          {tripData.start_date} - {tripData.end_date || "Ongoing"})
        </h6>
      )}
      {!logDetails.length && (
      <Button as={Link} to={`/trips/${tripId}/log/create`} variant="primary">
        Add Log Details
      </Button>)
      }
      {logDetails && logDetails.length > 0 && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>Total Miles Driven</th>
              <th>Name of Carrier</th>
              <th>Main Office Address</th>
              <th>Name of Co-driver</th>
              <th>Shipping Document Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logDetails.map((log) => (
              <tr key={log.id}>
                <td>{log.start_date}</td>
                <td>{log.total_miles_driven}</td>
                <td>{log.name_of_carrier}</td>
                <td>{log.main_office_address}</td>
                <td>{log.name_of_codriver || "N/A"}</td>
                <td>{log.shipping_document_number}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/trips/${tripId}/log/edit/${log.id}`}
                    variant="warning"
                    size="sm"
                  >
                    Edit
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(log.id)} size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManageLogDetails;