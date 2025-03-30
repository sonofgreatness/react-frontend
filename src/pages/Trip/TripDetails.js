import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripService from "../../services/TripService";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const TripDetails = () => {
  const { tripId } = useParams();
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTripDetails();
  }, []);

  const deleteTrip = async () => {
    try {
      await TripService.deleteTrip(tripId);
      navigate("/trips");
    } catch (error) {
      console.error("Error deleting trip", error);
      navigate("/trips");
    }
  };

  const loadTripDetails = async () => {
    try {
      const response = await TripService.getTripDetails(tripId);
      console.log("loadTrip details called", JSON.stringify(response.data));
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching trip details", error);
    }
  };

  const calculateRoute = () => {
    if (!details || !details.pickup_location || !details.dropoff_location) {
      return null;
    }

    const route = [
      details.current_location ? [details.current_location.latitude, details.current_location.longitude] : null,
      [details.pickup_location.latitude, details.pickup_location.longitude],
      [details.dropoff_location.latitude, details.dropoff_location.longitude],
    ].filter(Boolean);

    return route.length > 1 ? route : null;
  };

  const routeCoordinates = calculateRoute();

  const pickupIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const dropoffIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const currentIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="container mt-4">
      <h2>Trip Details</h2>
      {!details && (
        <Button variant="primary" href={`/trips/${tripId}/details/create`}>
          Add Trip Details
        </Button>
      )}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th style={{ backgroundColor: "lightgreen" }}>Pickup Location</th>
            <th style={{ backgroundColor: "lightcoral" }}>Dropoff Location</th>
            <th style={{ backgroundColor: "lightyellow" }}>Current Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {details ? (
            <tr key={details.id}>
              <td>
                {details.pickup_location ? (
                  `${
                    details.pickup_location.address ||
                    `${details.pickup_location.latitude}, ${details.pickup_location.longitude}`
                  }`
                ) : (
                  "No pickup location"
                )}
              </td>
              <td>
                {details.dropoff_location ? (
                  `${
                    details.dropoff_location.address ||
                    `${details.dropoff_location.latitude}, ${details.dropoff_location.longitude}`
                  }`
                ) : (
                  "No dropoff location"
                )}
              </td>
              <td>
                {details.current_location ? (
                  `${
                    details.current_location.address ||
                    `${details.current_location.latitude}, ${details.current_location.longitude}`
                  }`
                ) : (
                  "No current location"
                )}
              </td>
              <td>
                <Button variant="danger" onClick={deleteTrip} size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4">No trip details available.</td>
            </tr>
          )}
        </tbody>
      </Table>
      {details && (
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={
              routeCoordinates && routeCoordinates.length > 0
                ? routeCoordinates[0]
                : [51.505, -0.09]
            }
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {details.pickup_location && (
              <Marker position={[details.pickup_location.latitude, details.pickup_location.longitude]} icon={pickupIcon} />
            )}
            {details.dropoff_location && (
              <Marker position={[details.dropoff_location.latitude, details.dropoff_location.longitude]} icon={dropoffIcon} />
            )}
            {details.current_location && (
              <Marker position={[details.current_location.latitude, details.current_location.longitude]} icon={currentIcon} />
            )}
            {routeCoordinates && routeCoordinates.length > 1 && (
              <Polyline positions={routeCoordinates} color="blue" />
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default TripDetails;