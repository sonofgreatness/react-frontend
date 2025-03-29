import AuthService from "../services/AuthService";

const authHeader = () => {
  return AuthService.getAuthHeader(); // Returns { Authorization: `Token ${user.token}` } if logged in
};

export default authHeader;
