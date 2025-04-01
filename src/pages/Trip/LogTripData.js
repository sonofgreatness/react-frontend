import React, { useState } from 'react';
import util from '../../utils/util';
import ActivityLogService from '../../services/ActivityLogService';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
const LogTripData = () => {
    
  const {selectedLogDetailId}  = useParams();
  const  navigate = useNavigate(); 
  const datapoints = util.getXDatapoints();
  const indices = util.getXIndices();
  const [remarks, setRemarks] = useState(indices.map(() => ''));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const logActivies = async() => {
  for (let i = 1; i < util.getXDatapoints().length; i++) {
    await ActivityLogService.createActivityLog(selectedLogDetailId, util.getXDatapoints()[i]);
  }
 }   
  const handleRemarkChange = (index, value) => {
    const newRemarks = [...remarks];
    newRemarks[index] = value;
    setRemarks(newRemarks);
  };

  const handleSubmitRemarks = async () => {
    setIsSubmitting(true); // Disable button on click
    try {
        const storedData = JSON.parse(localStorage.getItem("x_datapoints")) || [];
        indices.forEach((index, i) => {
            if (storedData[index]) {
                storedData[index].remark = remarks[i];
            }
        });
        localStorage.setItem("x_datapoints", JSON.stringify(storedData));
        await logActivies();
        navigate("/view-hour-cycle");
    } catch (error) {
        console.error("Error submitting remarks:", error);
    } finally {
        setIsSubmitting(false); // Re-enable button after request completes
    }
};

  return (
    <Container>
      <h2>Remarks Page</h2>
      <Form>
        {indices.map((index, i) => (
          <Row key={index} className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  Remark for change of work at{' '}
                  {ActivityLogService.getTimeFromXDataPoint(datapoints[index])}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={remarks[i]}
                  onChange={(e) => handleRemarkChange(i, e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        ))}
        <Button variant="primary" onClick={handleSubmitRemarks} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Remarks"}
            </Button>
      </Form>
    </Container>
  );
};

export default LogTripData;