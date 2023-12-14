"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserById } from "../services/UserService";
import { User } from "@/models/User";
import Cookies from "js-cookie";
interface AuthContextType {
  user: User | null;
  isAuthenticated: () => boolean;
  setUserAuthenticated: (user: User) => void;
  resetUser: () => void;
}

// Create the context with the defined interface
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const setUserAuthenticated = (user: User) => {
    setUser(user);
  };

  const getUserIdFromToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      console.log("No token found");
      return null;
    }
    const decodedToken = parseJwt(token);
    console.log("decoded");
    console.log(decodedToken);
    return decodedToken ? decodedToken._id : null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          // If no user ID is found in the token, exit the function early
          console.log("No user ID found in token, skipping fetch user data.");
          return;
        }
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const resetUser = () => {
    setUser(null); // Reset the user state
  };

  const isAuthenticated: () => boolean = () => {
    return !!Cookies.get("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUserAuthenticated, resetUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
