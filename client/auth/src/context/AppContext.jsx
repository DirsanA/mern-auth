// src/context/AppContext.js
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  // Always send cookies/session with every request
  axios.defaults.withCredentials = true;

  // Function to fetch logged-in user data
  const getUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/data`);
      if (res.data.success) {
        setUser(res.data.data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    } catch (error) {
      console.error("User fetch error:", error);
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setUser({});
      }
    }
  };

  // Fetch user once on app load
  useEffect(() => {
    getUser();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    getUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
