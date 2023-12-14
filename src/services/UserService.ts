import axios from "axios";
import { User } from "@/models/User";
import Cookies from "js-cookie";

const BASE_URL = "https://webease-cms-production.up.railway.app/api/v1/users";
let TOKEN = "";

const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token") || "";
  }
  return "";
};

export const checkUserAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

export const loginUser = async (data: User): Promise<string> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setPassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  try {
    await axios.patch(
      `${BASE_URL}/setPassword/${userId}`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  updateData: Partial<User>
): Promise<User> => {
  try {
    const response = await axios.patch(`${BASE_URL}/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("token");
  }
  Cookies.remove("token");
};
