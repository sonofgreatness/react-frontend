import React, { useEffect, useState } from "react";
import TripService from "../../services/TripService";
import { Link } from "react-router-dom";
import { Table, Button, Pagination } from "react-bootstrap";

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTrips(currentPage);
  }, [currentPage]);

  const loadTrips = async (page) => {
    try {
      const response = await TripService.getTrips(page);
      setTrips(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching trips", error);
    }
  };

  const deleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await TripService.deleteTrip(tripId);
        loadTrips(currentPage);
      } catch (error) {
        console.error("Error deleting trip", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Trips</h2>
      <Button variant="primary" as={Link} to="/trips/create">
        Create New Trip
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.start_date}</td>
              <td>{trip.end_date || "Ongoing"}</td>
              <td>{trip.from_place}</td>
              <td>{trip.to_place}</td>
              <td>
                {trip.end_date ? "Completed" : <span className="text-warning">Ongoing</span>}
              </td>
              <td>
                <Button variant="info" as={Link} to={`/trips/${trip.id}/details`} size="sm">
                  View Details
                </Button>{" "}
                <Button variant="warning" as={Link} to={`/trips/edit/${trip.id}`} size="sm">
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => deleteTrip(trip.id)} size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <Pagination>
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ManageTrips;
