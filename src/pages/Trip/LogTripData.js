import React, { useState } from 'react';
import util from '../../utils/util';
import ActivityLogService from '../../services/ActivityLogService';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components

const LogTripData = () => {
  const datapoints = util.getXDatapoints();
  const indices = util.getXIndices();
  console.log("old datapoints", JSON.stringify(datapoints)); 
  console.log("old indices", JSON.stringify(indices)); 
  const [remarks, setRemarks] = useState(indices.map(() => ''));

  const handleRemarkChange = (index, value) => {
    const newRemarks = [...remarks];
    newRemarks[index] = value;
    setRemarks(newRemarks);
  };

  const handleSubmitRemarks = () => {
    const storedData = JSON.parse(localStorage.getItem('x_datapoints')) || [];

    indices.forEach((index, i) => {
      if (storedData[index]) {
        storedData[index].remark = remarks[i];
      }
    });

    localStorage.setItem('x_datapoints', JSON.stringify(storedData));
    alert('Remarks saved successfully!');
    console.log('Remarks z x_datapoints', JSON.stringify(util.getXDatapoints()));
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
        <Button variant="primary" onClick={handleSubmitRemarks}>
          Save Remarks
        </Button>
      </Form>
    </Container>
  );
};

export default LogTripData;