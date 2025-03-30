import axios from "axios";
import  util from '../utils/util'; 
import authHeader from "../utils/authHeader";

const API_BASE_URL = util.getAPIURL();
class LogDataService  {
static async  getLogDetails (tripId) {
    return axios.get(`${API_BASE_URL}/trips/${tripId}/logs/`, { headers: authHeader() });
  }
  static async getLogDetail(tripId)  {
    return axios.get(`${API_BASE_URL}/trips/${tripId}/log/`, { headers: authHeader()});
  }
  static async createLogDetail (tripId, logData) {
    return axios.post(`${API_BASE_URL}/trips/${tripId}/log/create/`, logData, { headers: authHeader() });
  }
  static async updateLogDetail (tripId, logData) {
    return axios.put(`${API_BASE_URL}/trips/${tripId}/log/update/`, logData , { headers: authHeader() });
  }
  static async deleteLogDetail (tripId)  {
    return axios.delete(`${API_BASE_URL}/trips/${tripId}/log/update/`, { headers: authHeader()});
  }

};

export default LogDataService;