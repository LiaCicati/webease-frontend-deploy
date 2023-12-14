import axios from "axios";
import { Collection } from "@/models/Collection";

const BASE_URL = "https://webease-cms-production.up.railway.app/api/v1/collections";

let TOKEN = "";

const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token") || "";
  }
  return "";
};

export const addCollection = async (data: Collection): Promise<Collection> => {
  try {
    const response = await axios.post(`${BASE_URL}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollections = async (): Promise<Collection[]> => {
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

export const getCollectionById = async (id: string): Promise<Collection> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollectionByApiId = async (
  apiId: string
): Promise<Collection> => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${apiId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
