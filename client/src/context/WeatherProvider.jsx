import { WeatherContext } from "./WeatherContext";
import { useState } from "react";

export const WeatherProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [city, setCity] = useState("");

  // Function to update the user information
  const loginUser = (id, email, username) => {
    const newUser = { id, email, username };
    setUser(newUser);
  };

  const logoutUser = () => {
    setUser({ id: null, email: null, username: null });
  };

  

  return (
    <WeatherContext.Provider value={{ user, city, setCity, loginUser, logoutUser }}>
      {children}
    </WeatherContext.Provider>
  );
};
