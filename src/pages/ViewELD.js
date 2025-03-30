import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../services/TripService";
import LogDataService from "../services/LogDataService";
import LogBookService from "../services/LogBookService";
import { Form, Button, Container } from "react-bootstrap";



const ViewELD= () => {

     console.log("createLogBook"); 
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
       await LogBookService.createLogBook(selectedLogDetailId, { date });
       navigate(`/log-books/${selectedLogDetailId}`); // Navigate to log book details
     } catch (err) {
       console.error("Error creating log book:", err);
       setError("Failed to create log book.");
     }
   };
 
   return (
     <Container className="mt-4">
       <h2>Create Log Book</h2>
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
 
         <Form.Group className="mb-3">
           <Form.Label>Date</Form.Label>
           <Form.Control
             type="date"
             value={date}
             onChange={(e) => setDate(e.target.value)}
             required
           />
         </Form.Group>
 
         <Button variant="primary" type="submit">
           Create Log Book
         </Button>
       </Form>
     </Container>
   );
 };
 


export default ViewELD