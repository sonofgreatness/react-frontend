import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "https://django2-nine.vercel.app/api";

class AuthService {
  static login(username, password) {
    return axios.post(`${API_URL}/login/`, { username, password }).then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
  }

  static logout() {
    localStorage.removeItem("user");
  }

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  static isAuthenticated() {
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

