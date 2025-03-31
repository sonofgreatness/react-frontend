import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Stage, Layer, Line, Text } from 'react-konva';
import ActivityLogService from '../services/ActivityLogService';
import { useParams } from 'react-router-dom';

const WIDTH = 900;
const HEIGHT = 400;
const X_STEPS = 98;
const X_STEPS_T = 98; 
const Y_STEPS = 4;
const X_GAP = WIDTH / X_STEPS;
const Y_GAP = HEIGHT / Y_STEPS;
const ACTIVITIES = ['ONDUTY', 'DRIVING', 'SLEEPER_BERTH', 'OFFDUTY'];
const COLORS = ['red', 'blue', 'green', 'purple'];

const CreateELD = () => {
  const { selectedLogDetailId } = useParams();
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [indecesToUpdate, setindecesToUpdate] = useState([]);
   
  const updateChangeData = (datapoints) => {
    console.log("update change datapoints size", JSON.stringify(datapoints.length));
    const mydata = [];
    for (let x = 1; x < datapoints.length; x++) {
        // Log the entire data point to check for undefined values
        console.log(`Index ${x}:`, JSON.stringify(datapoints[x]));
        if (!datapoints[x] || !datapoints[x - 1]) {
            console.log(`Skipping index ${x} because it is undefined/null`);
            continue;  // Skip undefined/null values
        }
        console.log("looper ", JSON.stringify(datapoints[x].activity));
        if (datapoints[x].activity !== datapoints[x - 1].activity) {
            mydata.push(x);
        }
    }
    console.log("indices to update ", JSON.stringify(mydata));
    setindecesToUpdate(mydata); 
};


  const saveDataPoints = (dataPoints) => {
    console.log("save Datapoints called")
    localStorage.setItem('x_datapoints', JSON.stringify(dataPoints));
  };
  
  const loadDataPoints = () => {
    const storedData = localStorage.getItem('x_datapoints');
    return storedData ? JSON.parse(storedData) : [];
  };

  

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    // Snap to the nearest valid X point (strictly 96)
    const xIndex = Math.round(x / X_GAP);
    const snappedX = Math.min(Math.max(xIndex, 0), X_STEPS - 1) * X_GAP;
    // Snap to the nearest valid Y point (strictly 4)
    const yIndex = Math.round(y / Y_GAP);
    const snappedY = Math.min(Math.max(yIndex, 0), Y_STEPS - 1) * Y_GAP;
    setCurrentLine([{ x: snappedX, y: snappedY }]);
  };
  



  const handleMouseMove = (e) => {
    if (currentLine.length === 0) return;
  
    const { x } = e.target.getStage().getPointerPosition();
    const xIndex = Math.round(x / X_GAP);
    const snappedX = Math.min(Math.max(xIndex, 0), X_STEPS - 1) * X_GAP;
    
    // Keep y constant (use the first y position in currentLine)
    const snappedY = currentLine[0].y;
  
    // Avoid duplicate x-coordinates
    const lastX = currentLine[currentLine.length - 1].x;
    if (snappedX === lastX) return;
  
    setCurrentLine([...currentLine, { x: snappedX, y: snappedY }]);
  };

  

  const handleMouseUp = () => {
    setLines([...lines, currentLine]);
    setCurrentLine([]);
  };

  const processDataPoints = () => {
    let processedData = [];
    let lastActivity = null;
    let lastX = null;
  const rawData = lines.flatMap(line =>
      line.map(point => ({
        x_datapoint: Math.round(point.x / X_GAP) + 1,
        activity: ACTIVITIES[Math.round(point.y / Y_GAP)],
        remark: '',
      }))
    );
  rawData.sort((a, b) => a.x_datapoint - b.x_datapoint);
    for (let i = 0; i < rawData.length; i++) {
      const { x_datapoint, activity } = rawData[i];
     if (lastX !== null && x_datapoint > lastX + 1) {
        for (let j = lastX + 1; j < x_datapoint; j++) {
          processedData.push({ x_datapoint: j, activity: lastActivity, remark: '' });
        }
      }
      if (processedData.length > 0 && processedData[processedData.length - 1].x_datapoint === x_datapoint) {
        processedData[processedData.length - 1].activity = activity; // Override with the latest activity
      } else {
        processedData.push({ x_datapoint, activity, remark: '' });
      }
      lastX = x_datapoint;
      lastActivity = activity;
    }
    return processedData;
  };
  

  const handleSubmit = async () => {
    try {
      const data = processDataPoints();
       saveDataPoints(data); 
       updateChangeData(data); 
       setShowModal(true); 
 
      /*await Promise.all(
        data.map((log) =>
          ActivityLogService.createActivityLog(selectedLogDetailId, log)
        )
      );*/ 
      console.log("Activity logs created", JSON.stringify(data.length));  
      console.log(JSON.stringify(data)); 
      alert('Activity Logs created successfully!',JSON.stringify(data));
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to send activity logs.');
    }
  };

  return (
    <div>
      <h3>Draw Your Activity Log</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: WIDTH }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={`xlabel-${i}`} style={{ width: WIDTH / 24, textAlign: 'center', fontSize: 12 }}>
            {i + 1}
          </div>
        ))}
      </div>
      <Stage
        width={WIDTH}
        height={HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: 'none' }}
      >
        <Layer>
          {Array.from({ length: Y_STEPS }, (_, i) => (
            <Line key={i} points={[0, i * Y_GAP, WIDTH, i * Y_GAP]} stroke={COLORS[i]} strokeWidth={1} />
          ))}
          {Array.from({ length: 24 }, (_, i) => (
            <Line key={`blue-line-${i}`} points={[i * 4 * X_GAP, 0, i * 4 * X_GAP, HEIGHT]} 
            stroke="blue" strokeWidth={1} />
          ))}
          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
            <Line key={`dotted-${i}`} points={[((i * 2) + 1) * X_GAP, 0, ((i * 2) + 1) * X_GAP, 0.5 * Y_GAP]} stroke="black" strokeWidth={1} />
          ))}
          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
          <Line 
          key={`dotted-${i}`} 
          points={[i * 2 * X_GAP, 0, i * 2 * X_GAP, 0.75 * Y_GAP]} 
          stroke="black" 
          strokeWidth={1} />))}


          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
            <Line key={`dotted2-${i}`} points={[((i * 2) + 1) * X_GAP, Y_GAP, ((i * 2) + 1) * X_GAP, 1.5 * Y_GAP]} stroke="black" strokeWidth={1} />
          ))}
          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
        <Line 
          key={`dotted2-${i}`} 
          points={[i * 2 * X_GAP, Y_GAP, i * 2 * X_GAP, 1.75 * Y_GAP]} 
          stroke="black" 
          strokeWidth={1} />))}

          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
            <Line key={`dotted3-${i}`} points={[((i * 2) + 1) * X_GAP, 2 * Y_GAP, ((i * 2) + 1) * X_GAP, 2.5 * Y_GAP]} stroke="black" strokeWidth={1} />
          ))}
               {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
<Line  key={`dotted3-${i}`} points={[i * 2 * X_GAP, 2 * Y_GAP, i * 2 * X_GAP, 2.75 * Y_GAP]} 
    stroke="black" 
    strokeWidth={1} />))}
          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
            <Line key={`dotted4-${i}`} points={[((i * 2) + 1) * X_GAP, 3 * Y_GAP, ((i * 2) + 1) * X_GAP, 3.5 * Y_GAP]} stroke="black" strokeWidth={1} />
          ))}
          {Array.from({ length: X_STEPS_T / 2 }, (_, i) => (
  <Line 
    key={`dotted4-${i}`} 
    points={[i * 2 * X_GAP, 3 * Y_GAP, i * 2 * X_GAP, 3.75 * Y_GAP]} 
    stroke="black" 
    strokeWidth={1} 
  />
))}
          {lines.map((line, i) => (
            <Line key={i} points={line.flatMap(p => [p.x, p.y])} stroke="red" strokeWidth={4} />
          ))}
          {currentLine.length > 1 && (
            <Line points={currentLine.flatMap(p => [p.x, p.y])} stroke="red" strokeWidth={4} />
          )}
          {ACTIVITIES.map((activity, i) => (
            <Text key={activity} x={5} y={(i + 0.1) * Y_GAP} text={activity} fill={COLORS[i]} fontSize={14} />
          ))}
        </Layer>
      </Stage>
      <Button onClick={handleSubmit} variant="primary" className="mt-3">
        Submit
      </Button>
    </div>
  );
};

export default CreateELD;
