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
    const { x, y } = e.target.getStage().getPointerPosition();
    // Snap to valid X positions (strictly 96)
    const xIndex = Math.round(x / X_GAP);
    const snappedX = Math.min(Math.max(xIndex, 0), X_STEPS - 1) * X_GAP;
    // Snap to valid Y positions (strictly 4)
    const yIndex = Math.round(y / Y_GAP);
    const snappedY = Math.min(Math.max(yIndex, 0), Y_STEPS - 1) * Y_GAP;
    // Only allow distinct x-coordinates (avoid unnecessary in-between points)
    if (currentLine.length > 0) {
      const lastX = currentLine[currentLine.length - 1].x;
      if (snappedX === lastX) return;  // Ignore redundant points
    }
  
    setCurrentLine([...currentLine, { x: snappedX, y: snappedY }]);
  };
  

  const handleMouseUp = () => {
    setLines([...lines, currentLine]);
    setCurrentLine([]);
  };

  const processDataPoints = () => {
    const processedData = lines.flatMap(line =>
      line.map(point => ({
        x_datapoint: Math.round(point.x / X_GAP) + 1,
        activity: ACTIVITIES[Math.round(point.y / Y_GAP)],
        remark: '',
      }))
    );
    return processedData;
  };

  const handleSubmit = async () => {
    try {
      const data = processDataPoints();
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
