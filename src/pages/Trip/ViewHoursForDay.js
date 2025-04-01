import React, { useState, useEffect } from 'react';
import ActivityLogService from '../../services/ActivityLogService';
import { useParams } from 'react-router-dom';

const ViewHoursForDay = () => {
  const { selectedLogDetailId } = useParams();
  const [logDetails, setLogDetails] = useState(null);

  useEffect(() => {
    const fetchLogDetails = async () => {
      try {
        const data = await ActivityLogService.getLogDetailHours(selectedLogDetailId);
        if (data && data.sums) {
  
          let incremented = false;
          const updatedSums = { ...data.sums }; // Create a copy to avoid mutating the original
          for (const activity in updatedSums) {
            if (updatedSums[activity] > 0) {
              updatedSums[activity] += 1;
              incremented = true;
              break; 
            }
          }

          setLogDetails({ ...data, sums: updatedSums });
        } else {
            setLogDetails(data);
        }
      } catch (error) {
        console.error('Error fetching log details:', error);
        setLogDetails(null);
      }
    };

    fetchLogDetails();
  }, [selectedLogDetailId]);

  const convertIntervalsToHoursMinutes = (intervals) => {
    const totalMinutes = intervals * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  if (!logDetails) {
    return <div className="container mt-4">Loading... or Error fetching data.</div>;
  }

  const { sums, start_date } = logDetails;

  return (
    <div className="container mt-4">
      <h2>Activity Log for {start_date}</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Hours</th>
            <th>Minutes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(sums).map(([activity, intervals]) => {
            const { hours, minutes } = convertIntervalsToHoursMinutes(intervals);
            return (
              <tr key={activity}>
                <td>{activity}</td>
                <td>{hours}</td>
                <td>{minutes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewHoursForDay;