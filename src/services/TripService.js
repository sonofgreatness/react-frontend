import axios from "axios";
import util from "../utils/util";
import authHeader from "../utils/authHeader";

const API_URL = util.getAPIURL(); 

class TripService {
  static async getTrips(page = 1) {
    return axios.get(`${API_URL}/trips/?page=${page}`, { headers: authHeader() });
  }

  static async getTripDetails(tripId) {
    return axios.get(`${API_URL}/trips/${tripId}/details/`, { headers: authHeader() });
  }

  static async createTrip(tripData) {
    return axios.post(`${API_URL}/trips/create/`, tripData, { headers: authHeader() });
  }

  static async updateTrip(tripId, tripData) {
    return axios.put(`${API_URL}/trips/${tripId}/update/`, tripData, { headers: authHeader() });
  }

  static async deleteTrip(tripId) {
    return axios.delete(`${API_URL}/trips/${tripId}/update/`, { headers: authHeader() });
  }

  static async getTrip(tripId){
    console.log("get trip called"); 
    return axios.get(`${API_URL}/trips/edit/${tripId}/`, { headers: authHeader() });

  }
  static async createTripDetails(tripId, tripDetails) {
    return axios.post(`${API_URL}/trips/${tripId}/details/`, tripDetails, { headers: authHeader() });
  }

  static async updateTripDetails(tripId, detailId, tripDetails) {
    return axios.put(`${API_URL}/trips/${tripId}/details/${detailId}/`, tripDetails, { headers: authHeader() });
  }

  static async deleteTripDetails(tripId, detailId) {
    return axios.delete(`${API_URL}/trips/${tripId}/details/${detailId}/`, { headers: authHeader() });
  }
}

export default TripService;
