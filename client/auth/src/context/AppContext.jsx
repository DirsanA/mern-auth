import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  // Configure axios to send credentials (cookies) with requests
  axios.defaults.withCredentials = true;

  const getUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/data`);
      if (res.data.success) {
        setUser(res.data.data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("User fetch error:", error);
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setUser({});
      }
    }
  };

  // Fetch user on initial load
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
