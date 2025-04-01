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

static async getLogDetailHours(logBookId){
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/log-summary/${logBookId}/`
     ,{ headers: authHeader() });
     console.log("getLogHours",JSON.stringify(response.data)); 
    return response.data;
  } catch (error) {
    console.error('Error creating activity log:', error);
    throw error;
  }
}


  static getTimeFromXDataPoint(xDataPoint) {
    console.log("getTimeFromXDataPoint Called", JSON.stringify(xDataPoint)); 

    if (xDataPoint < 1 || xDataPoint > 96) {
        throw new Error("x-datapoint must be between 1 and 96.");
    }

    const minutes = (xDataPoint.x_datapoint  - 1) * 15; // Convert xDataPoint to minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

};

export default ActivityLogService;
