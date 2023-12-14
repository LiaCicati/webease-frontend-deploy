import axios from "axios";
import { Attribute } from "@/models/Attribute";

const BASE_URL = "https://webease-cms-production.up.railway.app/api/v1/collections";

let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const addAttributeToCollection = async (
  collectionId: string,
  data: Attribute
): Promise<Attribute> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${collectionId}/attributes`,
      data,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
