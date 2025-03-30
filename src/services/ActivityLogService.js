import axios from 'axios';
import util from "../utils/util"; 
import authHeader from '../utils/authHeader';

const API_BASE_URL =util.getAPIURL() ;


class ActivityLogService  {
 static async createActivityLog(logBookId, activityLogData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/log-books/${logBookId}/activity-logs/`,
        activityLogData
       ,{ headers: authHeader() });
      return response.data;
    } catch (error) {
      console.error('Error creating activity log:', error);
      throw error;
    }
  }
    getTimeFromXDataPoint(xDataPoint){
      console.log ("getTimeFromXDataPoint Called ",JSON.stringify(xDataPoint)); 
     if (!(1 <= xDataPoint <= 96)) {
        throw new Error("x-datapoint must be between 1 and 96.");
    }
    const minutes = (xDataPoint - 1) * 15;
    const hours = Math.floor(minutes / 60).toString();
    const remainingMinutes = minutes % 60;
    return `${hours} : ${remainingMinutes.toString().padStart(2, '0')}`;
  }
};

export default ActivityLogService;
