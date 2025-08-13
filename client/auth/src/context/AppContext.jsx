import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLogedIn, SetIsLogedIn] = useState(false);
  const [user, SetUser] = useState({});
  const value = {
    backendUrl,
    isLogedIn,
    SetIsLogedIn,
    user,
    SetUser,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
