import { Post } from "@/models/Post";
import axios from "axios";

const BASE_URL = "https://webease-cms-production.up.railway.app/api/v1";
let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const addPost = async (
  collectionId: string,
  postData: Post
): Promise<Post> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/posts/${collectionId}`,
      postData,
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

export const getPostsByCollectionId = async (
  collectionId: string
): Promise<Post[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/posts/collection/${collectionId}`,
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

export const getPostById = async (id: string): Promise<Post> => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (
  collectionId: string,
  postId: string,
  postData: Partial<Post>
): Promise<Post> => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/posts/${collectionId}/${postId}`,
      postData,
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

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await axios.delete(
      `${BASE_URL}/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};