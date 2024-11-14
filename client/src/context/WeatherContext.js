import { createContext, useContext } from "react";

export const WeatherContext = createContext();

export const useWeather = () => {
  return useContext(WeatherContext);
};
