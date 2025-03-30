import axios from "axios";
import util from "../utils/util"

const API_URL = util.getAPIURL(); 


class AuthService {




  static async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login/`, { username, password });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("logged in successfully");
        window.dispatchEvent(new Event("authChange"));
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error; // Re-throw the error so it can be caught in handleSubmit
    }
  }

  static register(){
    
  }

  static logout() {
	 
	  localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
  }

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  static isAuthenticated() {
    console.log("isAuthenticated called value ");
    return !!localStorage.getItem("user");
  }

  static getAuthHeader() {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Token ${user.token}` };
    }
    return {};
  }
}

export default AuthService;

