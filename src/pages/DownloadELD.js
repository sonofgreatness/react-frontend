import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../services/TripService";
import LogDataService from "../services/LogDataService";
import ActivityLogService from "../services/ActivityLogService";
import { Form, Button, Container } from "react-bootstrap";
import jsPDF from "jspdf";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import ReactDOM from 'react-dom';

const DownloadELD = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [logDetails, setLogDetails] = useState([]);
  const [selectedLogDetailId, setSelectedLogDetailId] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [tripData, setTripData] = useState(null);
  const [logData, setLogData] = useState(null);

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

  useEffect(() => {
    const fetchLogDetails = async () => {
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

  useEffect(() => {
    const fetchActivityLogs = async () => {
      if (selectedLogDetailId) {
        try {
          const response = await ActivityLogService.getActivityLog(selectedLogDetailId);
          setActivityLogs(response.data);
        } catch (err) {
          console.error("Error fetching activity logs:", err);
          setError("Failed to fetch activity logs.");
        }
      }
    };

    fetchActivityLogs();
  }, [selectedLogDetailId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tripResponse = await TripService.getTrip(selectedTripId);
      const logResponse = await LogDataService.getLogDetails(selectedTripId);
      const activityLogData = await ActivityLogService.getActivityLog(selectedLogDetailId)
      setTripData(tripResponse.data);
      setLogData(logResponse.data.results[0]);
    

      generatePDF(tripResponse.data,logResponse ,activityLogData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data.");
    }
  };

  const generatePDF = (tripData, logData, activityLogs) =>  {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    doc.setFontSize(18);
    doc.text("Electronic Logging Device (ELD) Report", 148, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Trip: ${tripData.from_place} to ${tripData.to_place}`, 20, 30);
    doc.text(`Start Date: ${tripData.start_date}`, 20, 35);
    doc.text(`End Date: ${tripData.end_date || "Ongoing"}`, 20, 40);

    doc.text(`Log Detail Start Date: ${logData.start_date}`, 20, 50);
    doc.text(`Carrier: ${logData.name_of_carrier}`, 20, 55);
    doc.text(`Co-driver: ${logData.name_of_codriver}`, 20, 60);
    doc.text(`Shipping Doc #: ${logData.shipping_document_number}`, 20, 65);
    doc.text(`Total Miles Driven: ${logData.total_miles_driven}`, 20, 70);

    const xValues = activityLogs.map((log) => log.x_datapoint);
    const yValues = activityLogs.map((log) => {
        if (log.activity === "ONDUTY") return 1;
        if (log.activity === "DRIVING") return 2;
        if (log.activity === "SLEEPERBERTH") return 3;
        return 0;
    });

    const chartContainer = document.createElement("div");
    chartContainer.style.display = "none";
    document.body.appendChild(chartContainer);

    const chart = (
        <Line
            data={{
                labels: xValues,
                datasets: [
                    {
                        label: "Activity",
                        data: yValues,
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                        pointRadius: 5,
                    },
                ],
            }}
            options={{
                scales: {
                    y: {
                        ticks: {
                            callback: function (value, index, values) {
                                if (value === 1) return "On Duty";
                                if (value === 2) return "Driving";
                                if (value === 3) return "Sleeper Berth";
                                return "";
                            },
                        },
                    },
                },
            }}
        />
    );

    // Use ReactDOM.createRoot and root.render
    const root = ReactDOM.createRoot(chartContainer);
    root.render(chart);

    // Wait for the chart to render
    setTimeout(() => {
        const canvas = chartContainer.querySelector("canvas");
        if (canvas) {
            const imageData = canvas.toDataURL("image/png");
            doc.addImage(imageData, "PNG", 20, 80, 250, 100);
        }
        document.body.removeChild(chartContainer);
        doc.save("ELD_Report.pdf");
    }, 0); // Use setTimeout to ensure rendering completes.
};;

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