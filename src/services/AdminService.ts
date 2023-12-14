import axios from "axios";
import { User } from "@/models/User";

const BASE_URL = "https://webease-cms-production.up.railway.app/api/v1/admin";

export const checkAdminExists = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerAdmin = async (data: User): Promise<User> => {
  try {
    const response = await axios.post(`${BASE_URL}/initialize`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
