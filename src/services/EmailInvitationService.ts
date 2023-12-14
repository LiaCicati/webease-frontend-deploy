import axios from "axios";
import { User } from "@/models/User";

const BASE_URL = "https://webease-cms-production.up.railway.app/api/v1/invitations";
let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const inviteUser = async (data: User): Promise<User> => {
  try {
    const response = await axios.post(`${BASE_URL}/send`, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendInvitation = async (userId: string): Promise<string> => {
  try {
    const response = await axios.post(`${BASE_URL}/resend/${userId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isTokenExpired = async (userId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/isTokenExpired/${userId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateToken = async (inviteToken: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/validateToken?token=${inviteToken}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};