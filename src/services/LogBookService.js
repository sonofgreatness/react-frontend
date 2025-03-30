import axios from "axios";
import util from "../utils/util"; 
import authHeader from "../utils/authHeader";

const API_BASE_URL = util.getAPIURL(); 
class LogBookService{
    
static  async createLogBook(logDetailId, logBookData) {
        try {
          const response = await axios.post(`${API_BASE_URL}/log-books/${logDetailId}/`
            , logBookData, { headers: authHeader() });
          return response.data;
        } catch (error) {
          console.error('Error creating log book:', error);
          throw error; 
        }
      }

}
export  default LogBookService